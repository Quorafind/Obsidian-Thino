import { storage } from '../helpers/storage';
import appStore from '../stores/appStore';
import { AppSetting } from '../stores/globalStateStore';

class GlobalStateService {
  constructor() {
    const cachedSetting = storage.get([
      'shouldSplitMemoWord',
      'shouldHideImageUrl',
      'shouldUseMarkdownParser',
      'useTinyUndoHistoryCache',
    ]);
    const defaultAppSetting = {
      shouldSplitMemoWord: cachedSetting.shouldSplitMemoWord ?? true,
      shouldHideImageUrl: cachedSetting.shouldHideImageUrl ?? true,
      shouldUseMarkdownParser: cachedSetting.shouldUseMarkdownParser ?? true,
      useTinyUndoHistoryCache: cachedSetting.useTinyUndoHistoryCache ?? false,
    };

    this.setAppSetting(defaultAppSetting);
  }

  public getState = () => {
    return appStore.getState().globalState;
  };

  public setEditMemoId = (editMemoId: string) => {
    appStore.dispatch({
      type: 'SET_EDIT_MEMO_ID',
      payload: {
        editMemoId,
      },
    });
  };

  public setCommentMemoId = (commentMemoId: string) => {
    appStore.dispatch({
      type: 'SET_COMMENT_MEMO_ID',
      payload: {
        commentMemoId,
      },
    });
  };

  public setMarkMemoId = (markMemoId: string) => {
    appStore.dispatch({
      type: 'SET_MARK_MEMO_ID',
      payload: {
        markMemoId,
      },
    });
  };

  public setIsMobileView = (isMobileView: boolean) => {
    appStore.dispatch({
      type: 'SET_MOBILE_VIEW',
      payload: {
        isMobileView,
      },
    });
  };

  public setChangedByMemos = (changedByMemos: boolean) => {
    appStore.dispatch({
      type: 'SET_CHANGED_BY_MEMOS',
      payload: {
        changedByMemos,
      },
    });
  };

  public setShowSiderbarInMobileView = (showSiderbarInMobileView: boolean) => {
    appStore.dispatch({
      type: 'SET_SHOW_SIDEBAR_IN_MOBILE_VIEW',
      payload: {
        showSiderbarInMobileView,
      },
    });
  };

  public setAppSetting = (appSetting: Partial<AppSetting>) => {
    appStore.dispatch({
      type: 'SET_APP_SETTING',
      payload: appSetting,
    });
    storage.set(appSetting);
  };
}

const globalStateService = new GlobalStateService();

export default globalStateService;
