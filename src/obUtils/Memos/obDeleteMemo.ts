import { moment, normalizePath, Notice, TFile } from 'obsidian';
import appStore from '../../stores/appStore';
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import { insertAfterHandler } from './obCreateMemo';
import { DeleteFileName, InsertAfter } from '../../memosView';
import { getDailyNotePath } from '../../helpers/utils';

export async function restoreDeletedMemo(deletedMemoid: string): Promise<any[]> {
    const { vault, metadataCache } = appStore.getState().dailyNotesState.app;
    if (/\d{14,}/.test(deletedMemoid)) {
        const filePath = getDailyNotePath();
        const absolutePath = filePath + '/' + DeleteFileName + '.md';
        const deleteFile = metadataCache.getFirstLinkpathDest('', absolutePath);

        if (deleteFile instanceof TFile) {
            let fileContents = await vault.read(deleteFile);
            let fileLines = getAllLinesFromFile(fileContents);
            if (fileLines.length === 0) {
                return;
            } else {
                const lineNum = parseInt(deletedMemoid.slice(14));
                const line = fileLines[lineNum - 1];
                const newDeletefileContents = fileContents.replace(line, '');
                await vault.modify(deleteFile, newDeletefileContents);
                if (/^- (.+)$/.test(line)) {
                    const id = extractIDfromText(line);
                    const date = moment(id, 'YYYYMMDDHHmmss');
                    const timeHour = date.format('HH');
                    const timeMinute = date.format('mm');

                    const newEvent = `- ` + String(timeHour) + `:` + String(timeMinute) + ` ` + extractContentfromText(line);
                    const dailyNotes = await getAllDailyNotes();
                    const existingFile = getDailyNote(date, dailyNotes);
                    if (!existingFile) {
                        const file = await createDailyNote(date);
                        const fileContents = await vault.read(file);
                        const newFileContent = await insertAfterHandler(InsertAfter, newEvent, fileContents);
                        await vault.modify(file, newFileContent.content);
                        return [
                            {
                                deletedAt: '',
                            },
                        ];
                    } else {
                        const fileContents = await vault.read(existingFile);
                        const newFileContent = await insertAfterHandler(InsertAfter, newEvent, fileContents);
                        await vault.modify(existingFile, newFileContent.content);
                        return [
                            {
                                deletedAt: '',
                            },
                        ];
                    }
                }
                fileLines = null;
                fileContents = null;
            }
        }
    }
}

export async function deleteForever(deletedMemoid: string): Promise<void> {
    const { vault, metadataCache } = appStore.getState().dailyNotesState.app;
    if (/\d{14,}/.test(deletedMemoid)) {
        const filePath = getDailyNotePath();
        const absolutePath = filePath + '/' + DeleteFileName + '.md';
        const deleteFile = metadataCache.getFirstLinkpathDest('', absolutePath);

        if (deleteFile instanceof TFile) {
            let fileContents = await vault.read(deleteFile);
            let fileLines = getAllLinesFromFile(fileContents);
            if (fileLines.length === 0) {
                return;
            } else {
                const lineNum = parseInt(deletedMemoid.slice(14));
                const line = fileLines[lineNum - 1];
                if (/^- (.+)$/.test(line)) {
                    // const id = extractIDfromText(fileLines[i]);
                    const newFileContent = fileContents.replace(line, '');
                    await vault.modify(deleteFile, newFileContent);
                }
            }
            fileLines = null;
            fileContents = null;
        }
    }
    // return deletedMemos;
}

