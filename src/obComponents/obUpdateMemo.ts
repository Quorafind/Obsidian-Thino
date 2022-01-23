import {moment} from 'obsidian';
import {getDailyNote, getDailyNoteSettings} from 'obsidian-daily-notes-interface';
// import appStore from "../stores/appStore";
import dailyNotesService from '../services/dailyNotesService';
import {TFile} from 'obsidian';
import appStore from '../stores/appStore';

export async function changeMemo(
  memoid: string,
  originalContent: string,
  content: string,
  memoType: string,
): Promise<Model.Memo> {
  const {dailyNotes} = dailyNotesService.getState();
  const {vault} = appStore.getState().dailyNotesState.app;
  const timeString = memoid.slice(0, 11) + '00';
  const idString = parseInt(memoid.slice(14));
  const changeDate = moment(timeString, 'YYYYMMDDHHmmSS');
  const dailyNote = getDailyNote(changeDate, dailyNotes);
  const fileContent = await vault.read(dailyNote);
  const fileLines = getAllLinesFromFile(fileContent);
  const removeEnter = content.replace(/\n/g, '<br>');
  const originalLine = fileLines[idString];
  const newLine = fileLines[idString].replace(originalContent, removeEnter);
  const newFileContent = fileContent.replace(originalLine, newLine);
  await vault.modify(dailyNote, newFileContent);
  return {
    id: memoid,
    content: removeEnter,
    deletedAt: '',
    createdAt: changeDate.format('YYYY/MM/DD HH:mm:SS'),
    updatedAt: changeDate.format('YYYY/MM/DD HH:mm:SS'),
    memoType: memoType,
  };
}

export function getFile(memoid: string): TFile {
  const {dailyNotes} = dailyNotesService.getState();
  const timeString = memoid.slice(0, 13);
  const changeDate = moment(timeString, 'YYYYMMDDHHmmSS');
  const dailyNote = getDailyNote(changeDate, dailyNotes);
  return dailyNote;
}

export function getDailyNotePath(): string {
  const dailyNotesSetting = getDailyNoteSettings();
  const dailyNotePath = dailyNotesSetting.folder;
  return dailyNotePath;
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
