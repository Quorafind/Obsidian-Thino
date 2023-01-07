import { moment, normalizePath, Notice, TFile, TFolder } from 'obsidian';
import { getAllDailyNotes, getDateFromFile } from 'obsidian-daily-notes-interface';
import appStore from '../stores/appStore';
import {
  CommentOnMemos,
  CommentsInOriginalNotes,
  DefaultMemoComposition,
  DeleteFileName,
  FetchMemosFromNote,
  FetchMemosMark,
  ProcessEntriesBelow,
  QueryFileName,
} from '../memosView';
import { getAPI } from 'obsidian-dataview';
import { t } from '../translations/helper';
import { getDailyNotePath } from '../helpers/utils';

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

const buildRegexForMemoComposition = (): RegExp => {
  let regexMatch = '(-|\\*) (\\[(.{1})\\]\\s)?((\\<time\\>)?\\d{1,2}\\:\\d{2})?';
  if (DefaultMemoComposition === '') {
    new Notice(t('Memo Composition is empty. Please check your settings.'));
    return new RegExp(regexMatch, 'g');
  }
  if (!DefaultMemoComposition.contains('{TIME}') || !DefaultMemoComposition.contains('{CONTENT}')) {
    new Notice(t('Memo Composition is not set correctly. Please check your settings.'));
    return new RegExp(regexMatch, 'g');
  }

  //eslint-disable-next-line
  regexMatch =
    '(-|\\*)\\s(\\[(.{1})\\]\\s)?' +
    DefaultMemoComposition.replace(/{TIME}/g, '((\\<time\\>)?\\d{1,2}:\\d{2})?(\\<time\\>)?').replace(
      /\s{CONTENT}/g,
      '',
    );

  return new RegExp(regexMatch, 'g');
};

