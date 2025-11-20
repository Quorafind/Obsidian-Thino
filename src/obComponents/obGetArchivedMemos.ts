import { moment, normalizePath, TFile, TFolder } from 'obsidian';
import { getAllDailyNotes, getDateFromFile } from 'obsidian-daily-notes-interface';
import appStore from '../stores/appStore';
import { DefaultMemoComposition, ProcessEntriesBelow } from '../memos';
import { getDailyNotePath } from '../helpers/utils';

/**
 * Get all archived memos from daily notes
 * Archived memos have [archived:true] marker in their content
 */
export async function getArchivedMemos(): Promise<Model.Memo[]> {
  const archivedMemos: Model.Memo[] = [];
  const { vault } = appStore.getState().dailyNotesState.app;
  const folder = getDailyNotePath();

  if (!folder) {
    console.error('Daily notes folder not found');
    return archivedMemos;
  }

  const dailyNotesFolder = vault.getAbstractFileByPath(normalizePath(folder)) as TFolder;

  if (!dailyNotesFolder) {
    console.error('Failed to find daily notes folder');
    return archivedMemos;
  }

  const dailyNotes = getAllDailyNotes();

  for (const string in dailyNotes) {
    if (dailyNotes[string] instanceof TFile && dailyNotes[string].extension === 'md') {
      const memos = await getArchivedMemosFromDailyNote(dailyNotes[string]);
      archivedMemos.push(...memos);
    }
  }

  // Sort by creation date (newest first)
  archivedMemos.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeB - timeA;
  });

  return archivedMemos;
}

async function getArchivedMemosFromDailyNote(dailyNote: TFile): Promise<Model.Memo[]> {
  const archivedMemos: Model.Memo[] = [];
  const { vault } = appStore.getState().dailyNotesState.app;

  try {
    const fileContents = await vault.read(dailyNote);
    const fileLines = fileContents.split(/\r?\n/);
    const startDate = getDateFromFile(dailyNote, 'day');
    const endDate = getDateFromFile(dailyNote, 'day');
    let processHeaderFound = false;

    for (let i = 0; i < fileLines.length; i++) {
      const line = fileLines[i];

      if (line.length === 0) continue;

      // Check for parse below section
      if (processHeaderFound === false && lineContainsParseBelowToken(line)) {
        processHeaderFound = true;
        continue;
      }

      if (processHeaderFound === true && !lineContainsParseBelowToken(line) && /^#{1,} /g.test(line)) {
        processHeaderFound = false;
      }

      // Only process lines with [archived:true] marker
      if (lineContainsTime(line) && processHeaderFound && /\[archived:true\]/i.test(line)) {
        const hourText = extractHourFromBulletLine(line);
        const minText = extractMinFromBulletLine(line);

        if (hourText && minText) {
          startDate.hours(parseInt(hourText));
          startDate.minutes(parseInt(minText));
          endDate.hours(parseInt(hourText));
          endDate.minutes(parseInt(minText));
        }

        let memoType: string;
        if (/^\s*[-*]\s(\[(.{1})\])\s/g.test(line)) {
          const memoTaskType = extractMemoTaskTypeFromLine(line);
          memoType = getTaskType(memoTaskType);
        } else {
          memoType = 'JOURNAL';
        }

        const rawText = extractTextFromTodoLine(line);

        if (rawText !== '') {
          let hasId = Math.random().toString(36).slice(-6);
          if (/\^\S{6}$/g.test(rawText)) {
            hasId = rawText.slice(-6);
          }

          archivedMemos.push({
            id: startDate.format('YYYYMMDDHHmmss') + i,
            content: rawText,
            user_id: 1,
            createdAt: startDate.format('YYYY/MM/DD HH:mm:ss'),
            updatedAt: endDate.format('YYYY/MM/DD HH:mm:ss'),
            memoType: memoType,
            hasId: hasId,
            linkId: '',
            path: dailyNote.path,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error reading archived memos from daily note:', error);
  }

  return archivedMemos;
}

const getTaskType = (memoTaskType: string): string => {
  if (memoTaskType === ' ') {
    return 'TASK-TODO';
  } else if (memoTaskType === 'x' || memoTaskType === 'X') {
    return 'TASK-DONE';
  } else {
    return 'TASK-' + memoTaskType;
  }
};

const lineContainsTime = (line: string): boolean => {
  let regexMatch: string;
  let indent = '\\s*';

  if (
    DefaultMemoComposition !== '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    regexMatch =
      '^' +
      indent +
      '(-|\\*)\\s(\\[(.{1})\\]\\s)?' +
      DefaultMemoComposition
        .replace(/{TIME}/g, '(\\<time\\>)?\\d{1,2}:\\d{2}(\\<\\/time\\>)?')
        .replace(/{CONTENT}/g, '(.*)$');
  } else {
    regexMatch = '^' + indent + '(-|\\*)\\s(\\[(.{1})\\]\\s)?(\\<time\\>)?\\d{1,2}\\:\\d{2}(.*)$';
  }

  const regexMatchRe = new RegExp(regexMatch, '');
  return regexMatchRe.test(line);
};

const lineContainsParseBelowToken = (line: string): boolean => {
  if (ProcessEntriesBelow === '') {
    return true;
  }
  const re = new RegExp(ProcessEntriesBelow.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), '');
  return re.test(line);
};

const extractTextFromTodoLine = (line: string): string => {
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
  return regexMatchRe.exec(line)?.[8] || '';
};

const extractHourFromBulletLine = (line: string): string => {
  let regexHourMatch: string;

  if (
    DefaultMemoComposition !== '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    regexHourMatch =
      '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?' +
      DefaultMemoComposition
        .replace(/{TIME}/g, '(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(\\<\\/time\\>)?')
        .replace(/{CONTENT}/g, '(.*)$');
  } else {
    regexHourMatch = '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(.*)$';
  }

  const regexMatchRe = new RegExp(regexHourMatch, '');
  return regexMatchRe.exec(line)?.[4] || '';
};

const extractMinFromBulletLine = (line: string): string => {
  let regexHourMatch: string;

  if (
    DefaultMemoComposition !== '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    regexHourMatch =
      '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?' +
      DefaultMemoComposition
        .replace(/{TIME}/g, '(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(\\<\\/time\\>)?')
        .replace(/{CONTENT}/g, '(.*)$');
  } else {
    regexHourMatch = '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(.*)$';
  }

  const regexMatchRe = new RegExp(regexHourMatch, '');
  return regexMatchRe.exec(line)?.[5] || '';
};

const extractMemoTaskTypeFromLine = (line: string): string => {
  return /^\s*[\-\*]\s(\[(.{1})\])\s(.*)$/.exec(line)?.[2] || '';
};
