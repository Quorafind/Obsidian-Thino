import {useEffect, useRef} from 'react';
import {locationService} from '../services';
import showAboutSiteDialog from './AboutSiteDialog';
import '../less/menu-btns-popup.less';
import React from 'react';
import dailyNotesService from '../services/dailyNotesService';
import { t } from '../translations/helper';

interface Props {
  shownStatus: boolean;
  setShownStatus: (status: boolean) => void;
}

const MenuBtnsPopup: React.FC<Props> = (props: Props) => {
  const {shownStatus, setShownStatus} = props;
  const {app} = dailyNotesService.getState();

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

  const handleMyAccountBtnClick = () => {
    app.setting.open();
    app.setting.openTabById('obsidian-memos');
  };

  const handleMemosTrashBtnClick = () => {
    locationService.pushHistory('/recycle');
  };

  const handleAboutBtnClick = () => {
    showAboutSiteDialog();
  };

  // const handleSignOutBtnClick = async () => {
  //   await userService.doSignOut();
  // };

  return (
    <div className={`menu-btns-popup ${shownStatus ? '' : 'hidden'}`} ref={popupElRef}>
      <button className="btn action-btn" onClick={handleMyAccountBtnClick}>
        <span className="icon">👤</span> {t('Settings')}
      </button>
      <button className="btn action-btn" onClick={handleMemosTrashBtnClick}>
        <span className="icon">🗑️</span> {t('Recycle bin')}
      </button>
      <button className="btn action-btn" onClick={handleAboutBtnClick}>
        <span className="icon">🤠</span> {t('About Me')}
      </button>
      {/* <button className="btn action-btn" onClick={handleSignOutBtnClick}>
        <span className="icon">👋</span> 退出
      </button> */}
    </div>
  );
};

export default MenuBtnsPopup;
