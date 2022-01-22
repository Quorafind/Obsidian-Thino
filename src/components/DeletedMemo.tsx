import { IMAGE_URL_REG, MARKDOWN_URL_REG, MARKDOWN_WEB_URL_REG, WIKI_IMAGE_URL_REG } from "../helpers/consts";
import utils from "../helpers/utils";
import useToggle from "../hooks/useToggle";
import { memoService } from "../services";
import Only from "./common/OnlyWhen";
import Image from "./Image";
import { formatMemoContent } from "./Memo";
import "../less/memo.less";
import React from "react";
import { Notice, TFile, Vault } from "obsidian";
import appStore from "../stores/appStore";
import more from '../icons/more.svg';

interface Props {
  memo: Model.Memo;
  handleDeletedMemoAction: (memoId: string) => void;
}

interface LinkMatch {
  linkText: string;
  altText: string;
  path: string;
  filepath?: string;
}

export const getPathOfImage = (vault: Vault, image: TFile) => {
  return vault.getResourcePath(image);
};

const detectWikiInternalLink = (lineText : string) : LinkMatch | null => {

  const { metadataCache,vault } = appStore.getState().dailyNotesState.app;
  const internalFileName =  WIKI_IMAGE_URL_REG.exec(lineText)?.[1]
  const internalAltName =  WIKI_IMAGE_URL_REG.exec(lineText)?.[5]
  const file = metadataCache.getFirstLinkpathDest(decodeURIComponent(internalFileName), '');
  if( file === null ){
    return {
      linkText: internalFileName,
      altText: internalAltName,
      path: "",
      filepath: "",
    }
  }else{
    const imagePath = getPathOfImage(vault, file);
    const filePath = file.path;
    if(internalAltName){
      return {
        linkText: internalFileName,
        altText: internalAltName,
        path: imagePath,
        filepath: filePath,
      }
    }else {
      return {
        linkText: internalFileName,
        altText: "",
        path: imagePath,
        filepath: filePath,
      }
    }
  }
}

const detectMDInternalLink = (lineText : string) : LinkMatch | null => {

  const { metadataCache,vault } = appStore.getState().dailyNotesState.app;
  const internalFileName =  MARKDOWN_URL_REG.exec(lineText)?.[5]
  const internalAltName =  MARKDOWN_URL_REG.exec(lineText)?.[2]
  const file = metadataCache.getFirstLinkpathDest(decodeURIComponent(internalFileName), '');
  if(file === null){
    return {
      linkText: internalFileName,
      altText: internalAltName,
      path: "",
      filepath: "",
    }
  }else{
    const imagePath = getPathOfImage(vault, file);
    const filePath = file.path;
    if(internalAltName){
      return {
        linkText: internalFileName,
        altText: internalAltName,
        path: imagePath,
        filepath: filePath,
      }
    }else {
      return {
        linkText: internalFileName,
        altText: "",
        path: imagePath,
        filepath: filePath,
      }
    }
  }
}

const DeletedMemo: React.FC<Props> = (props: Props) => {

  // const { app }  = appStore.getState().dailyNotesState;

  const { memo: propsMemo, handleDeletedMemoAction } = props;
  const memo: FormattedMemo = {
    ...propsMemo,
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
    deletedAtStr: utils.getDateTimeString(propsMemo.deletedAt ?? Date.now()),
  };
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);
  // const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);
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
        internalImageUrls.push(detectWikiInternalLink(one));
      }
    }
    if(allMarkdownLink.length){
      for(let i = 0; i < allMarkdownLink.length; i++){
        let two = allMarkdownLink[i];
        if(/(.*)http[s]?(.*)/.test(two)){
          anotherExternalImageUrls.push(MARKDOWN_URL_REG.exec(two)?.[5]);
        }else{
          internalImageUrls.push(detectMDInternalLink(two));
        }
      }
    }
    externalImageUrls = allExternalImageUrls.concat(anotherExternalImageUrls);
    // externalImageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);
  }

  const handleDeleteMemoClick = async () => {
    if (showConfirmDeleteBtn) {
      try {
        await memoService.deleteMemoById(memo.id);
        handleDeletedMemoAction(memo.id);
      } catch (error: any) {
        new Notice(error.message);
      }
    } else {
      toggleConfirmDeleteBtn();
    }
  };

  const handleRestoreMemoClick = async () => {
    try {
      await memoService.restoreMemoById(memo.id);
      handleDeletedMemoAction(memo.id);
      new Notice("RESTORE SUCCEED");
    } catch (error: any) {
      new Notice(error.message);
    }
  };

  const handleMouseLeaveMemoWrapper = () => {
    if (showConfirmDeleteBtn) {
      toggleConfirmDeleteBtn(false);
    }
  };

  return (
    <div className={`memo-wrapper ${"memos-" + memo.id}`} onMouseLeave={handleMouseLeaveMemoWrapper}>
      <div className="memo-top-wrapper">
        <span className="time-text">DELETE AT {memo.deletedAtStr}</span>
        <div className="btns-container">
          <span className="btn more-action-btn">
            <img className="icon-img" src={more} />
          </span>
          <div className="more-action-btns-wrapper">
            <div className="more-action-btns-container">
              <span className="btn restore-btn" onClick={handleRestoreMemoClick}>
                RESTORE
              </span>
              <span className={`btn delete-btn ${showConfirmDeleteBtn ? "final-confirm" : ""}`} onClick={handleDeleteMemoClick}>
                {showConfirmDeleteBtn ? "CONFIRM！" : "DELETE"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: formatMemoContent(memo.content) }}></div>
      <Only when={externalImageUrls.length > 0}>
          <div className="images-wrapper">
            {externalImageUrls.map((imgUrl, idx) => (
              <Image alt="" key={idx} className="memo-img" imgUrl={imgUrl} referrerPolicy="no-referrer" />
            ))}
          </div>
        </Only>
        <Only when={internalImageUrls.length > 0}>
          <div className="images-wrapper internal-embed image-embed is-loaded">
            {internalImageUrls.map((imgUrl, idx) => (
              <Image key={idx} className="memo-img" imgUrl={imgUrl.path} alt={imgUrl.altText} filepath={imgUrl.filepath}/>
            ))}
          </div>
        </Only>
      {/* <Only when={imageUrls.length > 0}>
        <div className="images-wrapper">
          {imageUrls.map((imgUrl, idx) => (
            <Image className="memo-img" key={idx} imgUrl={imgUrl} />
          ))}
        </div>
      </Only> */}
    </div>
  );
};

export default DeletedMemo;
