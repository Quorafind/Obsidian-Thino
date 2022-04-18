// import { getFile } from "../obComponents/obUpdateMemo";
import { TFile } from 'obsidian';
import appStore from '../stores/appStore';

/**
 * 实现一个简易版的 markdown 解析
 * - 列表解析；
 * - 代码块；
 * - 加粗/斜体；
 * - TODO;
 */
const CODE_BLOCK_REG = /```([\s\S]*?)```/g;
const BOLD_TEXT_REG = /\*\*(.+?)\*\*/g;
const EM_TEXT_REG = /\*(.+?)\*/g;
const TODO_BLOCK_REG = /\[ \] /g;
const DONE_BLOCK_REG = /\[.{1}\] /g;
const DOT_LI_REG = /^[*-]/g;
const NUM_LI_REG = /(\d+)\. /g;
// const BR_REG = /\<br\>/g;

const INTERNAL_MD_REG = /\[\[([^\]]+)\]\]/g;
const EXRERNAL_MD_REG = /\[([^\]]+)\]\((([^\]]+).md)\)/g;

const parseMarkedToHtml = (markedStr: string, memoid?: string): string => {
  const htmlText = markedStr
    .replace(CODE_BLOCK_REG, "<pre lang=''>$1</pre>")
    .replace(DOT_LI_REG, "<span class='counter-block'>•</span>")
    .replace(NUM_LI_REG, "<span class='counter-block'>$1.</span>")
    .replace(TODO_BLOCK_REG, "<span class='todo-block' data-type='todo'>⬜</span>")
    .replace(DONE_BLOCK_REG, "<span class='todo-block' data-type='done'>✅</span>")
    .replace(BOLD_TEXT_REG, '<strong>$1</strong>')
    .replace(EM_TEXT_REG, '<em>$1</em>')
    .replace(/&lt;br&gt;/g, '</p><p>')
    .replace(/&amp;/g, '&');

  let newHtmlText = htmlText;

  if (memoid) {
    if (INTERNAL_MD_REG.test(htmlText)) {
      const internalMD = htmlText.match(INTERNAL_MD_REG);
      // const path = getFile(memoid).path;
      for (let i = 0; i < internalMD.length; i++) {
        if (!/(jpeg|jpg|gif|png|svg|bmp|wepg)/g.test(internalMD[i])) {
          const internalContent = getContentFromInternalLink(internalMD[i]);
          if (/\|/g.test(internalContent)) {
            const [link, label] = internalContent.split('|');
            const replaceMent = replaceMd(link, label);
            newHtmlText = htmlText.replace(internalMD[i], replaceMent);
          } else {
            const link = internalContent;
            const label = '';
            const replaceMent = replaceMd(link, label);
            newHtmlText = newHtmlText.replace(internalMD[i], replaceMent);
          }
        }
      }
    }
    if (EXRERNAL_MD_REG.test(htmlText)) {
      const externalMD = htmlText.match(EXRERNAL_MD_REG);
      // const path = getFile(memoid).path;
      for (let i = 0; i < externalMD.length; i++) {
        if (!/(jpeg|jpg|gif|png|svg|bmp|wepg)/g.test(externalMD[i])) {
          const link = getContentFromExternalLink(externalMD[i]);
          const label = getLabelFromExternalLink(externalMD[i]);
          const replaceMent = replaceMd(link, label);
          newHtmlText = htmlText.replace(externalMD[i], replaceMent);
        }
      }
    }
  }

  // const externalMD = markedStr.match(EXRERNAL_MD_REG);

  return newHtmlText;
};

const replaceMd = (internalLink: string, label: string): string => {
  const { metadataCache } = appStore.getState().dailyNotesState.app;

  const file = metadataCache.getFirstLinkpathDest(decodeURIComponent(internalLink), '');

  // let filePath;

  if (file instanceof TFile) {
    // filePath = file.path;
    if (label) {
      // console.log(`<a data-href="${internalLink}" data-type="link" data-filepath="${internalLink}" class="internal-link">${label}</a>`);
      return `<a data-href="${internalLink}" data-type="link" data-filepath="${internalLink}" class="internal-link">${label}</a>`;
    } else {
      return `<a data-href="${internalLink}" data-type="link" data-filepath="${internalLink}" class="internal-link">${internalLink}</a>`;
    }
  } else if (label) {
    return `<a data-href="${internalLink}" data-type="link" data-filepath="${internalLink}" class="internal-link is-unresolved">${label}</a>`;
  } else {
    return `<a data-href="${internalLink}" data-type="link" data-filepath="${internalLink}" class="internal-link is-unresolved">${internalLink}</a>`;
  }
};

const getContentFromInternalLink = (line: string) => /\[\[([^\]]+)\]\]/g.exec(line)?.[1];

const getLabelFromExternalLink = (line: string) => EXRERNAL_MD_REG.exec(line)?.[1];

const getContentFromExternalLink = (line: string) => /\[([^\]]+)\]\((([^\]]+).md)\)/g.exec(line)?.[3];

const parseHtmlToRawText = (htmlStr: string): string => {
  const tempEl = document.createElement('div');
  tempEl.className = 'memo-content-text';
  tempEl.innerHTML = htmlStr;
  const text = tempEl.innerText;
  return text;
};

const parseRawTextToHtml = (rawTextStr: string): string => {
  const htmlText = rawTextStr.replace(/\n/g, '<br>');
  return htmlText;
};

const encodeHtml = (htmlStr: string): string => {
  const t = document.createElement('div');
  t.textContent = htmlStr;
  return t.innerHTML;
};

export { encodeHtml, parseMarkedToHtml, parseHtmlToRawText, parseRawTextToHtml };
