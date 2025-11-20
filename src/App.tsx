import React, { useContext } from 'react';
// import Home from './pages/Home';
import './less/app.less';
import Provider from './labs/Provider';
import appContext from './stores/appContext';
import appStore from './stores/appStore';
import './helpers/polyfill';
import './less/global.less';
import { appHasDailyNotesPluginLoaded } from 'obsidian-daily-notes-interface';
import { Notice } from 'obsidian';
import { appRouterSwitch } from './routers';
import { t } from './translations/helper';

function StrictApp() {
  return (
    <Provider store={appStore} context={appContext}>
      <App />
    </Provider>
  );
}

function App() {
  const {
    locationState: { pathname },
  } = useContext(appContext);

  // console.log(window.app.plugins?.getPlugin('periodic-notes'));
  // console.log(window.app.plugins?.getPlugin('periodic-notes'));
  if (!appHasDailyNotesPluginLoaded() && !window.app.plugins.getPlugin('periodic-notes')) {
    new Notice(t('Check if you opened Daily Notes Plugin Or Periodic Notes Plugin'));
  }

  // useEffect(() => {
  //   const handleWindowResize = () => {
  //     globalStateService.setIsMobileView(document.body.clientWidth <= 875);
  //   };
  //
  //   handleWindowResize();
  //
  //   window.addEventListener('resize', handleWindowResize);
  //
  //   return () => {
  //     window.removeEventListener('resize', handleWindowResize);
  //   };
  // }, []);

  return (
    // <>
    <>{appRouterSwitch(pathname)}</>
    // </>
  );
}

export default StrictApp;
