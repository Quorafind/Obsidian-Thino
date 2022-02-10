import {moment} from 'obsidian';
import {getDailyNote} from 'obsidian-daily-notes-interface';
import {DefaultMemoComposition} from '../memos';
// import appStore from "../stores/appStore";
import dailyNotesService from '../services/dailyNotesService';
// import { TFile } from "obsidian";
import appStore from '../stores/appStore';
import {sendMemoToDelete} from './obDeleteMemo';

export async function obHideMemo(memoid: string): Promise<Model.Memo> {
  const {dailyNotes} = dailyNotesService.getState();
  if (/\d{14,}/.test(memoid)) {
    const {vault} = appStore.getState().dailyNotesState.app;
    const timeString = memoid.slice(0, 13);
    const idString = parseInt(memoid.slice(14));
    const changeDate = moment(timeString, 'YYYYMMDDHHmmSS');
    const dailyNote = getDailyNote(changeDate, dailyNotes);
    const fileContent = await vault.read(dailyNote);
    const fileLines = getAllLinesFromFile(fileContent);
    const content = extractContentfromText(fileLines[idString]);
    const originalLine = '- ' + memoid + ' ' + content;
    const newLine = fileLines[idString];
    const newFileContent = fileContent.replace(newLine, '');
    await vault.modify(dailyNote, newFileContent);
    const deleteDate = await sendMemoToDelete(originalLine);
    return deleteDate;
  }
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
const extractContentfromText = (line: string) => {
  let regexMatch;
  if (
    DefaultMemoComposition != '' &&
    /{TIME}/g.test(DefaultMemoComposition) &&
    /{CONTENT}/g.test(DefaultMemoComposition)
  ) {
    //eslint-disable-next-line
    regexMatch = '^\\s*[\\-\\*]\\s(\\[(.{1})\\]\\s?)?' +
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
