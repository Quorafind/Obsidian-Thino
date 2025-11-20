import React, { useCallback, useEffect, useRef } from 'react';
import { locationService, resourceService } from '../services';
import showAboutSiteDialog from './AboutSiteDialog';
import '../less/menu-btns-popup.less';
import dailyNotesService from '../services/dailyNotesService';
import { t } from '../translations/helper';
import { Notice } from 'obsidian';

interface Props {
  shownStatus: boolean;
  setShownStatus: (status: boolean) => void;
}

const MenuBtnsPopup: React.FC<Props> = (props: Props) => {
  const { shownStatus, setShownStatus } = props;
  const { app } = dailyNotesService.getState();

  const popupElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shownStatus) {
      const handleClickOutside = (event: MouseEvent) => {
        if (!popupElRef.current?.contains(event.target as Node)) {
          event.stopPropagation();
        }
        setShownStatus(false);
      };
      window.addEventListener('click', handleClickOutside, {
        capture: true,
        once: true,
      });
    }
  }, [shownStatus]);

  const handleUploadFile = useCallback(async (file: File) => {
    const { type } = file;

    if (!type.startsWith('text')) {
      return;
    }

    try {
      const image = await resourceService.parseHtml(file);
      return `${image}`;
    } catch (error: any) {
      new Notice(error);
    }
  }, []);

  const handleImportBtnClick = useCallback(() => {
    const inputEl = document.createElement('input');
    document.body.appendChild(inputEl);
    inputEl.type = 'file';
    inputEl.multiple = false;
    inputEl.accept = 'text/html';
    inputEl.onchange = async () => {
      if (!inputEl.files || inputEl.files.length === 0) {
        return;
      }

      const file = inputEl.files[0];
      const url = await handleUploadFile(file);
      document.body.removeChild(inputEl);
    };
    inputEl.click();
  }, []);

  const handleMyAccountBtnClick = () => {
    //@ts-expect-error, private method
    app.setting.open();
    //@ts-expect-error, private method
    app.setting.openTabById('obsidian-memos');
  };

  const handleMemosTrashBtnClick = () => {
    locationService.pushHistory('/recycle');
  };

  const handleAboutBtnClick = () => {
    showAboutSiteDialog();
  };

  const handleHomeBoardBtnClick = async () => {
    locationService.pushHistory('/homeboard');
  };

  return (
    <div className={`menu-btns-popup ${shownStatus ? '' : 'hidden'}`} ref={popupElRef}>
      <button className="btn action-btn" onClick={handleMyAccountBtnClick}>
        <span className="icon">👤</span> {t('Settings')}
      </button>
      <button className="btn action-btn" onClick={handleMemosTrashBtnClick}>
        <span className="icon">🗑️</span> {t('Recycle bin')}
      </button>
      <button className="btn action-btn" onClick={handleImportBtnClick}>
        <span className="icon">📂</span> {t('Import')}
      </button>
      <button className="btn action-btn" onClick={handleAboutBtnClick}>
        <span className="icon">🤠</span> {t('About Me')}
      </button>
      {/*<button className="btn action-btn" onClick={handleHomeBoardBtnClick}>*/}
      {/*  <span className="icon">👋</span> Memos Board(Beta)*/}
      {/*</button>*/}
    </div>
  );
};

export default MenuBtnsPopup;
