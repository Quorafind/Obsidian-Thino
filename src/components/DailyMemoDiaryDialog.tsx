import { useContext, useEffect, useRef, useState } from 'react';
import { memoService } from '../services';
import toImage from '../labs/html2image';
import useToggle from '../hooks/useToggle';
import useLoading from '../hooks/useLoading';
import { DAILY_TIMESTAMP } from '../helpers/consts';
import utils from '../helpers/utils';
import { showDialog } from './Dialog';
import showPreviewImageDialog from './PreviewImageDialog';
import DailyMemo from './DailyMemo';
import DatePicker from './common/DatePicker';
import '../less/daily-memo-diary-dialog.less';
import React from 'react';
import close from '../icons/close.svg';
import arrowLeft from '../icons/arrow-left.svg';
import arrowRight from '../icons/arrow-right.svg';
import share from '../icons/share.svg';
import { AutoSaveWhenOnMobile } from '../memos';
import { Platform, TFile, moment } from 'obsidian';
import { getAllDailyNotes } from 'obsidian-daily-notes-interface';
import appStore from '../stores/appStore';
import { t } from '../translations/helper';

interface Props extends DialogProps {
  currentDateStamp: DateStamp;
}

const DailyMemoDiaryDialog: React.FC<Props> = (props: Props) => {
  const loadingState = useLoading();
  const [memos, setMemos] = useState<Model.Memo[]>([]);
  const [currentDateStamp, setCurrentDateStamp] = useState(
    utils.getDateStampByDate(utils.getDateString(props.currentDateStamp)),
  );
  const [showDatePicker, toggleShowDatePicker] = useToggle(false);
  const memosElRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date(currentDateStamp);
  const { vault } = appStore.getState().dailyNotesState.app;

  useEffect(() => {
    const setDailyMemos = () => {
      const dailyMemos = memoService
        .getState()
        .memos.filter(
          (a) =>
            utils.getTimeStampByDate(a.createdAt) >= currentDateStamp &&
            utils.getTimeStampByDate(a.createdAt) < currentDateStamp + DAILY_TIMESTAMP,
        )
        .sort((a, b) => utils.getTimeStampByDate(a.createdAt) - utils.getTimeStampByDate(b.createdAt));
      setMemos(dailyMemos);
      loadingState.setFinish();
    };

    setDailyMemos();
  }, [currentDateStamp]);

  const convertBase64ToBlob = (base64: string, type: string) => {
    var bytes = window.atob(base64);
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: type });
  };

  const handleShareBtnClick = async () => {
    toggleShowDatePicker(false);

    setTimeout(() => {
      if (!memosElRef.current) {
        return;
      }

      toImage(memosElRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: window.devicePixelRatio * 2,
      })
        .then((url) => {
          if (AutoSaveWhenOnMobile && Platform.isMobile) {
            const myBase64 = url.split('base64,')[1];
            const blobInput = convertBase64ToBlob(myBase64, 'image/png');
            blobInput.arrayBuffer().then(async (buffer) => {
              let aFile;
              let newFile;
              const ext = 'png';
              const dailyNotes = getAllDailyNotes();
              for (const string in dailyNotes) {
                if (dailyNotes[string] instanceof TFile) {
                  aFile = dailyNotes[string];
                  break;
                }
              }
              if (aFile !== undefined) {
                newFile = await vault.createBinary(
                  //@ts-expect-error, private method
                  await vault.getAvailablePathForAttachments(
                    `Pasted Image ${moment().format('YYYYMMDDHHmmss')}`,
                    ext,
                    aFile,
                  ),
                  buffer,
                );
              }
            });
          }
          showPreviewImageDialog(url);
        })
        .catch(() => {
          // do nth
        });
    }, 0);
  };

  const handleDataPickerChange = (datestamp: DateStamp): void => {
    setCurrentDateStamp(datestamp);
    toggleShowDatePicker(false);
  };

  return (
    <>
      <div className="dialog-header-container">
        <div className="header-wrapper">
          <p className="title-text">{t('Daily Memos')}</p>
          <div className="btns-container">
            <span className="btn-text" onClick={() => setCurrentDateStamp(currentDateStamp - DAILY_TIMESTAMP)}>
              <img className="icon-img" src={arrowLeft} />
            </span>
            <span className="btn-text" onClick={() => setCurrentDateStamp(currentDateStamp + DAILY_TIMESTAMP)}>
              <img className="icon-img" src={arrowRight} />
            </span>
            <span className="btn-text share-btn" onClick={handleShareBtnClick}>
              <img className="icon-img" src={share} />
            </span>
            <span className="btn-text" onClick={() => props.destroy()}>
              <img className="icon-img" src={close} />
            </span>
          </div>
        </div>
      </div>
      <div className="dialog-content-container" ref={memosElRef}>
        <div className="date-card-container" onClick={() => toggleShowDatePicker()}>
          <div className="year-text">{currentDate.getFullYear()}</div>
          <div className="date-container">
            <div className="month-text">{t('months')[currentDate.getMonth()]}</div>
            <div className="date-text">{currentDate.getDate()}</div>
            <div className="day-text">{t('weekDays')[currentDate.getDay()]}</div>
          </div>
        </div>
        <DatePicker
          className={`date-picker ${showDatePicker ? '' : 'hidden'}`}
          datestamp={currentDateStamp}
          handleDateStampChange={handleDataPickerChange}
        />
        {loadingState.isLoading ? (
          <div className="tip-container">
            <p className="tip-text">{t('Loading...')}</p>
          </div>
        ) : memos.length === 0 ? (
          <div className="tip-container">
            <p className="tip-text">{t('Noooop!')}</p>
          </div>
        ) : (
          <div className="dailymemos-wrapper">
            {memos.map((memo) => (
              <DailyMemo key={`${memo.id}-${memo.updatedAt}`} memo={memo} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default function showDailyMemoDiaryDialog(datestamp: DateStamp = Date.now()): void {
  showDialog(
    {
      className: 'daily-memo-diary-dialog',
    },
    DailyMemoDiaryDialog,
    { currentDateStamp: datestamp },
  );
}
