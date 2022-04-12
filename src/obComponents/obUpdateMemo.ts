import { moment, TFile } from 'obsidian';
import { getDailyNote, getDailyNoteSettings } from 'obsidian-daily-notes-interface';
// import appStore from "../stores/appStore";
import dailyNotesService from '../services/dailyNotesService';
import appStore from '../stores/appStore';

export async function changeMemo(
  memoid: string,
  originalContent: string,
  content: string,
  memoType: string,
): Promise<Model.Memo> {
  const { dailyNotes } = dailyNotesService.getState();
  const { vault } = appStore.getState().dailyNotesState.app;
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
  const { dailyNotes } = dailyNotesService.getState();
  const timeString = memoid.slice(0, 13);
  const changeDate = moment(timeString, 'YYYYMMDDHHmmSS');
  const dailyNote = getDailyNote(changeDate, dailyNotes);
  return dailyNote;
}

export function getDailyNoteFormat(): string {
  let dailyNoteFormat = '';
  if (window.app.plugins.getPlugin('periodic-notes')?.calendarSetManager.getActiveConfig('day').enabled) {
    const periodicNotes = window.app.plugins.getPlugin('periodic-notes');
    dailyNoteFormat = periodicNotes.calendarSetManager.getActiveConfig('day').format || 'YYYY-MM-DD';
    return dailyNoteFormat;
  }
  const dailyNotesSetting = getDailyNoteSettings();
  dailyNoteFormat = dailyNotesSetting.format;
  return dailyNoteFormat;
}

export function getDailyNotePath(): string {
  let dailyNotePath = '';
  // console.log(window.app.plugins.getPlugin('periodic-notes'));
  // const periodicNotes = window.app.plugins.getPlugin('periodic-notes');
  if (window.app.plugins.getPlugin('periodic-notes')?.calendarSetManager.getActiveConfig('day').enabled) {
    const periodicNotes = window.app.plugins.getPlugin('periodic-notes');
    console.log(periodicNotes.calendarSetManager.getActiveConfig('day'));
    dailyNotePath = periodicNotes.calendarSetManager.getActiveConfig('day').folder;
    return dailyNotePath;
  }
  const dailyNotesSetting = getDailyNoteSettings();
  dailyNotePath = dailyNotesSetting.folder;
  return dailyNotePath;
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
