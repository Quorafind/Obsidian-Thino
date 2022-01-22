import { moment } from "obsidian";
import dailyNotesService from '../services/dailyNotesService';
import { getDailyNote } from 'obsidian-daily-notes-interface';
import { Platform } from 'obsidian';


export const showMemoInDailyNotes = async ( memoId: string): Promise<any> => {

    const { app, dailyNotes } = dailyNotesService.getState();

    const lineNum = parseInt(memoId.slice(14));
    const memoDateString = memoId.slice(0,13);
    const date = moment(memoDateString, "YYYYMMDDHHmmss");
    const file = getDailyNote(date, dailyNotes);
    if(!Platform.isMobile){
        const leaf = app.workspace.splitActiveLeaf();
        leaf.openFile(file, {eState: {line: lineNum}});
    }else{
        let leaf = app.workspace.activeLeaf;
        if(leaf === null) {
            leaf = app.workspace.getLeaf(true);
        }
        leaf.openFile(file, {eState: {line: lineNum}});
    }
    return ;
}