import React, { useContext, useEffect } from 'react';
// import Home from './pages/Home';
import './less/app.less';
import Provider from './labs/Provider';
import appContext from './stores/appContext';
import appStore from './stores/appStore';
import './helpers/polyfill';
import './less/global.less';
import { appRouterSwitch } from './routers';
import { App, TFile } from 'obsidian';
import MemosPlugin from './memosIndex';
import { dailyNotesService } from './services';

interface Props {
    plugin: MemosPlugin;
    app: App;
    data: TFile[];
}

function StrictApp(Props: Props) {
    const {
        locationState: { pathname },
    } = useContext(appContext);

    useEffect(() => {
        return () => {
            dailyNotesService.setPlugin(Props.plugin);
            dailyNotesService.setData(Props.data);
        };
    }, [Props.plugin, Props.data]);

    return (
        <Provider store={appStore} context={appContext}>
            <div>{appRouterSwitch(pathname)}</div>
        </Provider>
    );
}

export default StrictApp;