// Check if daily note contains memos
export async function getRemainingMemos(note: TFile): Promise<matchResult> {
  if (!note) {
    return {
      match: 0,
      header: false,
    };
  }
  const { vault } = app;

  const content: string = await vault.read(note);
  const regExp = buildRegexForMemoComposition();
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
const getCommentMemos = (path: string): any[] => {
  let comments;

  if (CommentOnMemos && CommentsInOriginalNotes && getAPI().version.compare('>=', '0.5.9') === true) {
    const dataviewAPI = getAPI();
    if (dataviewAPI !== undefined && ProcessEntriesBelow !== '') {
      try {
        comments = dataviewAPI
          .page(path)
          ?.file.lists.values?.filter(
            (item: object) =>
              item.header.subpath === ProcessEntriesBelow?.replace(/#{1,} /g, '').trim() && item.children.length > 0,
          );
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        comments = dataviewAPI.page(path)?.file.lists.values?.filter((item: object) => item.children.length > 0);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return comments;
};

const getHeaderContent = async (dailyNote: TFile, matchResult: matchResult): Promise<string[]> => {
  const { vault } = app;
  const content = await vault.read(dailyNote);
  let parseContent: string = content;

  if (matchResult.header === true) {
    const matchArray = matchResult.headerArray;
    const pos = content.indexOf(matchArray[0]);
    parseContent = content.substring(pos);

    const nextHeader = parseContent.match(/#{1,} /g);
    console.log(nextHeader);
  }

  return getAllLinesFromFile(parseContent);
};

const lineContainsParseBelowToken = (line: string) => {
  if (ProcessEntriesBelow === '') {
    return true;
  }
  const re = new RegExp(ProcessEntriesBelow.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), '');
  return re.test(line);
};

export async function getMemosFromDailyNote(dailyNote: TFile | null): Promise<allKindsofMemos> {
  if (!dailyNote) {
    return {
      memos: [],
      commentMemos: [],
    };
  }

  const memosResult = await getRemainingMemos(dailyNote);
  let memos: Model.Memo[] = [];
  let commentMemos: Model.Memo[] = [];

  if (memosResult.match === 0) return;

  const underComments = getCommentMemos(dailyNote.path);
  let fileLines = await getHeaderContent(dailyNote, memosResult);

  const startDate = getDateFromFile(dailyNote, 'day');
  const endDate = getDateFromFile(dailyNote, 'day');
  let processHeaderFound = false;
  let memoType: string;

  for (let i = 0; i < fileLines.length; i++) {
    const line = fileLines[i];

    if (line.length === 0) continue;

    if (processHeaderFound == false && lineContainsParseBelowToken(line)) processHeaderFound = true;
    if (processHeaderFound == true && !lineContainsParseBelowToken(line) && /^#{1,} /g.test(line))
      processHeaderFound = false;

    if (!lineContainsTime(line) || !processHeaderFound) continue;

    const time = extractTimeFromBulletLine(line);

    startDate.hours(parseInt(time.hour));
    startDate.minutes(parseInt(time.minute));
    endDate.hours(parseInt(time.hour));
    endDate.minutes(parseInt(time.minute));

    memoType = getMemoType(line);
    const rawText = extractTextFromTodoLine(line);

    let originId = '';
    if (rawText !== '') {
      let hasId = Math.random().toString(36).slice(-6);
      originId = hasId;
      let linkId = '';
      if (CommentOnMemos && /comment:(.*)#\^\S{6}]]/g.test(rawText)) {
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
        path: dailyNote.path,
      });
    }
    if (/comment:(.*)#\^\S{6}]]/g.test(rawText) && CommentOnMemos && CommentsInOriginalNotes !== true) {
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
    const commentsInMemos = underComments?.filter(
      (item) => item.text === originalText || item.line === i || item.blockId === originId,
    );

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
  }
}

export async function getMemosFromNote(allMemos: any[], commentMemos: any[]): Promise<void> {
  const notes = getAPI().pages(FetchMemosMark);
  const dailyNotesPath = getDailyNotePath();
  let files = notes?.values;
  if (files.length === 0) return;

  files = files.filter(
    (item) =>
      item.file.name !== QueryFileName &&
      item.file.name !== DeleteFileName &&
      item['excalidraw-plugin'] === undefined &&
      item['kanban-plugin'] === undefined &&
      item.file.folder !== dailyNotesPath,
    // item.file.
  );
  // Get Memos from Note
  for (let i = 0; i < files.length; i++) {
    const createDate = files[i]['created'];
    // console.log(files[i]);
    const list = files[i].file.lists?.filter((item) => item.parent === undefined);
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
}

export async function getMemos(): Promise<allKindsofMemos> {
  let memos: any[] | PromiseLike<any[]> = [];
  let commentMemos: any[] | PromiseLike<any[]> = [];
  const { vault } = appStore.getState().dailyNotesState.app;
  const folder = getDailyNotePath();

  if (folder === '' || folder === undefined) {
    new Notice(t('Please check your daily note plugin OR periodic notes plugin settings'));
    return;
  }
  const dailyNotesFolder = vault.getAbstractFileByPath(normalizePath(folder)) as TFolder;

  if (!dailyNotesFolder) {
    throw new DailyNotesFolderMissingError('Failed to find daily notes folder');
  }

  const dailyNotes = getAllDailyNotes();

  for (const string in dailyNotes) {
    const tempResult = await getMemosFromDailyNote(dailyNotes[string]);
    memos = [...memos, ...tempResult.memos];
    commentMemos = [...commentMemos, ...tempResult.commentMemos];
  }

  if (FetchMemosFromNote) {
    await getMemosFromNote(memos, commentMemos);
  }

  return { memos, commentMemos };
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);

const lineContainsTime = (line: string) => {
  let regexMatch;
  let indent = '\\s*';
  if (CommentsInOriginalNotes) {
    indent = '';
  }
  if (
    DefaultMemoComposition != '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    //eslint-disable-next-line
    regexMatch =
      '^' +
      indent +
      '(-|\\*)\\s(\\[(.{1})\\]\\s)?' +
      DefaultMemoComposition.replace(/{TIME}/g, '(\\<time\\>)?\\d{1,2}:\\d{2}(\\<\\/time\\>)?').replace(
        /{CONTENT}/g,
        '(.*)$',
      );
  } else {
    //eslint-disable-next-line
    regexMatch = '^' + indent + '(-|\\*)\\s(\\[(.{1})\\]\\s)?(\\<time\\>)?\\d{1,2}\\:\\d{2}(.*)$';
  }
  const regexMatchRe = new RegExp(regexMatch, '');
  //eslint-disable-next-line
  return regexMatchRe.test(line);
  // The below line excludes entries with a ':' after the time as I was having issues with my calendar
  // being pulled in. Once made configurable will be simpler to manage.
  // return /^\s*[\-\*]\s(\[(\s|x|X|\\|\-|\>|D|\?|\/|\+|R|\!|i|B|P|C)\]\s)?(\<time\>)?\d{1,2}\:\d{2}[^:](.*)$/.test(line);
};

const extractTextFromTodoLine = (line: string) => {
  let regexMatch;
  if (
    DefaultMemoComposition != '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    //eslint-disable-next-line
    regexMatch =
      '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?' +
      DefaultMemoComposition.replace(/{TIME}/g, '(\\<time\\>)?((\\d{1,2})\\:(\\d{2}))?(\\<\\/time\\>)?').replace(
        /{CONTENT}/g,
        '(.*)$',
      );
  } else {
    //eslint-disable-next-line
    regexMatch = '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?(\\<time\\>)?((\\d{1,2})\\:(\\d{2}))?(\\<\\/time\\>)?\\s?(.*)$';
  }
  const regexMatchRe = new RegExp(regexMatch, '');
  //eslint-disable-next-line
  return regexMatchRe.exec(line)?.[8];
  // return /^\s*[\-\*]\s(\[(.{1})\]\s?)?(\<time\>)?((\d{1,2})\:(\d{2}))?(\<\/time\>)?\s?(.*)$/.exec(line)?.[8];
};

const extractTimeFromBulletLine = (line: string) => {
  let regexTimeMatch = '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(.*)$';
  if (
    !DefaultMemoComposition ||
    !DefaultMemoComposition.contains('{TIME}') ||
    !DefaultMemoComposition.contains('{CONTENT}')
  ) {
    new Notice(t('Memo Composition is not set correctly. Please check your settings.'));
    return {
      hour: new RegExp(regexTimeMatch, '').exec(line)?.[4],
      minute: new RegExp(regexTimeMatch, '').exec(line)?.[5],
    };
  }

  regexTimeMatch =
    '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?' +
    DefaultMemoComposition.replace(/{TIME}/g, '(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(\\<\\/time\\>)?').replace(
      /{CONTENT}/g,
      '(.*)$',
    );

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
