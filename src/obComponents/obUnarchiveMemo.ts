import { moment } from 'obsidian';
import { getDailyNote } from 'obsidian-daily-notes-interface';
import { DefaultMemoComposition } from '../memos';
import dailyNotesService from '../services/dailyNotesService';
import appStore from '../stores/appStore';

/**
 * Unarchive a memo by removing [archived:true] marker from the content
 * @param memoid - The ID of the memo to unarchive
 * @returns Promise<boolean> - Success status
 */
export async function obUnarchiveMemo(memoid: string): Promise<boolean> {
  const { dailyNotes } = dailyNotesService.getState();

  if (!/\d{14,}/.test(memoid)) {
    console.error('Invalid memo ID format');
    return false;
  }

  try {
    const { vault } = appStore.getState().dailyNotesState.app;
    const timeString = memoid.slice(0, 13);
    const idString = parseInt(memoid.slice(14));
    const changeDate = moment(timeString, 'YYYYMMDDHHmmSS');
    const dailyNote = getDailyNote(changeDate, dailyNotes);

    if (!dailyNote) {
      console.error('Daily note not found for memo');
      return false;
    }

    const fileContent = await vault.read(dailyNote);
    const fileLines = getAllLinesFromFile(fileContent);
    const originalLine = fileLines[idString];

    if (!originalLine) {
      console.error('Memo line not found');
      return false;
    }

    // Check if archived
    if (!/\[archived:true\]/i.test(originalLine)) {
      console.warn('Memo is not archived');
      return false;
    }

    // Remove archive marker
    const newLine = originalLine.replace(/\s*\[archived:true\]\s*/gi, '').trim();

    const newFileContent = fileContent.replace(originalLine, newLine);
    await vault.modify(dailyNote, newFileContent);

    return true;
  } catch (error) {
    console.error('Error unarchiving memo:', error);
    return false;
  }
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