export async function getDeletedMemos(): Promise<any[]> {
    const { vault, metadataCache } = appStore.getState().dailyNotesState.app;

    const filePath = getDailyNotePath();
    const absolutePath = filePath + '/' + DeleteFileName + '.md';
    const deletedMemos: any[] | PromiseLike<any[]> = [];
    const deleteFile = metadataCache.getFirstLinkpathDest('', absolutePath);
    if (deleteFile instanceof TFile) {
        let fileContents = await vault.read(deleteFile);
        let fileLines = getAllLinesFromFile(fileContents);
        if (fileLines.length === 0) {
            return deletedMemos;
        } else {
            for (let i = 0; i < fileLines.length; i++) {
                const line = fileLines[i];
                if (!/- /.test(line)) {
                    continue;
                } else {
                    const id = extractIDfromText(line);
                    const timeString = id.slice(0, 13);
                    // const idString = parseInt(id.slice(14));
                    const createdDate = moment(timeString, 'YYYYMMDDHHmmss');
                    const deletedDateID = extractDeleteDatefromText(fileLines[i]);
                    const deletedDate = moment(deletedDateID.slice(0, 13), 'YYYYMMDDHHmmss');
                    const content = extractContentfromText(fileLines[i]);
                    deletedMemos.push({
                        id: deletedDateID,
                        content: content,
                        user_id: 1,
                        createdAt: createdDate.format('YYYY/MM/DD HH:mm:SS'),
                        updatedAt: createdDate.format('YYYY/MM/DD HH:mm:SS'),
                        deletedAt: deletedDate,
                    });
                }
            }
        }

        fileLines = null;
        fileContents = null;
    }
    return deletedMemos;
}

export const sendMemoToDelete = async (memoContent: string): Promise<any> => {
    const { metadataCache, vault } = appStore.getState().dailyNotesState.app;

    const filePath = getDailyNotePath();
    const absolutePath = filePath + '/' + DeleteFileName + '.md';

    const deleteFile = metadataCache.getFirstLinkpathDest('', absolutePath);

    if (deleteFile instanceof TFile) {
        const fileContents = await vault.read(deleteFile);
        const fileLines = getAllLinesFromFile(fileContents);
        const date = moment();
        const deleteDate = date.format('YYYY/MM/DD HH:mm:ss');
        let lineNum;
        if (fileLines.length === 1 && fileLines[0] === '') {
            lineNum = 1;
        } else {
            lineNum = fileLines.length + 1;
        }
        const deleteDateID = date.format('YYYYMMDDHHmmss') + lineNum;

        await createDeleteMemoInFile(deleteFile, fileContents, memoContent, deleteDateID);

        return deleteDate;
    } else {
        const deleteFilePath = normalizePath(absolutePath);
        const file = await createdeleteFile(deleteFilePath);
        // const fileContents = await vault.read(deleteFile);
        // const fileLines = getAllLinesFromFile(fileContents);
        const date = moment();
        const deleteDate = date.format('YYYY/MM/DD HH:mm:ss');
        const lineNum = 1;
        const deleteDateID = date.format('YYYYMMDDHHmmss') + lineNum;

        await createDeleteMemoInFile(file, '', memoContent, deleteDateID);

        return deleteDate;
    }
};

export const createDeleteMemoInFile = async (file: TFile, fileContent: string, memoContent: string, deleteDate: string): Promise<any> => {
    const { vault } = appStore.getState().dailyNotesState.app;
    let newContent;
    if (fileContent === '') {
        newContent = memoContent + ' deletedAt: ' + deleteDate;
    } else {
        newContent = fileContent + '\n' + memoContent + ' deletedAt: ' + deleteDate;
    }

    await vault.modify(file, newContent);

    return true;
};

export const createdeleteFile = async (path: string): Promise<TFile> => {
    const { vault } = appStore.getState().dailyNotesState.app;

    try {
        const createdFile = await vault.create(path, '');
        return createdFile;
    } catch (err) {
        console.error(`Failed to create file: '${path}'`, err);
        new Notice('Unable to create new file.');
    }
};

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
//eslint-disable-next-line
const extractIDfromText = (line: string) => /^- (\d{14})(\d+)\s(.+)\s(deletedAt: )(.+)$/.exec(line)?.[1];
//eslint-disable-next-line
const extractContentfromText = (line: string) => /^- (\d+)\s(.+)\s(deletedAt: )(.+)$/.exec(line)?.[2];
//eslint-disable-next-line
const extractDeleteDatefromText = (line: string) => /^- (\d+)\s(.+)\s(deletedAt: )(.+)$/.exec(line)?.[4];
// const extractMemoTaskTypeFromLine = (line: string) =>
//   //eslint-disable-next-line
//   /^\s*[\-\*]\s(\[(.{1})\])\s(.*)$/.exec(line)?.[2];
