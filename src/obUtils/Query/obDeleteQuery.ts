import { TFile } from 'obsidian';
import appStore from '../../stores/appStore';
import { QueryFileName } from '../../memosView';
import { getDailyNotePath } from '../../helpers/utils';

export async function deleteQueryForever(queryID: string): Promise<void> {
    const { vault, metadataCache } = appStore.getState().dailyNotesState.app;
    if (/\d{14,}/.test(queryID)) {
        const filePath = getDailyNotePath();
        const absolutePath = filePath + '/' + QueryFileName + '.md';
        const queryFile = metadataCache.getFirstLinkpathDest('', absolutePath);

        if (queryFile instanceof TFile) {
            let fileContents = await vault.read(queryFile);
            let fileLines = getAllLinesFromFile(fileContents);
            if (fileLines.length === 0) {
                return;
            } else {
                const lineNum = parseInt(queryID.slice(14));
                const line = fileLines[lineNum - 1];
                if (/^\d{14,}(.+)$/.test(line)) {
                    // const id = extractIDfromText(fileLines[i]);
                    const newFileContent = fileContents.replace(line, '');
                    await vault.modify(queryFile, newFileContent);
                }
            }
            fileLines = null;
            fileContents = null;
        }
    }
    // return deletedMemos;
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
