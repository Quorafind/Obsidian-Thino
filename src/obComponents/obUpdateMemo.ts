import { moment, Notice, TFile } from 'obsidian';
import { getDailyNote, getDailyNoteSettings } from 'obsidian-daily-notes-interface';
// import appStore from "../stores/appStore";
import dailyNotesService from '../services/dailyNotesService';
import appStore from '../stores/appStore';
import { t } from '../translations/helper';

export async function changeMemo(
  memoid: string,
  originalContent: string,
  content: string,
  memoType?: string,
  path?: string,
): Promise<Model.Memo> {
  const { dailyNotes } = dailyNotesService.getState();
  const { vault, metadataCache } = appStore.getState().dailyNotesState.app;
  const timeString = memoid.slice(0, 14);
  const idString = parseInt(memoid.slice(14));
  let changeDate: moment.Moment;
  if (/^\d{14}/g.test(content)) {
    changeDate = moment(content.slice(0, 14), 'YYYYMMDDHHmmss');
  } else {
    changeDate = moment(timeString, 'YYYYMMDDHHmmss');
  }

  let file;
  if (path !== undefined) {
    file = metadataCache.getFirstLinkpathDest('', path);
  } else {
    file = getDailyNote(changeDate, dailyNotes);
  }
  const fileContent = await vault.read(file);
  const fileLines = getAllLinesFromFile(fileContent);
  const removeEnter = content.replace(/\n/g, '<br>');
  const originalLine = fileLines[idString];
  const newLine = fileLines[idString].replace(originalContent, removeEnter);
  const newFileContent = fileContent.replace(originalLine, newLine);
  await vault.modify(file, newFileContent);
  return {
    id: memoid,
    content: removeEnter,
    deletedAt: '',
    createdAt: changeDate.format('YYYY/MM/DD HH:mm:ss'),
    updatedAt: changeDate.format('YYYY/MM/DD HH:mm:ss'),
    memoType: memoType,
    path: file.path,
  };
}

export function getFile(memoid: string): TFile {
  const { dailyNotes } = dailyNotesService.getState();
  const timeString = memoid.slice(0, 14);
  const changeDate = moment(timeString, 'YYYYMMDDHHmmSS');
  const dailyNote = getDailyNote(changeDate, dailyNotes);
  return dailyNote;
}

export function getDailyNoteFormat(): string {
  let dailyNoteFormat = '';
  if (window.app.plugins.getPlugin('periodic-notes')?.calendarSetManager?.getActiveConfig('day').enabled) {
    const periodicNotes = window.app.plugins.getPlugin('periodic-notes');
    dailyNoteFormat = periodicNotes.calendarSetManager.getActiveConfig('day').format || 'YYYY-MM-DD';
    return dailyNoteFormat;
  }
  if (window.app.plugins.getPlugin('periodic-notes')?.settings?.daily) {
    const dailyNotes = window.app.plugins.getPlugin('periodic-notes');
    dailyNoteFormat = dailyNotes.settings.daily.format || 'YYYY-MM-DD';
    return dailyNoteFormat;
  }
  const dailyNotesSetting = getDailyNoteSettings();
  dailyNoteFormat = dailyNotesSetting.format;
  return dailyNoteFormat;
}

export function getDailyNotePath(): string {
  let dailyNotePath = '';
  const folderFromPeriodicNotesNew = window.app.plugins
    .getPlugin('periodic-notes')
    ?.calendarSetManager?.getActiveConfig('day')?.folder;
  const folderFromPeriodicNotes = window.app.plugins.getPlugin('periodic-notes')?.settings?.daily.folder;
  // console.log(window.app.plugins.getPlugin('periodic-notes'));
  // const periodicNotes = window.app.plugins.getPlugin('periodic-notes');
  if (folderFromPeriodicNotesNew !== '' && folderFromPeriodicNotesNew !== undefined) {
    // const periodicNotes = window.app.plugins.getPlugin('periodic-notes');
    dailyNotePath = window.app.plugins.getPlugin('periodic-notes').calendarSetManager.getActiveConfig('day').folder;
    return dailyNotePath;
  }
  if (folderFromPeriodicNotes !== undefined && folderFromPeriodicNotes !== '') {
    // const dailyNotes = window.app.plugins.getPlugin('periodic-notes');
    dailyNotePath = window.app.plugins.getPlugin('periodic-notes').settings.daily.folder;
    // console.log(dailyNotePath);
    return dailyNotePath;
  }
  const dailyNotesSetting = getDailyNoteSettings();
  dailyNotePath = dailyNotesSetting.folder;
  if (dailyNotePath === '' || dailyNotePath === undefined) {
    new Notice(t("You didn't set folder for daily notes in both periodic-notes and daily-notes plugins."));
  }
  return dailyNotePath;
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
