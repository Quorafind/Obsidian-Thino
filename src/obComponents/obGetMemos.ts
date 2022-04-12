import { normalizePath, TFile, TFolder } from 'obsidian';
import { getAllDailyNotes, getDateFromFile } from 'obsidian-daily-notes-interface';
import appStore from '../stores/appStore';
import { CommentOnMemos, DefaultMemoComposition, ProcessEntriesBelow } from '../memos';
import { getDailyNotePath } from './obUpdateMemo';

export class DailyNotesFolderMissingError extends Error {}

interface allKindsofMemos {
  memos: Model.Memo[];
  commentMemos: Model.Memo[];
}

export async function getRemainingMemos(note: TFile): Promise<number> {
  if (!note) {
    return 0;
  }
  const { vault } = appStore.getState().dailyNotesState.app;
  let fileContents = await vault.read(note);
  let regexMatch;
  if (
    DefaultMemoComposition != '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    //eslint-disable-next-line
    regexMatch =
      '(-|\\*) (\\[(.{1})\\]\\s)?' +
      DefaultMemoComposition.replace(/{TIME}/g, '((\\<time\\>)?\\d{1,2}:\\d{2})?').replace(/ {CONTENT}/g, '');
  } else {
    //eslint-disable-next-line
    regexMatch = '(-|\\*) (\\[(.{1})\\]\\s)?((\\<time\\>)?\\d{1,2}\\:\\d{2})?';
  }
  const regexMatchRe = new RegExp(regexMatch, 'g');
  //eslint-disable-next-line
  const matchLength = (fileContents.match(regexMatchRe) || []).length;
  // const matchLength = (fileContents.match(/(-|\*) (\[ \]\s)?((\<time\>)?\d{1,2}\:\d{2})?/g) || []).length;
  const re = new RegExp(ProcessEntriesBelow.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
  const processEntriesHeader = (fileContents.match(re) || []).length;
  fileContents = null;
  if (processEntriesHeader) {
    return matchLength;
  }
  return 0;
}

export async function getMemosFromDailyNote(
  dailyNote: TFile | null,
  allMemos: any[],
  commentMemos: any[],
): Promise<any[]> {
  if (!dailyNote) {
    return [];
  }
  const { vault } = appStore.getState().dailyNotesState.app;
  const Memos = await getRemainingMemos(dailyNote);

  if (Memos === 0) return;

  let fileContents = await vault.read(dailyNote);
  let fileLines = getAllLinesFromFile(fileContents);
  const startDate = getDateFromFile(dailyNote, 'day');
  const endDate = getDateFromFile(dailyNote, 'day');
  let processHeaderFound = false;
  let memoType: string;
  for (let i = 0; i < fileLines.length; i++) {
    const line = fileLines[i];
    if (line.length === 0) continue;
    // if (line.contains('comment: ')) continue;
    if (processHeaderFound == false && lineContainsParseBelowToken(line)) {
      processHeaderFound = true;
    }
    if (processHeaderFound == true && !lineContainsParseBelowToken(line) && /^#{1,} /g.test(line)) {
      processHeaderFound = false;
    }

    if (lineContainsTime(line) && processHeaderFound) {
      const hourText = extractHourFromBulletLine(line);
      const minText = extractMinFromBulletLine(line);
      startDate.hours(parseInt(hourText));
      startDate.minutes(parseInt(minText));
      endDate.hours(parseInt(hourText));
      if (parseInt(hourText) > 22) {
        endDate.minutes(parseInt(minText));
      } else {
        endDate.minutes(parseInt(minText));
      }
      if (/^\s*[-*]\s(\[(.{1})\])\s/g.test(line)) {
        const memoTaskType = extractMemoTaskTypeFromLine(line);
        if (memoTaskType === ' ') {
          memoType = 'TASK-TODO';
        } else if (memoTaskType === 'x' || memoTaskType === 'X') {
          memoType = 'TASK-DONE';
        } else {
          memoType = 'TASK-' + memoTaskType;
        }
      } else {
        memoType = 'JOURNAL';
      }
      const rawText = extractTextFromTodoLine(line);
      if (rawText !== '') {
        let hasId = '';
        let linkId = '';
        if (CommentOnMemos && /comment:(.*)#\^\S{6}]]/g.test(rawText)) {
          linkId = extractCommentFromLine(rawText);
        }
        if (/\^\S{6}$/g.test(rawText)) {
          hasId = rawText.slice(-6);
        }
        allMemos.push({
          id: startDate.format('YYYYMMDDHHmmSS') + i,
          content: rawText,
          user_id: 1,
          createdAt: startDate.format('YYYY/MM/DD HH:mm:SS'),
          updatedAt: endDate.format('YYYY/MM/DD HH:mm:SS'),
          memoType: memoType,
          hasId: hasId,
          linkId: linkId,
        });
      }
      if (/comment:(.*)#\^\S{6}]]/g.test(rawText) && CommentOnMemos) {
        const commentId = extractCommentFromLine(rawText);
        commentMemos.push({
          id: startDate.format('YYYYMMDDHHmmSS') + i,
          content: rawText,
          user_id: 1,
          createdAt: startDate.format('YYYY/MM/DD HH:mm:SS'),
          updatedAt: endDate.format('YYYY/MM/DD HH:mm:SS'),
          memoType: memoType,
          linkId: commentId,
        });
      }
    }
  }
  fileLines = null;
  fileContents = null;
}

export async function getMemos(): Promise<allKindsofMemos> {
  const memos: any[] | PromiseLike<any[]> = [];
  const commentMemos: any[] | PromiseLike<any[]> = [];
  const { vault } = appStore.getState().dailyNotesState.app;
  const folder = getDailyNotePath();

  const dailyNotesFolder = vault.getAbstractFileByPath(normalizePath(folder)) as TFolder;

  if (!dailyNotesFolder) {
    throw new DailyNotesFolderMissingError('Failed to find daily notes folder');
  }

  const dailyNotes = getAllDailyNotes();

  for (const string in dailyNotes) {
    if (dailyNotes[string] instanceof TFile && dailyNotes[string].extension === 'md') {
      await getMemosFromDailyNote(dailyNotes[string], memos, commentMemos);
    }
  }

  return { memos, commentMemos };
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
// const lineIsValidTodo = (line: string) => {
// //eslint-disable-next-line
//   return /^\s*[\-\*]\s\[(\s|x|X|\\|\-|\>|D|\?|\/|\+|R|\!|i|B|P|C)\]\s?\s*\S/.test(line)
// }
const lineContainsTime = (line: string) => {
  let regexMatch;
  if (
    DefaultMemoComposition != '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    //eslint-disable-next-line
    regexMatch =
      '^\\s*(-|\\*)\\s(\\[(.{1})\\]\\s)?' +
      DefaultMemoComposition.replace(/{TIME}/g, '(\\<time\\>)?\\d{1,2}:\\d{2}(\\<\\/time\\>)?').replace(
        /{CONTENT}/g,
        '(.*)$',
      );
  } else {
    //eslint-disable-next-line
    regexMatch = '^\\s*(-|\\*)\\s(\\[(.{1})\\]\\s)?(\\<time\\>)?\\d{1,2}\\:\\d{2}(.*)$';
  }
  const regexMatchRe = new RegExp(regexMatch, '');
  //eslint-disable-next-line
  return regexMatchRe.test(line);
  // The below line excludes entries with a ':' after the time as I was having issues with my calendar
  // being pulled in. Once made configurable will be simpler to manage.
  // return /^\s*[\-\*]\s(\[(\s|x|X|\\|\-|\>|D|\?|\/|\+|R|\!|i|B|P|C)\]\s)?(\<time\>)?\d{1,2}\:\d{2}[^:](.*)$/.test(line);
};

const lineContainsParseBelowToken = (line: string) => {
  if (ProcessEntriesBelow === '') {
    return true;
  }
  const re = new RegExp(ProcessEntriesBelow.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), '');
  return re.test(line);
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

const extractHourFromBulletLine = (line: string) => {
  let regexHourMatch;
  if (
    DefaultMemoComposition != '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    //eslint-disable-next-line
    regexHourMatch =
      '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?' +
      DefaultMemoComposition.replace(/{TIME}/g, '(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(\\<\\/time\\>)?').replace(
        /{CONTENT}/g,
        '(.*)$',
      );
  } else {
    //eslint-disable-next-line
    regexHourMatch = '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(.*)$';
  }
  const regexMatchRe = new RegExp(regexHourMatch, '');
  //eslint-disable-next-line
  return regexMatchRe.exec(line)?.[4];
};

const extractMinFromBulletLine = (line: string) => {
  let regexHourMatch;
  if (
    DefaultMemoComposition != '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    //eslint-disable-next-line
    regexHourMatch =
      '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?' +
      DefaultMemoComposition.replace(/{TIME}/g, '(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(\\<\\/time\\>)?').replace(
        /{CONTENT}/g,
        '(.*)$',
      );
  } else {
    //eslint-disable-next-line
    regexHourMatch = '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?(\\<time\\>)?(\\d{1,2})\\:(\\d{2})(.*)$';
  }
  const regexMatchRe = new RegExp(regexHourMatch, '');
  //eslint-disable-next-line
  return regexMatchRe.exec(line)?.[5];
  // /^\s*[\-\*]\s(\[(.{1})\]\s?)?(\<time\>)?(\d{1,2})\:(\d{2})(.*)$/.exec(line)?.[5];
};

const extractMemoTaskTypeFromLine = (line: string) =>
  //eslint-disable-next-line
  /^\s*[\-\*]\s(\[(.{1})\])\s(.*)$/.exec(line)?.[2];
// The below line excludes entries with a ':' after the time as I was having issues with my calendar
// being pulled in. Once made configurable will be simpler to manage.
// return /^\s*[\-\*]\s(\[(\s|x|X|\\|\-|\>|D|\?|\/|\+|R|\!|i|B|P|C)\]\s)?(\<time\>)?\d{1,2}\:\d{2}[^:](.*)$/.test(line);

// Get comment Id
const extractCommentFromLine = (line: string) => {
  const regex = '#\\^(\\S{6})';
  const regexMatchRe = new RegExp(regex, '');
  return regexMatchRe.exec(line)[1];
};
