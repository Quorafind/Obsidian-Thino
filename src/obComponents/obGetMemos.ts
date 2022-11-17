import { moment, normalizePath, Notice, TFile, TFolder } from 'obsidian';
import { getAllDailyNotes, getDateFromFile } from 'obsidian-daily-notes-interface';
import appStore from '../stores/appStore';
import {
  CommentOnMemos,
  CommentsInOriginalNotes,
  DefaultMemoComposition,
  DeleteFileName,
  FetchMemosFromNote,
  FetchMemosMark,
  ProcessEntriesBelow,
  QueryFileName,
} from '../memos';
import { getAPI } from 'obsidian-dataview';
import { t } from '../translations/helper';
import { getDailyNotePath } from '../helpers/utils';

export class DailyNotesFolderMissingError extends Error {}

interface allKindsofMemos {
  memos: Model.Memo[];
  commentMemos: Model.Memo[];
}

const getTaskType = (memoTaskType: string): string => {
  let memoType;
  if (memoTaskType === ' ') {
    memoType = 'TASK-TODO';
    return memoType;
  } else if (memoTaskType === 'x' || memoTaskType === 'X') {
    memoType = 'TASK-DONE';
    return memoType;
  } else {
    memoType = 'TASK-' + memoTaskType;
    return memoType;
  }
};

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

export async function getCommentMemosFromDailyNote(dailyNote: TFile | null, commentMemos: any[]): Promise<any[]> {
  if (!dailyNote) {
    return commentMemos;
  }
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
  let underComments;

  if (Memos === 0) return;

  // console.log(getAPI().version.compare('>=', '0.5.9'));

  // Get Comments Near the Original Memos. Maybe use Dataview to fetch all memos in the near future.
  if (CommentOnMemos && CommentsInOriginalNotes && getAPI().version.compare('>=', '0.5.9') === true) {
    const dataviewAPI = getAPI();
    if (dataviewAPI !== undefined && ProcessEntriesBelow !== '') {
      try {
        underComments = dataviewAPI
          .page(dailyNote.path)
          ?.file.lists.values?.filter(
            (item: object) =>
              item.header.subpath === ProcessEntriesBelow?.replace(/#{1,} /g, '').trim() && item.children.length > 0,
          );
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        underComments = dataviewAPI
          .page(dailyNote.path)
          ?.file.lists.values?.filter((item: object) => item.children.length > 0);
      } catch (e) {
        console.error(e);
      }
    }
  }

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
        memoType = getTaskType(memoTaskType);
      } else {
        memoType = 'JOURNAL';
      }
      const rawText = extractTextFromTodoLine(line);
      let originId = '';
      if (rawText !== '') {
        let hasId = Math.random().toString(36).slice(-6);
        originId = hasId;
        let linkId = '';
        if (CommentOnMemos && /comment:(.*)#\^\S{6}]]/g.test(rawText)) {
          linkId = extractCommentFromLine(rawText);
        }
        if (/\^\S{6}$/g.test(rawText)) {
          hasId = rawText.slice(-6);
          originId = hasId;
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
          path: dailyNote.path,
        });
      }
      if (/comment:(.*)#\^\S{6}]]/g.test(rawText) && CommentOnMemos && CommentsInOriginalNotes !== true) {
        const commentId = extractCommentFromLine(rawText);
        const hasId = '';
        commentMemos.push({
          id: startDate.format('YYYYMMDDHHmmSS') + i,
          content: rawText,
          user_id: 1,
          createdAt: startDate.format('YYYY/MM/DD HH:mm:SS'),
          updatedAt: endDate.format('YYYY/MM/DD HH:mm:SS'),
          memoType: memoType,
          hasId: hasId,
          linkId: commentId,
        });
        continue;
      }
      if (
        rawText !== '' &&
        !rawText.contains(' comment') &&
        underComments !== null &&
        underComments !== undefined &&
        underComments.length > 0
      ) {
        // console.log(underComments.map((item) => console.log(item.text.replace(/^\d{2}:\d{2}/, ''))));
        const originalText = line.replace(/^[-*]\s(\[(.{1})\]\s?)?/, '')?.trim();
        const commentsInMemos = underComments.filter(
          (item) => item.text === originalText || item.line === i || item.blockId === originId,
        );

        if (commentsInMemos.length === 0) continue;

        if (commentsInMemos[0].children?.length > 0) {
          // console.log(commentsInMemos[0].children.values);
          for (let j = 0; j < commentsInMemos[0].children.length; j++) {
            // console.log(commentsInMemos[0].children.values[j].text);
            const hasId = '';
            let commentTime;
<<<<<<< HEAD
            if (/^\d{12}/.test(commentsInMemos[0].children.values[j].text)) {
              commentTime = commentsInMemos[0].children.values[j].text?.match(/^\d{14}/)[0];
=======
            if (/^\d{12}/.test(commentsInMemos[0].children[j].text)) {
              commentTime = commentsInMemos[0].children[j].text?.match(/^\d{14}/)[0];
>>>>>>> 4a164c298b6ec45f63cfe1973279f2e915033675
            } else {
              commentTime = startDate.format('YYYYMMDDHHmmSS');
            }
            commentMemos.push({
              id: commentTime + commentsInMemos[0].children[j].line,
              content: commentsInMemos[0].children[j].text,
              user_id: 1,
              createdAt: moment(commentTime, 'YYYYMMDDHHmmSS').format('YYYY/MM/DD HH:mm:SS'),
              updatedAt: moment(commentTime, 'YYYYMMDDHHmmSS').format('YYYY/MM/DD HH:mm:SS'),
              memoType: commentsInMemos[0].children[j].task
                ? getTaskType(commentsInMemos[0].children[j].status)
                : 'JOURNAL',
              hasId: hasId,
              linkId: originId,
              path: commentsInMemos[0].children[j].path,
            });
          }
        }

        // console.log(underComments.filter((item: object) => item.text === rawText.trim()));
      }
    }
  }
  fileLines = null;
  fileContents = null;
}

