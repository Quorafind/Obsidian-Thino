import { TFile, Vault } from 'obsidian';
import React from 'react';
import { IMAGE_URL_REG, MARKDOWN_URL_REG, MARKDOWN_WEB_URL_REG, WIKI_IMAGE_URL_REG } from '../helpers/consts';
import appStore from '../stores/appStore';
import Only from './common/OnlyWhen';
import Image from './Image';

interface Props {
  memo: string;
}

interface LinkMatch {
  linkText: string;
  altText: string;
  path: string;
  filepath?: string;
}

const MemoImage: React.FC<Props> = (props: Props) => {
  const { memo } = props;

  const getPathOfImage = (vault: Vault, image: TFile) => {
    return vault.getResourcePath(image);
  };

  const detectWikiInternalLink = (lineText: string): LinkMatch | null => {
    const { metadataCache, vault } = appStore.getState().dailyNotesState.app;
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
    const { metadataCache, vault } = appStore.getState().dailyNotesState.app;
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

  let externalImageUrls = [] as string[];
  const internalImageUrls = [];
  let allMarkdownLink: string | any[] = [];
  let allInternalLink = [] as any[];
  if (IMAGE_URL_REG.test(memo)) {
    let allExternalImageUrls = [] as string[];
    const anotherExternalImageUrls = [] as string[];
    if (MARKDOWN_URL_REG.test(memo)) {
      allMarkdownLink = Array.from(memo.match(MARKDOWN_URL_REG));
    }
    if (WIKI_IMAGE_URL_REG.test(memo)) {
      allInternalLink = Array.from(memo.match(WIKI_IMAGE_URL_REG));
    }
    // const allInternalLink = Array.from(memo.content.match(WIKI_IMAGE_URL_REG));
    if (MARKDOWN_WEB_URL_REG.test(memo)) {
      allExternalImageUrls = Array.from(memo.match(MARKDOWN_WEB_URL_REG));
    }
    if (allInternalLink.length) {
      for (let i = 0; i < allInternalLink.length; i++) {
        const allInternalLinkElement = allInternalLink[i];
        internalImageUrls.push(detectWikiInternalLink(allInternalLinkElement));
      }
    }
    if (allMarkdownLink.length) {
      for (let i = 0; i < allMarkdownLink.length; i++) {
        const allMarkdownLinkElement = allMarkdownLink[i];
        if (/(.*)http[s]?(.*)/.test(allMarkdownLinkElement)) {
          anotherExternalImageUrls.push(MARKDOWN_URL_REG.exec(allMarkdownLinkElement)?.[5]);
        } else {
          internalImageUrls.push(detectMDInternalLink(allMarkdownLinkElement));
        }
      }
    }
    externalImageUrls = allExternalImageUrls.concat(anotherExternalImageUrls);
    // externalImageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);
  }

  return (
    <>
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
    </>
  );
};

export default MemoImage;
