import React, { useCallback, useContext, useEffect, useState } from 'react';
import appContext from '../stores/appContext';
import useLoading from '../hooks/useLoading';
import { globalStateService, locationService, memoService, queryService } from '../services';
import { IMAGE_URL_REG, LINK_REG, MEMO_LINK_REG, NOP_FIRST_TAG_REG, TAG_REG } from '../helpers/consts';
import utils from '../helpers/utils';
import { checkShouldShowMemoWithFilters } from '../helpers/filter';
import Only from '../components/common/OnlyWhen';
import ArchivedMemo from '../components/ArchivedMemo';
import MemoFilter from '../components/MemoFilter';
import '../less/memo-archive.less';
import MenuSvg from '../icons/menu.svg?component';
import ArchiveSvg from '../icons/archive.svg?component';
import { Notice } from 'obsidian';
import { t } from '../translations/helper';

interface Props {}

const MemoArchive: React.FC<Props> = () => {
  const {
    locationState: { query },
    globalState: { isMobileView },
  } = useContext(appContext);
  const loadingState = useLoading();
  const [archivedMemos, setArchivedMemos] = useState<Model.Memo[]>([]);

  const { tag: tagQuery, duration, type: memoType, text: textQuery, filter: queryId } = query;
  const queryFilter = queryService.getQueryById(queryId);
  const showMemoFilter = Boolean(
    tagQuery || (duration && duration.from < duration.to) || memoType || textQuery || queryFilter,
  );

  const shownMemos =
    showMemoFilter || queryFilter
      ? archivedMemos.filter((memo) => {
          let shouldShow = true;

          if (queryFilter) {
            const filters = JSON.parse(queryFilter.querystring) as Filter[];
            if (Array.isArray(filters)) {
              shouldShow = checkShouldShowMemoWithFilters(memo, filters);
            }
          }

          if (tagQuery) {
            const tagsSet = new Set<string>();
            for (const t of Array.from(memo.content.match(TAG_REG) ?? [])) {
              const tag = t.replace(TAG_REG, '$1').trim();
              const items = tag.split('/');
              let temp = '';
              for (const i of items) {
                temp += i;
                tagsSet.add(temp);
                temp += '/';
              }
            }
            for (const t of Array.from(memo.content.match(NOP_FIRST_TAG_REG) ?? [])) {
              const tag = t.replace(NOP_FIRST_TAG_REG, '$1').trim();
              const items = tag.split('/');
              let temp = '';
              for (const i of items) {
                temp += i;
                tagsSet.add(temp);
                temp += '/';
              }
            }
            if (!tagsSet.has(tagQuery)) {
              shouldShow = false;
            }
          }
          if (
            duration &&
            duration.from < duration.to &&
            (utils.getTimeStampByDate(memo.createdAt) < duration.from ||
              utils.getTimeStampByDate(memo.createdAt) > duration.to)
          ) {
            shouldShow = false;
          }
          if (memoType) {
            if (memoType === 'NOT_TAGGED' && memo.content.match(TAG_REG) !== null) {
              shouldShow = false;
            } else if (memoType === 'LINKED' && memo.content.match(LINK_REG) === null) {
              shouldShow = false;
            } else if (memoType === 'IMAGED' && memo.content.match(IMAGE_URL_REG) === null) {
              shouldShow = false;
            } else if (memoType === 'CONNECTED' && memo.content.match(MEMO_LINK_REG) === null) {
              shouldShow = false;
            }
          }
          if (textQuery && !memo.content.includes(textQuery)) {
            shouldShow = false;
          }

          return shouldShow;
        })
      : archivedMemos;

  useEffect(() => {
    memoService.fetchAllMemos();
    memoService
      .fetchArchivedMemos()
      .then((memos) => {
        setArchivedMemos(memos);
      })
      .catch((error) => {
        new Notice(error.message || t('Failed to fetch archived memos'));
      });
  }, []);

  const handleArchivedMemoAction = useCallback(
    (memoId: string) => {
      setArchivedMemos((memos) => memos.filter((m) => m.id !== memoId));
    },
    [archivedMemos],
  );

  const handleShowSidebarBtnClick = () => {
    globalStateService.setShowSiderbarInMobileView(true);
  };

  return (
    <section className="page-wrapper memo-archive-page">
      <div className="page-container">
        <div className="page-header">
          <div className="title-container">
            <ArchiveSvg className="icon-img" />
            <span className="title-text">{t('ARCHIVED MEMOS')}</span>
          </div>
          <button className={`action-btn toggle-sidebar-btn ${isMobileView ? '' : 'hidden'}`} onClick={handleShowSidebarBtnClick}>
            <MenuSvg className="icon-img" />
          </button>
        </div>
        <MemoFilter />
        {!loadingState.isLoading && (
          <>
            {shownMemos.length === 0 ? (
              <div className="empty-state">
                <ArchiveSvg className="empty-icon" />
                <p className="empty-text">{t('No archived memos')}</p>
              </div>
            ) : (
              <div className="archived-memos-wrapper">
                {shownMemos.map((memo) => (
                  <ArchivedMemo key={`${memo.id}-${memo.updatedAt}`} memo={memo} handleArchivedMemoAction={handleArchivedMemoAction} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MemoArchive;
