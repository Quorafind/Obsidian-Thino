import utils from '../helpers/utils';
import useToggle from '../hooks/useToggle';
import { memoService } from '../services';
import { formatMemoContent } from './Memo';
import '../less/memo.less';
import React from 'react';
import { Notice } from 'obsidian';
import More from '../icons/more.svg?component';
import { t } from '../translations/helper';
import MemoImage from './MemoImage';

interface Props {
  memo: Model.Memo;
  handleDeletedMemoAction: (memoId: string) => void;
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
      new Notice(t('RESTORE SUCCEED'));
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
    <div className={`memo-wrapper ${'memos-' + memo.id}`} onMouseLeave={handleMouseLeaveMemoWrapper}>
      <div className="memo-top-wrapper">
        <span className="time-text">
          {t('DELETE AT')} {memo.deletedAtStr}
        </span>
        <div className="btns-container">
          <span className="btn more-action-btn">
            {/*<img className="icon-img" src={more} />*/}
            <More className="icon-img" />
          </span>
          <div className="more-action-btns-wrapper">
            <div className="more-action-btns-container">
              <span className="btn restore-btn" onClick={handleRestoreMemoClick}>
                {t('RESTORE')}
              </span>
              <span
                className={`btn delete-btn ${showConfirmDeleteBtn ? 'final-confirm' : ''}`}
                onClick={handleDeleteMemoClick}
              >
                {showConfirmDeleteBtn ? t('CONFIRM！') : t('DELETE')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: formatMemoContent(memo.content) }}></div>
      <MemoImage memo={memo.content} />
      {/* <Only when={externalImageUrls.length > 0}>
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
      </Only> */}
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
