import utils from '../helpers/utils';
import { memoService } from '../services';
import { formatMemoContent } from './Memo';
import '../less/memo.less';
import React from 'react';
import { Notice } from 'obsidian';
import More from '../icons/more.svg?component';
import ArchiveSvg from '../icons/archive.svg?component';
import { t } from '../translations/helper';
import MemoImage from './MemoImage';

interface Props {
  memo: Model.Memo;
  handleArchivedMemoAction: (memoId: string) => void;
}

const ArchivedMemo: React.FC<Props> = (props: Props) => {
  const { memo: propsMemo, handleArchivedMemoAction } = props;
  const memo: FormattedMemo = {
    ...propsMemo,
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
  };

  const handleUnarchiveMemoClick = async () => {
    try {
      await memoService.unarchiveMemoById(memo.id);
      handleArchivedMemoAction(memo.id);
      new Notice(t('UNARCHIVE SUCCEED'));
    } catch (error: any) {
      new Notice(error.message || t('Failed to unarchive memo'));
    }
  };

  // Remove [archived:true] from display content
  const displayContent = memo.content.replace(/\s*\[archived:true\]\s*/gi, '');

  return (
    <div className={`memo-wrapper archived-memo ${'memos-' + memo.id}`}>
      <div className="memo-top-wrapper">
        <span className="time-text">
          <ArchiveSvg className="archive-icon" />
          {t('ARCHIVED')} • {memo.createdAtStr}
        </span>
        <div className="btns-container">
          <span className="btn more-action-btn">
            <More className="icon-img" />
          </span>
          <div className="more-action-btns-wrapper">
            <div className="more-action-btns-container">
              <span className="btn unarchive-btn" onClick={handleUnarchiveMemoClick}>
                {t('UNARCHIVE')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: formatMemoContent(displayContent) }}></div>
      <MemoImage memo={displayContent} />
    </div>
  );
};

export default ArchivedMemo;
