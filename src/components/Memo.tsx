import {memo, useCallback} from 'react';
import {
  FIRST_TAG_REG,
  IMAGE_URL_REG,
  LINK_REG,
  MARKDOWN_URL_REG,
  MARKDOWN_WEB_URL_REG,
  MD_LINK_REG,
  MEMO_LINK_REG,
  TAG_REG,
  WIKI_IMAGE_URL_REG,
} from '../helpers/consts';
import {encodeHtml, parseMarkedToHtml, parseRawTextToHtml} from '../helpers/marked';
import utils from '../helpers/utils';
import useToggle from '../hooks/useToggle';
import {globalStateService, memoService} from '../services';
import Only from './common/OnlyWhen';
import Image from './Image';
import showMemoCardDialog from './MemoCardDialog';
import showShareMemoImageDialog from './ShareMemoImageDialog';
import '../less/memo.less';
import React from 'react';
import {Notice, TFile, Vault} from 'obsidian';
import appStore from '../stores/appStore';
import {showMemoInDailyNotes} from '../obComponents/obShowMemo';
import more from '../icons/more.svg';
import {UseButtonToShowEditor, DefaultEditorLocation} from '../memos';

interface Props {
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

const detectWikiInternalLink = (lineText: string): LinkMatch | null => {
  const {metadataCache, vault} = appStore.getState().dailyNotesState.app;
  const internalFileName = WIKI_IMAGE_URL_REG.exec(lineText)?.[1];
  const internalAltName = WIKI_IMAGE_URL_REG.exec(lineText)?.[5];
  const file = metadataCache.getFirstLinkpathDest(decodeURIComponent(internalFileName), '');
  // console.log(file.path);
  if (file === null) {
    return {
      linkText: internalFileName,
      altText: internalAltName,
      path: '',
      filepath: '',
    };
  } else {
    const imagePath = getPathOfImage(vault, file);
    const filePath = file.path;
    if (internalAltName) {
      return {
        linkText: internalFileName,
        altText: internalAltName,
        path: imagePath,
        filepath: filePath,
      };
    } else {
      return {
        linkText: internalFileName,
        altText: '',
        path: imagePath,
        filepath: filePath,
      };
    }
  }
};

const detectMDInternalLink = (lineText: string): LinkMatch | null => {
  const {metadataCache, vault} = appStore.getState().dailyNotesState.app;
  const internalFileName = MARKDOWN_URL_REG.exec(lineText)?.[5];
  const internalAltName = MARKDOWN_URL_REG.exec(lineText)?.[2];
  const file = metadataCache.getFirstLinkpathDest(decodeURIComponent(internalFileName), '');
  if (file === null) {
    return {
      linkText: internalFileName,
      altText: internalAltName,
      path: '',
      filepath: '',
    };
  } else {
    const imagePath = getPathOfImage(vault, file);
    const filePath = file.path;
    if (internalAltName) {
      return {
        linkText: internalFileName,
        altText: internalAltName,
        path: imagePath,
        filepath: filePath,
      };
    } else {
      return {
        linkText: internalFileName,
        altText: '',
        path: imagePath,
        filepath: filePath,
      };
    }
  }
};

const Memo: React.FC<Props> = (props: Props) => {
  const {memo: propsMemo} = props;
  const memo: FormattedMemo = {
    ...propsMemo,
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
  };
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);

  // const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);

  let externalImageUrls = [] as string[];
  let internalImageUrls = [];
  let allMarkdownLink: string | any[] = [];
  let allInternalLink = [] as any[];
  if (IMAGE_URL_REG.test(memo.content)) {
    let allExternalImageUrls = [] as string[];
    let anotherExternalImageUrls = [] as string[];
    if (MARKDOWN_URL_REG.test(memo.content)) {
      allMarkdownLink = Array.from(memo.content.match(MARKDOWN_URL_REG));
    }
    if (WIKI_IMAGE_URL_REG.test(memo.content)) {
      allInternalLink = Array.from(memo.content.match(WIKI_IMAGE_URL_REG));
    }
    // const allInternalLink = Array.from(memo.content.match(WIKI_IMAGE_URL_REG));
    if (MARKDOWN_WEB_URL_REG.test(memo.content)) {
      allExternalImageUrls = Array.from(memo.content.match(MARKDOWN_WEB_URL_REG));
    }
    if (allInternalLink.length) {
      for (let i = 0; i < allInternalLink.length; i++) {
        let one = allInternalLink[i];
        internalImageUrls.push(detectWikiInternalLink(one));
      }
    }
    if (allMarkdownLink.length) {
      for (let i = 0; i < allMarkdownLink.length; i++) {
        let two = allMarkdownLink[i];
        if (/(.*)http[s]?(.*)/.test(two)) {
          anotherExternalImageUrls.push(MARKDOWN_URL_REG.exec(two)?.[5]);
        } else {
          internalImageUrls.push(detectMDInternalLink(two));
        }
      }
    }
    externalImageUrls = allExternalImageUrls.concat(anotherExternalImageUrls);
    // externalImageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);
  }

  const handleShowMemoStoryDialog = () => {
    showMemoCardDialog(memo);
  };

  const handleMarkMemoClick = () => {
    if (UseButtonToShowEditor && DefaultEditorLocation === 'Bottom') {
      let elem = document.querySelector(
        "div[data-type='memos_view'] .view-content .memo-show-editor-button",
      ) as HTMLElement;
      if (typeof elem.onclick == 'function' && elem !== undefined) {
        elem.onclick.apply(elem);
      }
    }

    globalStateService.setMarkMemoId(memo.id);
  };

