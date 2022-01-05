import { getDailyNotePath } from "./obUpdateMemo";
import { TFile } from 'obsidian';
import moment from '_obsidian@0.13.11@obsidian/node_modules/moment';
import appStore from "../stores/appStore";

export const findQuery = async (): Promise<any[]> => {

    const { metadataCache, vault } = appStore.getState().dailyNotesState.app;

    const queryList = [];

    const filePath = getDailyNotePath();
    const absolutePath = filePath + "/query.md";

    const queryFile = metadataCache.getFirstLinkpathDest("" , absolutePath);
    if(queryFile instanceof TFile){
        const fileContents = await vault.cachedRead(queryFile);
        const fileLines = getAllLinesFromFile(fileContents);
        if(fileLines && fileLines.length != 0){
            for(let i = 0; i < fileLines.length; i++){
                if(fileLines[i] === "") continue;
                const createdDateString = getCreatedDateFromLine(fileLines[i]);
                const createdDate = moment(createdDateString, "YYYYMMDDHHmmss").format("YYYY/MM/DD HH:mm:ss");
                const updatedDate = createdDate;
                const id = createdDateString + getIDFromLine(fileLines[i]);
                const querystring = getStringFromLine(fileLines[i]);
                const title = getTitleFromLine(fileLines[i]);
                let pinnedDate;

                if(/^(.+)pinnedAt(.+)$/.test(fileLines[i])){
                    pinnedDate = moment(getPinnedDateFromLine(fileLines[i]),"YYYYMMDDHHmmss");
                    queryList.push({
                        createdAt: createdDate,
                        id: id,
                        pinnedAt: pinnedDate.format("YYYY/MM/DD HH:mm:ss"),
                        querystring: querystring,
                        title: title,
                        updatedAt: updatedDate,
                        userId: "",
                      });
                }else if(/^(.+)\[\](.+)?$/.test(fileLines[i])){
                    queryList.push({
                        createdAt: createdDate,
                        id: id,
                        pinnedAt: "",
                        querystring: "",
                        title: title,
                        updatedAt: updatedDate,
                        userId: "",
                      });
                }else {
                    queryList.push({
                        createdAt: createdDate,
                        id: id,
                        pinnedAt: "",
                        querystring: querystring,
                        title: title,
                        updatedAt: updatedDate,
                        userId: "",
                      });
                }
            }
        }
    }

    return queryList;
}


const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
//eslint-disable-next-line
const getCreatedDateFromLine = (line: string) => /^(\d{14})/.exec(line)?.[1]
//eslint-disable-next-line
const getIDFromLine = (line: string) => /^(\d{14})(\d{1,})\s/.exec(line)?.[2]
//eslint-disable-next-line
const getStringFromLine = (line: string) => /^(\d{14})(\d{1,})\s(.+)\s(\[(.+)?\])/.exec(line)?.[4]
//eslint-disable-next-line
const getTitleFromLine = (line: string) => /^(\d{14})(\d{1,})\s(.+)\s(\[(.+)\])/.exec(line)?.[3]
//eslint-disable-next-line
const getPinnedDateFromLine = (line: string) => /^(\d{14})(\d{1,})\s(.+)\s(\[(.+)\])\s(pinnedAt\: (\d{14}))/.exec(line)?.[7]

