import React, { useContext } from 'react';
// import Home from './pages/Home';
import './less/app.less';
import Provider from './labs/Provider';
import appContext from './stores/appContext';
import appStore from './stores/appStore';
import './helpers/polyfill';
import './less/global.less';
import { appRouterSwitch } from './routers';
import { App } from 'obsidian';
import MemosPlugin from './memosIndex';

interface Props {
  plugin: MemosPlugin;
  app: App;
}

function StrictApp(Props: Props) {
  const {
    locationState: { pathname },
  } = useContext(appContext);

  return (
    <Provider store={appStore} context={appContext}>
      <div>{appRouterSwitch(pathname)}</div>
    </Provider>
  );
}

export default StrictApp;