  const handleEditMemoClick = () => {
    if (UseButtonToShowEditor && DefaultEditorLocation === 'Bottom') {
      let elem = document.querySelector(
        "div[data-type='memos_view'] .view-content .memo-show-editor-button",
      ) as HTMLElement;
      if (typeof elem.onclick == 'function' && elem !== undefined) {
        elem.onclick.apply(elem);
      }
    }

    globalStateService.setEditMemoId(memo.id);
  };

  const handleSourceMemoClick = () => {
    showMemoInDailyNotes(memo.id);
  };

  const handleDeleteMemoClick = async () => {
    if (showConfirmDeleteBtn) {
      try {
        await memoService.hideMemoById(memo.id);
      } catch (error: any) {
        new Notice(error.message);
      }

      if (globalStateService.getState().editMemoId === memo.id) {
        globalStateService.setEditMemoId('');
      }
    } else {
      toggleConfirmDeleteBtn();
    }
  };

  const handleMouseLeaveMemoWrapper = () => {
    if (showConfirmDeleteBtn) {
      toggleConfirmDeleteBtn(false);
    }
  };

  const handleGenMemoImageBtnClick = () => {
    showShareMemoImageDialog(memo);
  };

  const handleMemoKeyDown = useCallback((event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      handleSourceMemoClick();
    }
  }, []);

  const handleMemoDoubleKeyDown = useCallback((event: React.MouseEvent) => {
    if (event) {
      handleEditMemoClick();
    }
  }, []);

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.className === 'memo-link-text') {
      const memoId = targetEl.dataset?.value;
      const memoTemp = memoService.getMemoById(memoId ?? '');

      if (memoTemp) {
        showMemoCardDialog(memoTemp);
      } else {
        new Notice('MEMO Not Found');
        targetEl.classList.remove('memo-link-text');
      }
    } else if (targetEl.className === 'todo-block') {
      // do nth
    }
  };

  return (
    <div
      className={`memo-wrapper ${'memos-' + memo.id} ${memo.memoType}`}
      onMouseLeave={handleMouseLeaveMemoWrapper}
      onMouseDown={handleMemoKeyDown}
      onDoubleClick={handleMemoDoubleKeyDown}>
      <div className="memo-top-wrapper">
        <span className="time-text" onClick={handleShowMemoStoryDialog}>
          {memo.createdAtStr}
        </span>
        <div className="btns-container">
          <span className="btn more-action-btn">
            <img className="icon-img" src={more} />
          </span>
          <div className="more-action-btns-wrapper">
            <div className="more-action-btns-container">
              <span className="btn" onClick={handleShowMemoStoryDialog}>
                READ
              </span>
              <span className="btn" onClick={handleMarkMemoClick}>
                MARK
              </span>
              <span className="btn" onClick={handleGenMemoImageBtnClick}>
                SHARE
              </span>
              <span className="btn" onClick={handleEditMemoClick}>
                EDIT
              </span>
              <span className="btn" onClick={handleSourceMemoClick}>
                SOURCE
              </span>
              <span
                className={`btn delete-btn ${showConfirmDeleteBtn ? 'final-confirm' : ''}`}
                onClick={handleDeleteMemoClick}>
                {showConfirmDeleteBtn ? 'CONFIRM！' : 'DELETE'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="memo-content-text"
        onClick={handleMemoContentClick}
        dangerouslySetInnerHTML={{__html: formatMemoContent(memo.content, memo.id)}}></div>
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
            <Image
              key={idx}
              className="memo-img"
              imgUrl={imgUrl.path}
              alt={imgUrl.altText}
              filepath={imgUrl.filepath}
            />
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

export function formatMemoContent(content: string, memoid?: string) {
  content = encodeHtml(content);
  content = parseRawTextToHtml(content)
    .split('<br>')
    .map((t) => {
      return `<p>${t !== '' ? t : '<br>'}</p>`;
    })
    .join('');

  const {shouldUseMarkdownParser, shouldHideImageUrl} = globalStateService.getState();

  if (shouldUseMarkdownParser) {
    content = parseMarkedToHtml(content, memoid);
  }

  if (shouldHideImageUrl) {
    content = content.replace(WIKI_IMAGE_URL_REG, '').replace(MARKDOWN_URL_REG, '').replace(IMAGE_URL_REG, '');
  }

  // console.log(content);

  // 中英文之间加空格
  // if (shouldSplitMemoWord) {
  //   content = content
  //     .replace(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;[\]]+)/g, "$1 $2")
  //     .replace(/([A-Za-z0-9?.,;[\]]+)([\u4e00-\u9fa5])/g, "$1 $2");
  // }

  content = content
    .replace(TAG_REG, "<span class='tag-span'>#$1</span>")
    .replace(FIRST_TAG_REG, "<p><span class='tag-span'>#$2</span>")
    .replace(LINK_REG, "$1<a class='link' target='_blank' rel='noreferrer' href='$2'>$2</a>")
    .replace(MD_LINK_REG, "<a class='link' target='_blank' rel='noreferrer' href='$2'>$1</a>")
    .replace(MEMO_LINK_REG, "<span class='memo-link-text' data-value='$2'>$1</span>");

  // const contentMark = content.split('');

  // if(/(.*)<a(.*)/g.test(content)){

  // }
  //   for(let i=0; i<content.length;i++){
  //     let mark = false;
  //     let aMark = false;
  //     if(contentMark[i])
  //   }

  const tempDivContainer = document.createElement('div');
  tempDivContainer.innerHTML = content;
  for (let i = 0; i < tempDivContainer.children.length; i++) {
    const c = tempDivContainer.children[i];

    if (c.tagName === 'P' && c.textContent === '' && c.firstElementChild?.tagName !== 'BR') {
      c.remove();
      i--;
      continue;
    }
  }

  return tempDivContainer.innerHTML;
}

export default memo(Memo);
