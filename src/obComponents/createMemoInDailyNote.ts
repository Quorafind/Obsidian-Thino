import moment from "moment";
import { createDailyNote, getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import appStore from "../stores/appStore";
import { InsertAfter } from "../memos";

// https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
export async function escapeRegExp(text : any) {
    return await text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
  
//credit to chhoumann, original code from: https://github.com/chhoumann/quickadd/blob/7536a120701a626ef010db567cea7cf3018e6c82/src/utility.ts#L130
export function getLinesInString(input: string) {
    const lines: string[] = [];
    let tempString = input;
  
    while (tempString.contains("\n")) {
        const lineEndIndex = tempString.indexOf("\n");
        lines.push(tempString.slice(0, lineEndIndex));
        tempString = tempString.slice(lineEndIndex + 1);
    }
  
    lines.push(tempString);
  
    return lines;
}

export async function waitForInsert(MemoContent: string) : Promise<Model.Memo>{
    // const plugin = window.plugin;
    const { vault } = appStore.getState().dailyNotesState.app;
    const removeEnter = MemoContent.replace(/\n/g, "<br>")
    const date = moment();
    const timeHour = date.format('HH');
    const timeMinute = date.format('mm');
  
    const newEvent = `- ` + String(timeHour) + `:` + String(timeMinute) + ` ` + removeEnter;
    const dailyNotes = await getAllDailyNotes();
    const existingFile = getDailyNote(date, dailyNotes);
    if(!existingFile){
      const file = await createDailyNote(date);
      const fileContents = await vault.cachedRead(file);
      const newFileContent = await insertAfterHandler(InsertAfter, newEvent ,fileContents);
      await vault.modify(file, newFileContent);
      return {
        id: date.format('YYYYMMDDHHmmSS'),
        content: MemoContent,
        deletedAt: "",
        createdAt: date.format('YYYY/MM/DD HH:mm:SS'),
        updatedAt: date.format('YYYY/MM/DD HH:mm:SS'),
      }
    }else{
      const fileContents = await vault.cachedRead(existingFile);
      const newFileContent = await insertAfterHandler(InsertAfter, newEvent ,fileContents);
      await vault.modify(existingFile, newFileContent);
      return {
        id: date.format('YYYYMMDDHHmmSS'),
        content: MemoContent,
        deletedAt: "",
        createdAt: date.format('YYYY/MM/DD HH:mm:SS'),
        updatedAt: date.format('YYYY/MM/DD HH:mm:SS'),
      }
    }
  }
  
  //credit to chhoumann, original code from: https://github.com/chhoumann/quickadd
export async function insertAfterHandler(targetString: string, formatted: string, fileContent: string) {
    // const targetString: string = plugin.settings.InsertAfter;
    //eslint-disable-next-line
    const targetRegex = new RegExp(`\s*${await escapeRegExp(targetString)}\s*`);
    const fileContentLines: string[] = getLinesInString(fileContent);
  
    const targetPosition = fileContentLines.findIndex(line => targetRegex.test(line));
    const targetNotFound = targetPosition === -1;
    if (targetNotFound) {
        // if (this.choice.insertAfter?.createIfNotFound) {
        //     return await createInsertAfterIfNotFound(formatted);
        // }
  
        console.log("unable to find insert after line in file.")
    }

        const nextHeaderPositionAfterTargetPosition = fileContentLines
            .slice(targetPosition + 1)
            .findIndex(line => (/^#+ |---/).test(line))
        const foundNextHeader = nextHeaderPositionAfterTargetPosition !== -1;
  
        if (foundNextHeader) {
            let endOfSectionIndex: number;
  
            for (let i = nextHeaderPositionAfterTargetPosition + targetPosition; i > targetPosition; i--) {
                const lineIsNewline: boolean = (/^[\s\n ]*$/).test(fileContentLines[i]);
                if (!lineIsNewline) {
                    endOfSectionIndex = i;
                    break;
                }
            }
  
            if (!endOfSectionIndex) endOfSectionIndex = targetPosition;
  
            return await insertTextAfterPositionInBody(formatted, fileContent, endOfSectionIndex);
        } else {
            return await insertTextAfterPositionInBody(formatted, fileContent, fileContentLines.length - 1);
        }
    // return insertTextAfterPositionInBody(formatted, fileContent, targetPosition);
  }
  
export async function insertTextAfterPositionInBody(text: string, body: string, pos: number): Promise<string> {
    if (pos === -1) {
        return `${text}\n${body}`;
    }
  
    const splitContent = body.split("\n");
    const pre = splitContent.slice(0, pos + 1).join("\n");
    const post = splitContent.slice(pos + 1).join("\n");
  
    return `${pre}\n${text}\n${post}`;
}