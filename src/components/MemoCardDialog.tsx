import { useState, useEffect, useCallback } from "react";
import { IMAGE_URL_REG, MARKDOWN_URL_REG, MARKDOWN_WEB_URL_REG, MEMO_LINK_REG, WIKI_IMAGE_URL_REG } from "../helpers/consts";
import utils from "../helpers/utils";
import { globalStateService, memoService } from "../services";
import { parseHtmlToRawText } from "../helpers/marked";
import { formatMemoContent } from "./Memo";
import toastHelper from "./Toast";
import { showDialog } from "./Dialog";
import Only from "./common/OnlyWhen";
import Image from "./Image";
import "../less/memo-card-dialog.less";
import React from "react";
import { TFile, Vault } from "obsidian";
import appStore from "../stores/appStore";

interface LinkedMemo extends FormattedMemo {
  dateStr: string;
}

interface Props extends DialogProps {
  memo: Model.Memo;
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

const detectMDInternalLink = (lineText : string) : LinkMatch | null => {

  const { metadataCache,vault } = appStore.getState().dailyNotesState.app;
  const internalFileName =  MARKDOWN_URL_REG.exec(lineText)?.[5]
  const internalAltName =  MARKDOWN_URL_REG.exec(lineText)?.[2]
  const file = metadataCache.getFirstLinkpathDest(decodeURIComponent(internalFileName), '');
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

const MemoCardDialog: React.FC<Props> = (props: Props) => {
  const [memo, setMemo] = useState<FormattedMemo>({
    ...props.memo,
    createdAtStr: utils.getDateTimeString(props.memo.createdAt),
  });
  const [linkMemos, setLinkMemos] = useState<LinkedMemo[]>([]);
  const [linkedMemos, setLinkedMemos] = useState<LinkedMemo[]>([]);
  
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
        if(MARKDOWN_WEB_URL_REG.test(two)){
          anotherExternalImageUrls.push(MARKDOWN_URL_REG.exec(two)?.[5]);
        }else{
          internalImageUrls.push(detectMDInternalLink(two));
        }
      }
    }
    externalImageUrls = allExternalImageUrls.concat(anotherExternalImageUrls);
    // externalImageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);
  }

  useEffect(() => {
    const fetchLinkedMemos = async () => {
      try {
        const linkMemos: LinkedMemo[] = [];
        const matchedArr = [...memo.content.matchAll(MEMO_LINK_REG)];
        for (const matchRes of matchedArr) {
          if (matchRes && matchRes.length === 3) {
            const id = matchRes[2];
            const memoTemp = memoService.getMemoById(id);
            if (memoTemp) {
              linkMemos.push({
                ...memoTemp,
                createdAtStr: utils.getDateTimeString(memoTemp.createdAt),
                dateStr: utils.getDateString(memoTemp.createdAt),
              });
            }
          }
        }
        setLinkMemos([...linkMemos]);

        const linkedMemos = await memoService.getLinkedMemos(memo.id);
        setLinkedMemos(
          linkedMemos
            .sort((a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt))
            .map((m) => ({
              ...m,
              createdAtStr: utils.getDateTimeString(m.createdAt),
              dateStr: utils.getDateString(m.createdAt),
            }))
        );
      } catch (error) {
        // do nth
      }
    };

    fetchLinkedMemos();
  }, [memo.id]);

  const handleMemoContentClick = useCallback(async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.className === "memo-link-text") {
      const nextMemoId = targetEl.dataset?.value;
      const memoTemp = memoService.getMemoById(nextMemoId ?? "");

      if (memoTemp) {
        const nextMemo = {
          ...memoTemp,
          createdAtStr: utils.getDateTimeString(memoTemp.createdAt),
        };
        setLinkMemos([]);
        setLinkedMemos([]);
        setMemo(nextMemo);
      } else {
        toastHelper.error("MEMO Not Found");
        targetEl.classList.remove("memo-link-text");
      }
    }
  }, []);

  const handleLinkedMemoClick = useCallback((memo: FormattedMemo) => {
    setLinkMemos([]);
    setLinkedMemos([]);
    setMemo(memo);
  }, []);

  const handleEditMemoBtnClick = useCallback(() => {
    props.destroy();
    globalStateService.setEditMemoId(memo.id);
  }, [memo.id]);

  return (
    <>
      <div className="memo-card-container">
        <div className="header-container">
          <p className="time-text">{memo.createdAtStr}</p>
          <div className="btns-container">
            <button className="btn edit-btn" onClick={handleEditMemoBtnClick}>
              <img className="icon-img" src="https://raw.githubusercontent.com/Quorafind/memos/main/web/public/icons/edit.svg" />
            </button>
            <button className="btn close-btn" onClick={props.destroy}>
              <img className="icon-img" src="https://raw.githubusercontent.com/Quorafind/memos/main/web/public/icons/close.svg" />
            </button>
          </div>
        </div>
        <div className="memo-container">
          <div
            className="memo-content-text"
            onClick={handleMemoContentClick}
            dangerouslySetInnerHTML={{ __html: formatMemoContent(memo.content) }}
          ></div>
        <Only when={externalImageUrls.length > 0}>
          <div className="images-wrapper">
            {externalImageUrls.map((imgUrl, idx) => (
              <Image key={idx} className="memo-img" imgUrl={imgUrl} alt="" referrerPolicy="no-referrer" />
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
        <div className="layer-container"></div>
        {linkMemos.map((_, idx) => {
          if (idx < 4) {
            return (
              <div
                className="background-layer-container"
                key={idx}
                style={{
                  bottom: (idx + 1) * -3 + "px",
                  left: (idx + 1) * 5 + "px",
                  width: `calc(100% - ${(idx + 1) * 10}px)`,
                  zIndex: -idx - 1,
                }}
              ></div>
            );
          } else {
            return null;
          }
        })}
      </div>
      {linkMemos.length > 0 ? (
        <div className="linked-memos-wrapper">
          <p className="normal-text">LINKED {linkMemos.length} MEMO </p>
          {linkMemos.map((m) => {
            const rawtext = parseHtmlToRawText(formatMemoContent(m.content)).replaceAll("\n", " ");
            return (
              <div className="linked-memo-container" key={m.id} onClick={() => handleLinkedMemoClick(m)}>
                <span className="time-text">{m.dateStr} </span>
                {rawtext}
              </div>
            );
          })}
        </div>
      ) : null}
      {linkedMemos.length > 0 ? (
        <div className="linked-memos-wrapper">
          <p className="normal-text">{linkedMemos.length} MEMO LINK TO THE MEMO</p>
          {linkedMemos.map((m) => {
            const rawtext = parseHtmlToRawText(formatMemoContent(m.content)).replaceAll("\n", " ");
            return (
              <div className="linked-memo-container" key={m.id} onClick={() => handleLinkedMemoClick(m)}>
                <span className="time-text">{m.dateStr} </span>
                {rawtext}
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default function showMemoCardDialog(memo: Model.Memo): void {
  showDialog(
    {
      className: "memo-card-dialog",
    },
    MemoCardDialog,
    { memo }
  );
}
