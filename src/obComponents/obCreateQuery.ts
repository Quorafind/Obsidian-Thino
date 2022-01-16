import { getDailyNotePath } from "./obUpdateMemo";
import { TFile, normalizePath, Notice } from "obsidian";
import moment from "moment";
import appStore from "../stores/appStore";

export const createObsidianQuery = async (title: string, querystring: string): Promise<any> => {
  const { metadataCache, vault } = appStore.getState().dailyNotesState.app;

  const filePath = getDailyNotePath();
  const absolutePath = filePath + "/query.md";

  const queryFile = metadataCache.getFirstLinkpathDest("", absolutePath);

  if (queryFile instanceof TFile) {
    const fileContents = await vault.cachedRead(queryFile);
    const fileLines = getAllLinesFromFile(fileContents);
    const date = moment();
    const createdDate = date.format("YYYY/MM/DD HH:mm:ss");
    const updatedDate = createdDate;
    // const lineNum = fileLines.length + 1;
    // let lineNum;
    let lineNum;
    if (fileLines.length === 1 && fileLines[0] === "") {
      lineNum = 1;
    } else {
      lineNum = fileLines.length + 1;
    }
    const id = date.format("YYYYMMDDHHmmss") + lineNum;

    await createQueryInFile(queryFile, fileContents, id, title, querystring);

    return [
      {
        createdAt: createdDate,
        id: id,
        pinnedAt: "",
        querystring: querystring,
        title: title,
        updatedAt: updatedDate,
        userId: "",
      },
    ];
  } else {
    const queryFilePath = normalizePath(absolutePath);
    const file = await createQueryFile(queryFilePath);
    const fileContents = await vault.cachedRead(file);
    const date = moment();
    const createdDate = date.format("YYYY/MM/DD HH:mm:ss");
    const updatedDate = createdDate;
    const id = date.format("YYYYMMDDHHmmss") + 1;

    await createQueryInFile(file, fileContents, id, title, querystring);

    return [
      {
        createdAt: createdDate,
        id: id,
        pinnedAt: "",
        querystring: querystring,
        title: title,
        updatedAt: updatedDate,
        userId: "",
      },
    ];
  }
};

export const createQueryInFile = async (file: TFile, fileContent: string, id: string, title: string, queryString: string): Promise<any> => {
  const { vault } = appStore.getState().dailyNotesState.app;
  let newContent;
  if (fileContent === "") {
    newContent = id + " " + title + " " + queryString;
  } else {
    newContent = fileContent + "\n" + id + " " + title + " " + queryString;
  }

  await vault.modify(file, newContent);

  return true;
};

export const createQueryFile = async (path: string): Promise<TFile> => {
  const { vault } = appStore.getState().dailyNotesState.app;

  try {
    const createdFile = await vault.create(path, "");
    return createdFile;
  } catch (err) {
    console.error(`Failed to create file: '${path}'`, err);
    new Notice("Unable to create new file.");
  }
};

const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);