import { getDailyNotePath } from "./obUpdateMemo";
import { TFile, Notice } from 'obsidian';
import moment from 'moment';
import appStore from "../stores/appStore";

export const pinQueryInFile = async (queryID: string): Promise<any> =>{

    const { metadataCache, vault } = appStore.getState().dailyNotesState.app;
    if(/\d{14,}/.test(queryID)){
        const filePath = getDailyNotePath();
        const absolutePath = filePath + "/query.md";

        const queryFile = metadataCache.getFirstLinkpathDest("" , absolutePath);

        if(queryFile instanceof TFile){
            const fileContents = await vault.cachedRead(queryFile);
            const fileLines = getAllLinesFromFile(fileContents);
            const date = moment();
            const originalLineNum = parseInt(queryID.slice(14));
            const originalContent = fileLines[originalLineNum-1];
            const pinnedAtDate = date.format("YYYY/MM/DD HH:mm:ss");
            let lineNum;
            if(fileLines.length === 1 && fileLines[0] === ""){
                lineNum = 1;
            }else{
                lineNum = fileLines.length + 1;
            }
            const pinnedAtDateID = date.format("YYYYMMDDHHmmss") + lineNum;
            const newQuery = originalContent + " pinnedAt: " + pinnedAtDateID;
            const newContent = fileContents.replace(originalContent, newQuery);
            await vault.modify(queryFile, newContent);
            // await createDeleteMemoInFile(queryFile, fileContents , originalContent , pinnedAtDateID);
            return pinnedAtDate;
        }
    }
}

export const unpinQueryInFile = async (queryID: string): Promise<any> =>{

    const { metadataCache, vault } = appStore.getState().dailyNotesState.app;

    const filePath = getDailyNotePath();
    const absolutePath = filePath + "/query.md";

    const queryFile = metadataCache.getFirstLinkpathDest("" , absolutePath);

    if(queryFile instanceof TFile){
        const fileContents = await vault.cachedRead(queryFile);
        const fileLines = getAllLinesFromFile(fileContents);
        const originalLineNum = parseInt(queryID.slice(14));
        const originalContent = fileLines[originalLineNum-1];
        const pinnedAtString = extractPinnedAtfromText(originalContent);
        const newFileContents = fileContents.replace(pinnedAtString,"");
        await vault.modify(queryFile,newFileContents);
    }
    return ;
}


export const createDeleteMemoInFile = async (file: TFile, fileContent: string, memoContent: string, pinnedAtDateID: string): Promise<any> =>{

    const { vault } = appStore.getState().dailyNotesState.app;
    let newContent;
    if(fileContent === ""){
        newContent = memoContent + " pinnedAt: " + pinnedAtDateID;
    }else{
        newContent = fileContent + "\n" + memoContent + " pinnedAt: " + pinnedAtDateID;
    }

    await vault.modify(file, newContent);

    return true;
}


export const createqueryFile = async (path: string): Promise<TFile> => {
    const { vault } = appStore.getState().dailyNotesState.app;

    try {
        const createdFile = await vault.create(path, "");
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${path}'`, err);
        new Notice("Unable to create new file.");
    }
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
//eslint-disable-next-line
const extractPinnedAtfromText = (line: string) => /^(\d{14})(\d{1,})\s(.+)\s(\[(.+)\])(\spinnedAt\: (\d{14,}))$/.exec(line)?.[6]
