import React, { useContext, useEffect, useMemo, useRef } from 'react';
import appContext from '../stores/appContext';
import { SHOW_SIDERBAR_MOBILE_CLASSNAME } from '../helpers/consts';
import { globalStateService } from '../services';
import UserBanner from './UserBanner';
import QueryList from './QueryList';
import TagList from './TagList';
import UsageHeatMap from './UsageHeatMap';
import '../less/siderbar.less';

interface Props {}

const Sidebar: React.FC<Props> = () => {
    const {
        locationState,
        globalState: { isMobileView, showSidebarInMobileView },
    } = useContext(appContext);
    const wrapperElRef = useRef<HTMLElement>(null);

    const handleClickOutsideOfWrapper = useMemo(() => {
        return (event: MouseEvent) => {
            const siderbarShown = globalStateService.getState().showSidebarInMobileView;

            if (!siderbarShown) {
                window.removeEventListener('click', handleClickOutsideOfWrapper, {
                    capture: true,
                });
                return;
            }

            if (!wrapperElRef.current?.contains(event.target as Node)) {
                if (wrapperElRef.current?.parentNode?.contains(event.target as Node)) {
                    if (siderbarShown) {
                        event.stopPropagation();
                    }
                    globalStateService.setShowSidebarInMobileView(false);
                    window.removeEventListener('click', handleClickOutsideOfWrapper, {
                        capture: true,
                    });
                }
            }
        };
    }, []);

    useEffect(() => {
        globalStateService.setShowSidebarInMobileView(false);
    }, [locationState]);

    useEffect(() => {
        if (showSidebarInMobileView) {
            document.body.classList.add(SHOW_SIDERBAR_MOBILE_CLASSNAME);
        } else {
            document.body.classList.remove(SHOW_SIDERBAR_MOBILE_CLASSNAME);
        }
    }, [showSidebarInMobileView]);

    useEffect(() => {
        if (isMobileView && showSidebarInMobileView) {
            window.addEventListener('click', handleClickOutsideOfWrapper, {
                capture: true,
            });
        }
    }, [isMobileView, showSidebarInMobileView]);

    return (
        <aside className="memos-sidebar-wrapper" ref={wrapperElRef}>
            <UserBanner />
            <UsageHeatMap />
            <QueryList />
            <TagList />
        </aside>
    );
};

export default Sidebar;
