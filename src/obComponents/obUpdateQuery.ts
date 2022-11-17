import { moment, TFile } from 'obsidian';
import appStore from '../stores/appStore';
import { QueryFileName } from '../memos';
import { getDailyNotePath } from '../helpers/utils';

export const updateObsidianQuery = async (queryId: string, title: string, queryString: string): Promise<any> => {
  const { metadataCache, vault } = appStore.getState().dailyNotesState.app;

  const filePath = getDailyNotePath();
  const absolutePath = filePath + '/' + QueryFileName + '.md';

  const queryFile = metadataCache.getFirstLinkpathDest('', absolutePath);

  if (queryFile instanceof TFile) {
    const fileContents = await vault.read(queryFile);
    const fileLines = getAllLinesFromFile(fileContents);

    let lineID;

    if (/^\d{1,3}$/.test(queryId)) {
      lineID = queryId;
    } else {
      lineID = getIDFromLine(queryId);
    }

    const lineNum = parseInt(lineID) - 1;

    if (fileLines && fileLines.length != 0) {
      const oldContent = fileLines[lineNum];

      const date = moment();
      const updatedDateString = date.format('YYYYMMDDHHmmss');
      const updatedDate = date.format('YYYY/MM/DD HH:mm:ss');
      const newLineNum = lineNum + 1;
      const id = updatedDateString + newLineNum;
      if (/^(.+)pinnedAt(.+)$/.test(oldContent)) {
        const pinnedString = getPinnedStringFromLine(oldContent);
        const pinnedDateString = getPinnedDateFromLine(oldContent);
        const newContent = id + ' ' + title + ' ' + queryString + ' ' + pinnedString;
        const pinnedAtDate = moment(pinnedDateString, 'YYYYMMDDHHmmss').format('YYYY/MM/DD HH:mm:ss');
        const newFileContents = fileContents.replace(oldContent, newContent);

        await vault.modify(queryFile, newFileContents);

        return [
          {
            createdAt: updatedDate,
            id: id,
            pinnedAt: pinnedAtDate,
            querystring: queryString,
            title: title,
            updatedAt: updatedDate,
            userId: '',
          },
        ];
      } else {
        const newContent = id + ' ' + title + ' ' + queryString;

        const newFileContents = fileContents.replace(oldContent, newContent);

        await vault.modify(queryFile, newFileContents);

        return [
          {
            createdAt: updatedDate,
            id: id,
            pinnedAt: '',
            querystring: queryString,
            title: title,
            updatedAt: updatedDate,
            userId: '',
          },
        ];
      }
    }
  }
};

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
//eslint-disable-next-line
const getIDFromLine = (line: string) => /^(\d{14})(\d{1,})/.exec(line)?.[2];
//eslint-disable-next-line
const getPinnedStringFromLine = (line: string) =>
  /^(\d{14})(\d{1,})\s(.+)\s(\[(.+)\])\s(pinnedAt: (\d{14})\d+)/.exec(line)?.[6];
//eslint-disable-next-line
const getPinnedDateFromLine = (line: string) =>
  /^(\d{14})(\d{1,})\s(.+)\s(\[(.+)\])\s(pinnedAt: (\d{14})\d+)/.exec(line)?.[7];
