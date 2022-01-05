import { IMAGE_URL_REG, MARKDOWN_URL_REG, MARKDOWN_WEB_URL_REG, WIKI_IMAGE_URL_REG } from "../helpers/consts";
import utils from "../helpers/utils";
import { formatMemoContent } from "./Memo";
import Only from "./common/OnlyWhen";
import "../less/daily-memo.less";
import React, { useContext, useEffect } from "react";
import { TFile, Vault, App } from 'obsidian';
import appStore from "../stores/appStore";
// import appContext from "../stores/appContext";
// import appStore from "../stores/appStore";
// import { dailyNotesService } from "../services";

interface DailyMemo extends FormattedMemo {
  timeStr: string;
}

interface Props {
  memo: Model.Memo;
}

interface LinkMatch {
  linkText: string;
  altText: string;
  path: string;
}

export const getPathOfImage = (vault: Vault, image: TFile) => {
  return vault.getResourcePath(image);
};

const detectWikiInternalLink = (lineText : string, app: App) : LinkMatch | null => {


  const internalFileName =  WIKI_IMAGE_URL_REG.exec(lineText)?.[1]
  const internalAltName =  WIKI_IMAGE_URL_REG.exec(lineText)?.[5]
  const file = app.metadataCache.getFirstLinkpathDest(decodeURIComponent(internalFileName), '');
  const imagePath = getPathOfImage(app.vault, file);
  if(internalAltName){
    return {
      linkText: internalFileName,
      altText: internalAltName,
      path: imagePath,
    }
  }else {
    return {
      linkText: internalFileName,
      altText: "",
      path: imagePath,
    }
  }
}

const detectMDInternalLink = (lineText : string, app: App) : LinkMatch | null => {

  // const { metadataCache,vault } = appStore.getState().dailyNotesState.app;
  const internalFileName =  MARKDOWN_URL_REG.exec(lineText)?.[5]
  const internalAltName =  MARKDOWN_URL_REG.exec(lineText)?.[2]
  const file = app.metadataCache.getFirstLinkpathDest(decodeURIComponent(internalFileName), '');
  const imagePath = getPathOfImage(app.vault, file);
  if(internalAltName){
    return {
      linkText: internalFileName,
      altText: internalAltName,
      path: imagePath,
    }
  }else {
    return {
      linkText: internalFileName,
      altText: "",
      path: imagePath,
    }
  }
}

const DailyMemo: React.FC<Props> = (props: Props) => {
  // const plugin = MemosPlugin;
  const { app }  = appStore.getState().dailyNotesState;
  const { memo: propsMemo } = props;
  const memo: DailyMemo = {
    ...propsMemo,
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
    timeStr: utils.getTimeString(propsMemo.createdAt),
  };
  let externalImageUrls = [] as string[];
  let internalImageUrls = [];
  let allMarkdownLink: string | any[] = [];
  let allInternalLink = [] as any[];
  if(IMAGE_URL_REG.test(memo.content)){
    let allExternalImageUrls = [] as string[];
    let anotherExternalImageUrls = [] as string[];
    if(MARKDOWN_URL_REG.test(memo.content)){
      allMarkdownLink = Array.from(memo.content.match(MARKDOWN_URL_REG));
    }
    if(WIKI_IMAGE_URL_REG.test(memo.content)){
      allInternalLink = Array.from(memo.content.match(WIKI_IMAGE_URL_REG));
    }
    // const allInternalLink = Array.from(memo.content.match(WIKI_IMAGE_URL_REG));
    if(MARKDOWN_WEB_URL_REG.test(memo.content)){
      allExternalImageUrls = Array.from(memo.content.match(MARKDOWN_WEB_URL_REG));
    }
    if(allInternalLink.length){
      for(let i = 0; i < allInternalLink.length; i++){
        let one = allInternalLink[i];
        internalImageUrls.push(detectWikiInternalLink(one,app));
      }
    }
    if(allMarkdownLink.length){
      for(let i = 0; i < allMarkdownLink.length; i++){
        let two = allMarkdownLink[i];
        if(MARKDOWN_WEB_URL_REG.test(two)){
          anotherExternalImageUrls.push(MARKDOWN_URL_REG.exec(two)?.[5]);
        }else{
          internalImageUrls.push(detectMDInternalLink(two,app));
        }
      }
    }
    externalImageUrls = allExternalImageUrls.concat(anotherExternalImageUrls);
    // externalImageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);
  }

  return (
    <div className="daily-memo-wrapper">
      <div className="time-wrapper">
        <span className="normal-text">{memo.timeStr}</span>
      </div>
      <div className="memo-content-container">
        <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: formatMemoContent(memo.content) }}></div>
        <Only when={externalImageUrls.length > 0}>
          <div className="images-container">
            {externalImageUrls.map((imgUrl, idx) => (
              <img key={idx} src={imgUrl} referrerPolicy="no-referrer" />
            ))}
          </div>
        </Only>
        <Only when={internalImageUrls.length > 0}>
          <div className="images-container internal-embed image-embed is-loaded">
            {internalImageUrls.map((imgUrl, idx) => (
              <img key={idx} src={imgUrl.path} alt={imgUrl.altText}/>
            ))}
          </div>
        </Only>
      </div>
    </div>
  );
};

export default DailyMemo;