export async function getMemosFromNote(allMemos: any[], commentMemos: any[]): Promise<void> {
  const notes = getAPI().pages(FetchMemosMark);
  const dailyNotesPath = getDailyNotePath();
  let files = notes?.values;
  if (files.length === 0) return;

  files = files.filter(
    (item) =>
      item.file.name !== QueryFileName &&
      item.file.name !== DeleteFileName &&
      item['excalidraw-plugin'] === undefined &&
      item['kanban-plugin'] === undefined &&
      item.file.folder !== dailyNotesPath,
    // item.file.
  );
  // Get Memos from Note
  for (let i = 0; i < files.length; i++) {
    const createDate = files[i]['created'];
    // console.log(files[i]);
    const list = files[i].file.lists?.filter((item) => item.parent === undefined);
    if (list.length === 0) continue;
    for (let j = 0; j < list.length; j++) {
      const content = list.values[j].text;
      const header = list.values[j].header.subpath;
      const path = list.values[j].path;
      const line = list.values[j].line;
      let memoType = 'JOURNAL';
      let hasId;
     // let realCreateDate = moment(createDate, 'YYYY-MM-DD HH:mm');
      let realCreateDate = createDate.toFormat("yyyy-MM-dd HH:mm");
      if (/\^\S{6}$/g.test(content)) {
        hasId = content.slice(-6);
        // originId = hasId;
      } else {
        hasId = Math.random().toString(36).slice(-6);
      }
      if (list.values[j].task === true) {
        memoType = getTaskType(list.values[j].status);
      }
      if (header !== undefined) {
        if (moment(header).isValid()) {
          realCreateDate = moment(header);
          // realCreateDate = momentDate.format('YYYYMMDDHHmmSS');
        }
      }

      if (/^\d{2}:\d{2}/g.test(content)) {
        const time = content.match(/^\d{2}:\d{2}/)[0];
        const timeArr = time.split(':');
        const hour = parseInt(timeArr[0], 10);
        const minute = parseInt(timeArr[1], 10);
        realCreateDate = moment(realCreateDate).hours(hour).minutes(minute);

        // createDate = date.format('YYYYMMDDHHmmSS');
      }
      allMemos.push({
        id: realCreateDate.format('YYYYMMDDHHmmSS') + line,
        content: content,
        user_id: 1,
        createdAt: realCreateDate.format('YYYY/MM/DD HH:mm:SS'),
        updatedAt: realCreateDate.format('YYYY/MM/DD HH:mm:SS'),
        memoType: memoType,
        hasId: hasId,
        linkId: '',
        path: path,
      });
      // Get Comment Memos From Note
      if (list.values[j].children?.values.length > 0) {
        for (let k = 0; k < list[j].children.length; k++) {
          const childContent = list[j].children[k].text;
          const childLine = list[j].children[k].line;
          let childMemoType = 'JOURNAL';
          let childRealCreateDate = realCreateDate;
          let commentTime;
          if (list[j].children[k].task === true) {
            childMemoType = getTaskType(list[j].children[k].status);
          }
          if (/^\d{12}/.test(childContent)) {
            commentTime = childContent?.match(/^\d{14}/)[0];
            childRealCreateDate = moment(commentTime, 'YYYYMMDDHHmmSS');
          }

          if (/^\d{2}:\d{2}/g.test(childContent)) {
            const time = childContent.match(/^\d{2}:\d{2}/)[0];
            const timeArr = time.split(':');
            const hour = parseInt(timeArr[0], 10);
            const minute = parseInt(timeArr[1], 10);
            childRealCreateDate = childRealCreateDate.hours(hour).minutes(minute);
            // createDate = date.format('YYYYMMDDHHmmSS');
          }
          commentMemos.push({
            id: childRealCreateDate.format('YYYYMMDDHHmmSS') + childLine,
            content: childContent,
            user_id: 1,
            createdAt: childRealCreateDate.format('YYYY/MM/DD HH:mm:SS'),
            updatedAt: childRealCreateDate.format('YYYY/MM/DD HH:mm:SS'),
            memoType: childMemoType,
            hasId: '',
            linkId: hasId,
            path: path,
          });
          // if()
        }
      }
    }
  }
  return;
}

export async function getMemos(): Promise<allKindsofMemos> {
  const memos: any[] | PromiseLike<any[]> = [];
  const commentMemos: any[] | PromiseLike<any[]> = [];
  const { vault } = appStore.getState().dailyNotesState.app;
  const folder = getDailyNotePath();

  if (folder === '' || folder === undefined) {
    new Notice(t('Please check your daily note plugin OR periodic notes plugin settings'));
    return;
  }
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

  if (FetchMemosFromNote) {
    await getMemosFromNote(memos, commentMemos);
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
  let indent = '\\s*';
  if (CommentsInOriginalNotes) {
    indent = '';
  }
  if (
    DefaultMemoComposition != '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    //eslint-disable-next-line
    regexMatch =
      '^' +
      indent +
      '(-|\\*)\\s(\\[(.{1})\\]\\s)?' +
      DefaultMemoComposition.replace(/{TIME}/g, '(\\<time\\>)?\\d{1,2}:\\d{2}(\\<\\/time\\>)?').replace(
        /{CONTENT}/g,
        '(.*)$',
      );
  } else {
    //eslint-disable-next-line
    regexMatch = '^' + indent + '(-|\\*)\\s(\\[(.{1})\\]\\s)?(\\<time\\>)?\\d{1,2}\\:\\d{2}(.*)$';
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
