import { Platform } from 'obsidian';
import dailyNotesService from '../../services/dailyNotesService';

export const showMemoInDailyNotes = async (memoId: string, memoPath: string): Promise<any> => {
    const { app } = dailyNotesService.getState();

    const lineNum = parseInt(memoId.slice(14));
    // const memoDateString = memoId.slice(0, 14);
    // const date = moment(memoDateString, 'YYYYMMDDHHmmss');
    // const file = getDailyNote(date, dailyNotes);
    const file = app.metadataCache.getFirstLinkpathDest('', memoPath);
    if (!Platform.isMobile) {
        const leaf = app.workspace.splitActiveLeaf();
        leaf.openFile(file, { eState: { line: lineNum } });
    } else {
        let leaf = app.workspace.activeLeaf;
        if (leaf === null) {
            leaf = app.workspace.getLeaf(true);
        }
        leaf.openFile(file, { eState: { line: lineNum } });
    }
    return;
};
