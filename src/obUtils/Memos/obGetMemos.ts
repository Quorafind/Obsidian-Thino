import { moment, Notice, TFile } from 'obsidian';
import { getAPI } from 'obsidian-dataview';
import { t } from '../../translations/helper';
import { getDailyNotePath } from '../../helpers/utils';
import { dailyNotesService } from '../../services';
import MemosPlugin from '../../memosIndex';

export class DailyNotesFolderMissingError extends Error {}

interface matchResult {
    match: number;
    header: boolean;
    headerArray?: RegExpMatchArray;
}

interface allKindsofMemos {
    memos: Model.Memo[];
    commentMemos: Model.Memo[];
}

interface timeMatch {
    hour: string;
    minute: string;
    second?: string;
}

const getMemoType = (line: string): string => {
    let memoType;

    const extractMemoTaskTypeFromLine = (line: string) =>
        //eslint-disable-next-line
        /^\s*[\-\*]\s(\[(.{1})\])\s(.*)$/.exec(line)?.[2];

    if (!/^\s*[-*]\s(\[(.)\])\s/g.test(line)) {
        memoType = 'JOURNAL';
        return memoType;
    }

    let memoTaskType = extractMemoTaskTypeFromLine(line);
    switch (memoTaskType) {
        case ' ':
            memoType = 'TASK-TODO';
            break;
        case 'x':
            memoType = 'TASK-DONE';
            break;
        case 'X':
            memoType = 'TASK-DONE';
            break;
        default:
            memoType = 'TASK-' + memoTaskType;
            break;
    }
    return memoType;
};

const buildRegexForMemoComposition = (plugin: MemosPlugin): RegExp => {
    let regexMatch = '(-|\\*) (\\[(.{1})\\]\\s)?((\\<time\\>)?\\d{1,2}\\:\\d{2})?';
    const DefaultMemoComposition = plugin.settings.DefaultMemoComposition;

    if (DefaultMemoComposition === '') {
        new Notice(t('Memo Composition is empty. Please check your settings.'));
        return new RegExp(regexMatch, 'g');
    }
    if (!DefaultMemoComposition.contains('{TIME}') || !DefaultMemoComposition.contains('{CONTENT}')) {
        new Notice(t('Memo Composition is not set correctly. Please check your settings.'));
        return new RegExp(regexMatch, 'g');
    }

    //eslint-disable-next-line
    regexMatch = '(-|\\*)\\s(\\[(.{1})\\]\\s)?' + plugin.settings.DefaultMemoComposition.replace(/{TIME}/g, '((\\<time\\>)?\\d{1,2}:\\d{2})?(\\<time\\>)?').replace(/\s{CONTENT}/g, '');

    return new RegExp(regexMatch, 'g');
};

