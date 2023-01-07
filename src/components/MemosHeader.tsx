import React, { useCallback, useContext, useEffect, useState } from 'react';
import appContext from '../stores/appContext';
import SearchBar from './SearchBar';
import { globalStateService, memoService, queryService } from '../services';
import Only from './common/OnlyWhen';
import '../less/memos-header.less';
import MenuSvg from '../icons/menu.svg?component';

interface Props {}

const MemosHeader: React.FC<Props> = () => {
    const {
        locationState: {
            query: { filter },
        },
        globalState: { isMobileView },
        queryState: { queries },
    } = useContext(appContext);

    const [titleText, setTitleText] = useState('MEMOS');

    useEffect(() => {
        const query = queryService.getQueryById(filter);
        if (query) {
            setTitleText(query.title);
        } else {
            setTitleText('MEMOS');
        }
    }, [filter, queries]);

    const handleMemoTextClick = useCallback(() => {
        memoService.fetchAllMemos().catch(() => {
            // do nth
        });
    }, []);

    // const handleRefreshClick = useCallback(() => {
    //   memoService.fetchAllMemos().catch(() => {
    //     // do nth
    //   });
    // }, []);

    const handleShowSidebarBtnClick = useCallback(() => {
        globalStateService.setShowSidebarInMobileView(true);
    }, []);

    return (
        <div className="section-header-container memos-header-container">
            <div className="title-text" onClick={handleMemoTextClick}>
                <Only when={isMobileView}>
                    <button className="action-btn" onClick={handleShowSidebarBtnClick}>
                        {/*<img className="icon-img" src={menuSvg} alt="menu" />*/}
                        <MenuSvg className="icon-img" />
                    </button>
                </Only>
                <span className="normal-text">{titleText}</span>
                {/*<span className="refresh-icon" onClick={handleRefreshClick}>*/}
                {/*  🔄*/}
                {/*</span>*/}
            </div>
            <SearchBar />
        </div>
    );
};

export default MemosHeader;
