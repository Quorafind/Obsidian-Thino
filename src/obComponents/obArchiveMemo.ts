import { moment } from 'obsidian';
import { getDailyNote } from 'obsidian-daily-notes-interface';
import { DefaultMemoComposition } from '../memos';
import dailyNotesService from '../services/dailyNotesService';
import appStore from '../stores/appStore';

/**
 * Archive a memo by adding [archived:true] marker to the content
 * @param memoid - The ID of the memo to archive
 * @returns Promise<boolean> - Success status
 */
export async function obArchiveMemo(memoid: string): Promise<boolean> {
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

    // Check if already archived
    if (/\[archived:true\]/i.test(originalLine)) {
      console.warn('Memo is already archived');
      return false;
    }

    // Extract content and add archive marker
    const content = extractContentfromText(originalLine);
    const timeMatch = extractTimeFromLine(originalLine);
    const taskMatch = extractTaskFromLine(originalLine);

    let newLine: string;
    if (taskMatch) {
      // Task format: - [x] HH:mm content [archived:true]
      newLine = `- ${taskMatch} ${timeMatch} ${content} [archived:true]`;
    } else if (timeMatch) {
      // Time format: - HH:mm content [archived:true]
      newLine = `- ${timeMatch} ${content} [archived:true]`;
    } else {
      // Basic format: - content [archived:true]
      newLine = `- ${content} [archived:true]`;
    }

    const newFileContent = fileContent.replace(originalLine, newLine);
    await vault.modify(dailyNote, newFileContent);

    return true;
  } catch (error) {
    console.error('Error archiving memo:', error);
    return false;
  }
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);

const extractContentfromText = (line: string): string => {
  let regexMatch: string;

  if (
    DefaultMemoComposition !== '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    regexMatch =
      '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?' +
      DefaultMemoComposition
        .replace(/{TIME}/g, '(\\<time\\>)?((\\d{1,2})\\:(\\d{2}))?(\\<\\/time\\>)?')
        .replace(/{CONTENT}/g, '(.*)$');
  } else {
    regexMatch = '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?(\\<time\\>)?((\\d{1,2})\\:(\\d{2}))?(\\<\\/time\\>)?\\s?(.*)$';
  }

  const regexMatchRe = new RegExp(regexMatch, '');
  const match = regexMatchRe.exec(line);

  // Remove existing [archived:true] marker if present
  const content = match?.[8] || '';
  return content.replace(/\s*\[archived:true\]\s*/gi, '').trim();
};

const extractTimeFromLine = (line: string): string => {
  const timeMatch = /(\d{1,2}:\d{2})/.exec(line);
  return timeMatch ? timeMatch[1] : '';
};

const extractTaskFromLine = (line: string): string => {
  const taskMatch = /\[(.{1})\]/.exec(line);
  return taskMatch ? taskMatch[0] : '';
};
