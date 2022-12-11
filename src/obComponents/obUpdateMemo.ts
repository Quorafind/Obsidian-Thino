import { moment, TFile } from 'obsidian';
import appStore from '../stores/appStore';
import utils from '../helpers/utils';

export async function changeMemo(
  memoid: string,
  originalContent: string,
  content: string,
  memoType?: string,
  path?: string,
): Promise<Model.Memo> {
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
    file = await utils.getDailyNote(changeDate);
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

export async function getFile(memoid: string): Promise<TFile> {
  const timeString = memoid.slice(0, 14);
  const changeDate = moment(timeString, 'YYYYMMDDHHmmSS');
  const dailyNote = await utils.getDailyNote(changeDate);
  return dailyNote;
}

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
