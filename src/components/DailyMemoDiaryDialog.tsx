import { useContext, useEffect, useRef, useState } from "react";
import { memoService } from "../services";
import toImage from "../labs/html2image";
import useToggle from "../hooks/useToggle";
import useLoading from "../hooks/useLoading";
import { DAILY_TIMESTAMP } from "../helpers/consts";
import utils from "../helpers/utils";
import { showDialog } from "./Dialog";
import showPreviewImageDialog from "./PreviewImageDialog";
import DailyMemo from "./DailyMemo";
import DatePicker from "./common/DatePicker";
import "../less/daily-memo-diary-dialog.less";
import React from "react";
import MemosPlugin from '../index';
import { App } from "obsidian";
import close from '../icons/close.svg';
import arrowLeft from '../icons/arrow-left.svg';
import arrowRight from '../icons/arrow-right.svg';
import share from '../icons/share.svg';
import i18next from "i18next";

interface Props extends DialogProps {
  currentDateStamp: DateStamp;
}

const DailyMemoDiaryDialog: React.FC<Props> = (props: Props) => {

  const loadingState = useLoading();
  const [memos, setMemos] = useState<Model.Memo[]>([]);
  const [currentDateStamp, setCurrentDateStamp] = useState(utils.getDateStampByDate(utils.getDateString(props.currentDateStamp)));
  const [showDatePicker, toggleShowDatePicker] = useToggle(false);
  const memosElRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date(currentDateStamp);

  useEffect(() => {
    const setDailyMemos = () => {
      const dailyMemos = memoService
        .getState()
        .memos.filter(
          (a) =>
            utils.getTimeStampByDate(a.createdAt) >= currentDateStamp &&
            utils.getTimeStampByDate(a.createdAt) < currentDateStamp + DAILY_TIMESTAMP
        )
        .sort((a, b) => utils.getTimeStampByDate(a.createdAt) - utils.getTimeStampByDate(b.createdAt));
      setMemos(dailyMemos);
      loadingState.setFinish();
    };

    setDailyMemos();
  }, [currentDateStamp]);

  const handleShareBtnClick = () => {
    toggleShowDatePicker(false);

    setTimeout(() => {
      if (!memosElRef.current) {
        return;
      }

      toImage(memosElRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: window.devicePixelRatio * 2,
      })
        .then((url) => {
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
          <p className="title-text">Daily Memos</p>
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
            <div className="month-text">{i18next.t('months', { returnObjects: true })[currentDate.getMonth()]}</div>
            <div className="date-text">{currentDate.getDate()}</div>
            <div className="day-text">{i18next.t('weekDays', { returnObjects: true })[currentDate.getDay()]}</div>
          </div>
        </div>
        <DatePicker
          className={`date-picker ${showDatePicker ? "" : "hidden"}`}
          datestamp={currentDateStamp}
          handleDateStampChange={handleDataPickerChange}
        />
        {loadingState.isLoading ? (
          <div className="tip-container">
            <p className="tip-text">努力加载中...</p>
          </div>
        ) : memos.length === 0 ? (
          <div className="tip-container">
            <p className="tip-text">Noooop!</p>
          </div>
        ) : (
          <div className="dailymemos-wrapper">
            {memos.map((memo) => (
              <DailyMemo key={`${memo.id}-${memo.updatedAt}`} memo={memo}/>
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
      className: "daily-memo-diary-dialog",
    },
    DailyMemoDiaryDialog,
    { currentDateStamp: datestamp }
  );
}
