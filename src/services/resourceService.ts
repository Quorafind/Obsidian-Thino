// import api from "../helpers/api";

import { moment, TFile } from 'obsidian';
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import appStore from '../stores/appStore';
import { memoService } from './index';
// import dailyNotesService from './dailyNotesService';

// interface FileData {
//   buffer: ArrayBuffer;
//   mimeType: string;
//   originalName: string;
// }

class ResourceService {
  /**
   * Upload resource file to server,
   * @param file file
   * @returns resource: id, filename
   */
  public async upload(file: File) {
    const { vault, fileManager } = appStore.getState().dailyNotesState.app;

    const fileArray = await file.arrayBuffer();
    const ext = getExt(file.type);

    const dailyNotes = getAllDailyNotes();
    const date = moment();
    const existingFile = getDailyNote(date, dailyNotes);
    let newFile;
    if (!existingFile) {
      const dailyFile = await createDailyNote(date);
      newFile = await vault.createBinary(
        //@ts-expect-error, private method
        await vault.getAvailablePathForAttachments(`Pasted Image ${moment().format('YYYYMMDDHHmmss')}`, ext, dailyFile),
        fileArray,
      );
    } else if (existingFile instanceof TFile) {
      newFile = await vault.createBinary(
        //@ts-expect-error, private method
        await vault.getAvailablePathForAttachments(
          `Pasted Image ${moment().format('YYYYMMDDHHmmss')}`,
          ext,
          existingFile,
        ),
        fileArray,
      );
    }
    return fileManager.generateMarkdownLink(newFile, newFile.path, '', '');
  }

  /**
   * Parse Html File to Array,
   * @param file file
   * @returns memo: Model.Memo[]
   */
  public async parseHtml(html: File) {
    const output = await html.text();
    const el = document.createElement('html');
    el.innerHTML = output;
    const elementsByClassName = el.getElementsByClassName('memo');
    for (let i = 0; i < elementsByClassName.length; i++) {
      const source = elementsByClassName[i]
        .getElementsByClassName('content')[0]
        .innerHTML.replace(/\s{16}?<p><\/p>/g, '')
        .replace(/\s{16}?<p>/g, '')
        .replace(/<\/p>/g, '')
        .replace(/<strong>/g, '**')
        .replace(/<\/strong>/g, '**')
        .replace(/^\s{16}/g, '');
      console.log(elementsByClassName[i].getElementsByClassName('content')[0].innerHTML);
      const importedMemo = await memoService.importMemos(
        source,
        true,
        moment(elementsByClassName[i].getElementsByClassName('time')[0].innerHTML),
      );
      memoService.pushMemo(importedMemo);
    }
    // return fileData;
  }
}

//eslint-disable-next-line
const getExt = (line: string) => /^image\/(.+)$/.exec(line)?.[1];

const resourceService = new ResourceService();

export default resourceService;
