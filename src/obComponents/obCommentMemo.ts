import { moment } from 'obsidian';
import { getAPI } from 'obsidian-dataview';
import { dailyNotesService } from '../services';

interface MContent {
    content: string;
    posNum?: number;
}

// https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
export async function escapeRegExp(text: any) {
    return await text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

//credit to chhoumann, original code from: https://github.com/chhoumann/quickadd/blob/7536a120701a626ef010db567cea7cf3018e6c82/src/utility.ts#L130
export function getLinesInString(input: string) {
    const lines: string[] = [];
    let tempString = input;

    while (tempString.contains('\n')) {
        const lineEndIndex = tempString.indexOf('\n');
        lines.push(tempString.slice(0, lineEndIndex));
        tempString = tempString.slice(lineEndIndex + 1);
    }

    lines.push(tempString);

    return lines;
}

export async function commentMemo(MemoContent: string, isList: boolean, path?: any, oriID?: string, hasID?: string): Promise<Model.Memo> {
    const plugin = dailyNotesService.getPlugin();
    const removeEnter = MemoContent.replace(/\n/g, '<br>');

    if (path === undefined) {
        return;
    }

    const file = app.metadataCache.getFirstLinkpathDest('', path);
    const time = moment();
    const formatTime = time.format('YYYYMMDDHHmmss');
    const ID = oriID.slice(14);

    const indent = '    ';
    const newContent = formatTime + ' ' + removeEnter.trim();
    const newLineContent = indent + '- ' + formatTime + ' ' + removeEnter.trim();

    if (file) {
        let underComments;
        if (plugin.settings.CommentOnMemos && plugin.settings.CommentsInOriginalNotes) {
            const dataviewAPI = getAPI();
            if (dataviewAPI !== undefined) {
                try {
                    underComments = dataviewAPI.page(file.path)?.file.lists.values?.filter((item: object) => item.line === parseInt(ID));
                } catch (e) {
                    console.error(e);
                }
            }
        }

        const fileContents = await app.vault.read(file);

        let endLine = 0;

        endLine = underComments[0].children.values.length > 0 ? underComments[0].children.values[underComments[0].children.values.length - 1].line : underComments[0].line;

        const newFileContent = await insertTextAfterPositionInBody(newLineContent, fileContents, endLine);
        await app.vault.modify(file, newFileContent.content);
        if (isList) {
            return {
                id: formatTime + (endLine + 1),
                content: newContent,
                deletedAt: '',
                createdAt: time.format('YYYY/MM/DD HH:mm:ss'),
                updatedAt: time.format('YYYY/MM/DD HH:mm:ss'),
                memoType: 'JOURNAL',
                path: file.path,
                hasId: '',
                linkId: hasID,
            };
        }
    }
}

export async function insertTextAfterPositionInBody(text: string, body: string, pos: number): Promise<MContent> {
    if (pos === -1) {
        return {
            content: `${body}\n${text}`,
            posNum: -1,
        };
    }

    const splitContent = body.split('\n');

    const pre = splitContent.slice(0, pos + 1).join('\n');
    const post = splitContent.slice(pos + 1).join('\n');
    if (/^\s*$/g.test(splitContent[pos + 1])) {
        return {
            content: `${pre}\n${text}\n${post}`,
            posNum: pos,
        };
    }
    return {
        content: `${pre}\n${text}\n${post}`,
        posNum: pos,
    };

    // return `${pre}${text}\n${post}`;
}
