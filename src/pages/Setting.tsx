import {useCallback, useContext, useEffect} from 'react';
import appContext from '../stores/appContext';
import {globalStateService, memoService} from '../services';
import PreferencesSection from '../components/PreferencesSection';
import Only from '../components/common/OnlyWhen';
import '../less/setting.less';
import React from 'react';
import menuSvg from '../icons/menu.svg';

interface Props {}

const Setting: React.FC<Props> = () => {
  const {
    globalState: {isMobileView},
  } = useContext(appContext);

  useEffect(() => {
    memoService.fetchAllMemos();
  }, []);

  const handleShowSidebarBtnClick = useCallback(() => {
    globalStateService.setShowSiderbarInMobileView(true);
  }, []);

  return (
    <div className="preference-wrapper">
      <div className="section-header-container">
        <div className="title-text">
          <Only when={isMobileView}>
            <button className="action-btn" onClick={handleShowSidebarBtnClick}>
              <img className="icon-img" src={menuSvg} alt="menu" />
            </button>
          </Only>
          <span className="normal-text">账号与设置</span>
        </div>
      </div>

      <div className="sections-wrapper">
        <PreferencesSection />
      </div>
    </div>
  );
};

export default Setting;
