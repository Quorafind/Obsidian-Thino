import { useEffect, useRef, useState } from "react";
// import { userService } from "../services";
import toImage from "../labs/html2image";
import { ANIMATION_DURATION, IMAGE_URL_REG, MARKDOWN_URL_REG, MARKDOWN_WEB_URL_REG, WIKI_IMAGE_URL_REG } from "../helpers/consts";
import utils from "../helpers/utils";
import { showDialog } from "./Dialog";
import { formatMemoContent } from "./Memo";
import Only from "./common/OnlyWhen";
import toastHelper from "./Toast";
import "../less/share-memo-image-dialog.less";
import React from "react";
import { TFile, Vault } from "obsidian";
import appStore from "../stores/appStore";
import { UserName } from '../memos';
import close from '../icons/close.svg';

interface Props extends DialogProps {
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

const detectWikiInternalLink = (lineText : string) : LinkMatch | null => {

  const { metadataCache,vault } = appStore.getState().dailyNotesState.app;
  const internalFileName =  WIKI_IMAGE_URL_REG.exec(lineText)?.[1]
  const internalAltName =  WIKI_IMAGE_URL_REG.exec(lineText)?.[5]
  const file = metadataCache.getFirstLinkpathDest(decodeURIComponent(internalFileName), '');
  if(file === null){
    return {
      linkText: internalFileName,
      altText: internalAltName,
      path: "",
    }
  }else{
    const imagePath = getPathOfImage(vault, file);
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
    }
  }else{
    const imagePath = getPathOfImage(vault, file);
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
}

const ShareMemoImageDialog: React.FC<Props> = (props: Props) => {

  const { memo: propsMemo, destroy } = props;
  // const { user: userinfo } = userService.getState();
  const memo: FormattedMemo = {
    ...propsMemo,
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
  };
  // const memoImgUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);

  
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


  const [shortcutImgUrl, setShortcutImgUrl] = useState("");
  const [imgAmount, setImgAmount] = useState(externalImageUrls.length);
  const memoElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imgAmount > 0) {
      return;
    }

    setTimeout(() => {
      if (!memoElRef.current) {
        return;
      }

      toImage(memoElRef.current, {
        backgroundColor: "#eaeaea",
        pixelRatio: window.devicePixelRatio * 2,
      })
        .then((url) => {
          setShortcutImgUrl(url);
        })
        .catch(() => {
          // do nth
        });
    }, ANIMATION_DURATION);
  }, [imgAmount]);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleImageOnLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    if (ev.type === "error") {
      toastHelper.error("有个图片加载失败了😟");
      (ev.target as HTMLImageElement).remove();
    }
    setImgAmount(imgAmount - 1);
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">🥰</span>分享 Memo 图片
        </p>
        <button className="btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src={close} />
        </button>
      </div>
      <div className="dialog-content-container">
        <div className={`tip-words-container ${shortcutImgUrl ? "finish" : "loading"}`}>
          <p className="tip-text">{shortcutImgUrl ? "右键或长按即可保存图片 👇" : "图片生成中..."}</p>
        </div>
        <div className="memo-container" ref={memoElRef}>
          <Only when={shortcutImgUrl !== ""}>
            <img className="memo-shortcut-img" src={shortcutImgUrl} />
          </Only>
          <span className="time-text">{memo.createdAtStr}</span>
          <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: formatMemoContent(memo.content) }}></div>
          <Only when={externalImageUrls.length > 0}>
            <div className="images-container">
              {externalImageUrls.map((imgUrl, idx) => (
                <img
                  crossOrigin="anonymous"
                  decoding="async"
                  key={idx}
                  src={imgUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  onLoad={handleImageOnLoad}
                  onError={handleImageOnLoad}
                />
              ))}
            </div>
          </Only>
          <Only when={internalImageUrls.length > 0}>
          <div className="images-container internal-embed image-embed is-loaded">
            {internalImageUrls.map((imgUrl, idx) => (
              <img key={idx} className="memo-img" src={imgUrl.path} alt={imgUrl.altText}/>
            ))}
          </div>
        </Only>
          <div className="watermark-container">
            <span className="normal-text">
              {/* TODO: 需要加上获取自定义名称的方式  {userinfo?.username} */}
              <span className="icon-text">✍️</span> by <span className="name-text">{UserName}</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default function showShareMemoImageDialog(memo: Model.Memo): void {
  showDialog(
    {
      className: "share-memo-image-dialog",
    },
    ShareMemoImageDialog,
    { memo }
  );
}