// Check if daily note contains memos
export async function checkMemosLocation(note: TFile, plugin: MemosPlugin): Promise<matchResult> {
    if (!note) {
        return {
            match: 0,
            header: false,
        };
    }

    const { ProcessEntriesBelow } = plugin.settings;
    const content: string = await app.vault.read(note);
    const regExp = buildRegexForMemoComposition(plugin);
    const match = (content.match(regExp) || []).length;

    // Two cases:
    // 1. when we do not set heading for processing, the match is from the whole daily note.
    // 2. when we set heading for processing, the match is from the heading, so if there is no
    // corresponding heading, the match should return 0.
    if (!ProcessEntriesBelow) {
        return {
            match: match,
            header: false,
        };
    }

    const re = new RegExp(ProcessEntriesBelow.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
    const processEntriesHeader = (content.match(re) || []).length;
    const headerMatchArray = content.match(re);

    if (processEntriesHeader) {
        return {
            match: match,
            header: true,
            headerArray: headerMatchArray,
        };
    }
    return { match: match, header: false };
}

// Memos is list in the daily note, so if set CommentOnMemos true and set CommentsInOriginalNotes true,
// we need to get the comment memos from the daily note.
const getCommentForMemos = (path: string, plugin: MemosPlugin): any[] => {
    let comments: any = [];
    const dataviewAPI = getAPI();
    const { CommentOnMemos, CommentsInOriginalNotes, ProcessEntriesBelow } = plugin.settings;

    if (!dataviewAPI) return [];

    if (CommentOnMemos && CommentsInOriginalNotes && dataviewAPI.version.compare('>=', '0.5.9') === true) {
        if (!dataviewAPI || ProcessEntriesBelow === '') {
            try {
                comments = dataviewAPI.page(path)?.file.lists.values?.filter((item: any) => item.children.length > 0);
            } catch (e) {
                console.error(e);
            }

            return comments ? comments : [];
        }

        try {
            comments = dataviewAPI.page(path)?.file.lists.values?.filter((item: any) => item.header.subpath === ProcessEntriesBelow?.replace(/#{1,} /g, '').trim() && item.children.length > 0);
        } catch (e) {
            console.error(e);
        }
        return comments ? comments : [];
    }
};

const lineContainsParseBelowToken = (line: string, ProcessEntriesBelow: string): boolean => {
    if (ProcessEntriesBelow === '') {
        return true;
    }
    const re = new RegExp(ProcessEntriesBelow.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), '');
    return re.test(line);
};

export async function getMemos(): Promise<allKindsofMemos> {
    const files = dailyNotesService.getData();
    const plugin = dailyNotesService.getPlugin();

    if (files.length === 0) return;

    let memos: Model.Memo[] | PromiseLike<Model.Memo[]> = [];
    let commentMemos: Model.Memo[] | PromiseLike<Model.Memo[]> = [];

    const memoInit = (line: string, startDate: any, plugin: MemosPlugin): allKindsofMemos => {
        const { DefaultMemoComposition } = plugin.settings;
        const time = extractTimeFromBulletLine(line, DefaultMemoComposition);

        startDate.set({
            hours: parseInt(time.hour),
            minutes: parseInt(time.minute),
            seconds: parseInt(time.second),
        });

        const endDate = startDate.clone();

        const memoType = getMemoType(line);
        const rawText = extractTextFromTodoLine(line, DefaultMemoComposition).trim();

        let originId = '';
        if (!rawText) continue;

        if (rawText !== '') {
            let hasId = Math.random().toString(36).slice(-6);
            originId = hasId;
            let linkId = '';
            if (plugin.settings.CommentOnMemos && /comment:(.*)#\^\S{6}]]/g.test(rawText)) {
                linkId = extractCommentFromLine(rawText);
            }
            if (/\^\S{6}$/g.test(rawText)) {
                hasId = rawText.slice(-6);
                originId = hasId;
            }
            memos.push({
                id: startDate.format('YYYYMMDDHHmmSS') + i,
                content: rawText,
                createdAt: startDate.format('YYYY/MM/DD HH:mm:SS'),
                updatedAt: endDate.format('YYYY/MM/DD HH:mm:SS'),
                memoType: memoType,
                hasId: hasId,
                linkId: linkId,
                path: file.path,
            });
            continue;
        }
        if (/comment:(.*)#\^\S{6}]]/g.test(rawText) && plugin.settings.CommentOnMemos && !plugin.settings.CommentsInOriginalNotes) {
            const commentId = extractCommentFromLine(rawText);
            const hasId = '';
            commentMemos.push({
                id: startDate.format('YYYYMMDDHHmmSS') + i,
                content: rawText,
                createdAt: startDate.format('YYYY/MM/DD HH:mm:SS'),
                updatedAt: endDate.format('YYYY/MM/DD HH:mm:SS'),
                memoType: memoType,
                hasId: hasId,
                linkId: commentId,
            });
            continue;
        }
        if (rawText === '' || rawText.contains(' comment') || !underComments) continue;

        const originalText = line.replace(/^[-*]\s(\[(.{1})\]\s?)?/, '')?.trim();
        const commentsInMemos = underComments?.filter((item) => item.text === originalText || item.line === i || item.blockId === originId);

        if (commentsInMemos.length === 0) continue;

        if (commentsInMemos[0].children?.length === 0) continue;

        for (let j = 0; j < commentsInMemos[0].children.length; j++) {
            // console.log(commentsInMemos[0].children.values[j].text);
            const hasId = '';
            let commentTime;
            if (/^\d{12}/.test(commentsInMemos[0].children[j].text)) {
                commentTime = commentsInMemos[0].children[j].text?.match(/^\d{14}/)[0];
            } else {
                commentTime = startDate.format('YYYYMMDDHHmmSS');
            }
            commentMemos.push({
                id: commentTime + commentsInMemos[0].children[j].line,
                content: commentsInMemos[0].children[j].text,
                createdAt: moment(commentTime, 'YYYYMMDDHHmmSS').format('YYYY/MM/DD HH:mm:SS'),
                updatedAt: moment(commentTime, 'YYYYMMDDHHmmSS').format('YYYY/MM/DD HH:mm:SS'),
                memoType: getMemoType(commentsInMemos[0].children[j].status),
                hasId: hasId,
                linkId: originId,
                path: commentsInMemos[0].children[j].path,
            });
        }
    };

    const getMemosFromDailyNote = async (file: TFile | null): Promise<allKindsofMemos> => {
        if (!file) {
            return {
                memos: [],
                commentMemos: [],
            };
        }

        const getHeaderContent = async (dailyNote: TFile, matchResult: matchResult): Promise<string[]> => {
            const content = await app.vault.read(dailyNote);
            let parseContent: string = content;

            if (matchResult.header === true) {
                const matchArray = matchResult.headerArray;
                const pos = content.indexOf(matchArray[0]);
                parseContent = content.substring(pos).trim();
            }

            return parseContent ? getAllLinesFromFile(parseContent) : [];
        };

        const format = dailyNotesService.getDateFormat();
        const { ProcessEntriesBelow, CommentsInOriginalNotes, DefaultMemoComposition } = plugin.settings;

        const memosResult = await checkMemosLocation(file, plugin);
        const memos: Model.Memo[] = [];
        const commentMemos: Model.Memo[] = [];

        if (memosResult.match === 0) return;

        const underComments = getCommentForMemos(file.path, plugin);
        let fileLines = await getHeaderContent(file, memosResult);

        if (!fileLines.length) return;

        let date = moment(file.basename, format).startOf('day');

        let processHeaderFound = false;

        for (let i = 0; i < fileLines.length; i++) {
            const line = fileLines[i].trim();

            if (line.length === 0) continue;
            if (!new RegExp(/(^((\d+\.)|-|\*|\+)(\s)(.*)(?:$)?)/g).test(line)) continue;

            if (processHeaderFound == false && lineContainsParseBelowToken(line, ProcessEntriesBelow)) processHeaderFound = true;
            if (processHeaderFound == true && !lineContainsParseBelowToken(line, ProcessEntriesBelow) && /^#{1,} /g.test(line)) processHeaderFound = false;

            if (!lineContainsTime(line, CommentsInOriginalNotes, DefaultMemoComposition) || !processHeaderFound) continue;

            const memo = memoInit(line, date, plugin);
        }
    };

    const getMemosFromNote = async (allMemos: any[], commentMemos: any[]): Promise<void> => {
        const dataviewAPI = getAPI();
        if (!dataviewAPI) return;

        const notes = dataviewAPI.pages(plugin.settings.FetchMemosMark);
        const dailyNotesPath = getDailyNotePath();
        let files = notes?.values;
        if (files.length === 0) return;

        files = files.filter((item: any) => ![dailyNotesPath, plugin.settings.QueryFileName, plugin.settings.DeleteFileName].contains(item.file.name) && !item['excalidraw-plugin'] && !item['kanban-plugin']);

        for (let i = 0; i < files.length; i++) {
            const createDate = files[i]['created'].trim();
            // console.log(files[i]);
            const list = files[i].file.lists?.filter((item: any) => !item.parent);
            if (list.length === 0) continue;
            for (let j = 0; j < list.length; j++) {
                const content = list.values[j].text;
                const header = list.values[j].header.subpath;
                const path = list.values[j].path;
                const line = list.values[j].line;
                let memoType = 'JOURNAL';
                let hasId;
                // let realCreateDate = moment(createDate, 'YYYY-MM-DD HH:mm');
                let realCreateDate = createDate.toFormat('yyyy-MM-dd HH:mm');
                if (/\^\S{6}$/g.test(content)) {
                    hasId = content.slice(-6);
                    // originId = hasId;
                } else {
                    hasId = Math.random().toString(36).slice(-6);
                }
                if (list.values[j].task === true) {
                    memoType = getMemoType(list.values[j].status);
                }
                if (header !== undefined) {
                    if (moment(header).isValid()) {
                        realCreateDate = moment(header);
                        // realCreateDate = momentDate.format('YYYYMMDDHHmmSS');
                    }
                }

                if (/^\d{2}:\d{2}/g.test(content)) {
                    const time = content.match(/^\d{2}:\d{2}/)[0];
                    const timeArr = time.split(':');
                    const hour = parseInt(timeArr[0], 10);
                    const minute = parseInt(timeArr[1], 10);
                    realCreateDate = moment(realCreateDate).hours(hour).minutes(minute);

                    // createDate = date.format('YYYYMMDDHHmmSS');
                }
                allMemos.push({
                    id: realCreateDate.format('YYYYMMDDHHmmSS') + line,
                    content: content,
                    user_id: 1,
                    createdAt: realCreateDate.format('YYYY/MM/DD HH:mm:SS'),
                    updatedAt: realCreateDate.format('YYYY/MM/DD HH:mm:SS'),
                    memoType: memoType,
                    hasId: hasId,
                    linkId: '',
                    path: path,
                });
                // Get Comment Memos From Note
                if (list.values[j].children?.values.length > 0) {
                    for (let k = 0; k < list[j].children.length; k++) {
                        const childContent = list[j].children[k].text;
                        const childLine = list[j].children[k].line;
                        let childMemoType = 'JOURNAL';
                        let childRealCreateDate = realCreateDate;
                        let commentTime;
                        if (list[j].children[k].task === true) {
                            childMemoType = getMemoType(list[j].children[k].status);
                        }
                        if (/^\d{12}/.test(childContent)) {
                            commentTime = childContent?.match(/^\d{14}/)[0];
                            childRealCreateDate = moment(commentTime, 'YYYYMMDDHHmmSS');
                        }

                        if (/^\d{2}:\d{2}/g.test(childContent)) {
                            const time = childContent.match(/^\d{2}:\d{2}/)[0];
                            const timeArr = time.split(':');
                            const hour = parseInt(timeArr[0], 10);
                            const minute = parseInt(timeArr[1], 10);
                            childRealCreateDate = childRealCreateDate.hours(hour).minutes(minute);
                            // createDate = date.format('YYYYMMDDHHmmSS');
                        }
                        commentMemos.push({
                            id: childRealCreateDate.format('YYYYMMDDHHmmSS') + childLine,
                            content: childContent,
                            user_id: 1,
                            createdAt: childRealCreateDate.format('YYYY/MM/DD HH:mm:SS'),
                            updatedAt: childRealCreateDate.format('YYYY/MM/DD HH:mm:SS'),
                            memoType: childMemoType,
                            hasId: '',
                            linkId: hasId,
                            path: path,
                        });
                        // if()
                    }
                }
            }
        }
        return;
    };

    for (let i = 0; i++; i < files.length) {
        const tempResult = await getMemosFromDailyNote(files[i]);
        memos = [...memos, ...tempResult.memos];
        commentMemos = [...commentMemos, ...tempResult.commentMemos];
    }

    if (plugin.settings.FetchMemosFromNote) {
        await getMemosFromNote(memos, commentMemos);
    }

    return { memos, commentMemos };
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);

const lineContainsTime = (line: string, CommentsInOriginalNotes: boolean, DefaultMemoComposition: string) => {
    let regexMatch;
    let indent = '\\s*';
    if (CommentsInOriginalNotes) {
        indent = '';
    }
    if (DefaultMemoComposition != '' && /{TIME}/g.test(DefaultMemoComposition) && /{CONTENT}/g.test(DefaultMemoComposition)) {
        //eslint-disable-next-line
        regexMatch = '^' + indent + '(-|\\*)\\s(\\[(.{1})\\]\\s)?' + DefaultMemoComposition.replace(/{TIME}/g, '(\\<time\\>)?\\d{1,2}:\\d{2}(\\<\\/time\\>)?').replace(/{CONTENT}/g, '(.*)$');
    } else {
        //eslint-disable-next-line
        regexMatch = '^' + indent + '(-|\\*)\\s(\\[(.{1})\\]\\s)?(\\<time\\>)?\\d{1,2}\\:\\d{2}(.*)$';
    }
    const regexMatchRe = new RegExp(regexMatch, '');

    return regexMatchRe.test(line);
};

const extractTextFromTodoLine = (line: string, DefaultMemoComposition: string) => {
    let regexMatch;
    if (DefaultMemoComposition != '' && /{TIME}/g.test(DefaultMemoComposition) && /{CONTENT}/g.test(DefaultMemoComposition)) {
        //eslint-disable-next-line
        regexMatch = '^(\\s*)[\\-\\*]\\s(\\[(.{1})\\]\\s?)?' + DefaultMemoComposition.replace(/{TIME}/g, '(\\<time\\>)?((\\d{1,2})\\:(\\d{2}))?(\\<\\/time\\>)?').replace(/{CONTENT}/g, '(.*)$');
    } else {
        //eslint-disable-next-line
        regexMatch = '^(\\s*)[\\-\\*]\\s(\\[(.{1})\\]\\s?)?(\\<time\\>)?((\\d{1,2})\\:(\\d{2}))?(\\<\\/time\\>)?\\s?(.*)$';
    }
    const regexMatchRe = new RegExp(regexMatch, '');
    //eslint-disable-next-line
    return regexMatchRe.exec(line)?.[9];
};

const extractTimeFromBulletLine = (line: string, DefaultMemoComposition: string): timeMatch => {
    let regexTimeMatch = '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(.*)$';
    if (!DefaultMemoComposition.trim() || !DefaultMemoComposition?.contains('{TIME}') || !DefaultMemoComposition?.contains('{CONTENT}')) {
        new Notice(t('Memo Composition is not set correctly. Please check your settings.'));
        return {
            hour: new RegExp(regexTimeMatch, '').exec(line)?.[4],
            minute: new RegExp(regexTimeMatch, '').exec(line)?.[5],
        };
    }

    regexTimeMatch = '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?' + DefaultMemoComposition.replace(/{TIME}/g, '(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(\\<\\/time\\>)?').replace(/{CONTENT}/g, '(.*)$');

    return {
        hour: new RegExp(regexTimeMatch, '').exec(line)?.[4],
        minute: new RegExp(regexTimeMatch, '').exec(line)?.[5],
    };
};

// The below line excludes entries with a ':' after the time as I was having issues with my calendar
// being pulled in. Once made configurable will be simpler to manage.
// return /^\s*[\-\*]\s(\[(\s|x|X|\\|\-|\>|D|\?|\/|\+|R|\!|i|B|P|C)\]\s)?(\<time\>)?\d{1,2}\:\d{2}[^:](.*)$/.test(line);

// Get comment Id
const extractCommentFromLine = (line: string) => {
    const regex = '#\\^(\\S{6})';
    const regexMatchRe = new RegExp(regex, '');
    return regexMatchRe.exec(line)[1];
};
