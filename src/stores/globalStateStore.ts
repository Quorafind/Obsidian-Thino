export interface AppSetting {
    shouldSplitMemoWord: boolean;
    shouldHideImageUrl: boolean;
    shouldUseMarkdownParser: boolean;
    useTinyUndoHistoryCache: boolean;
}

export interface State extends AppSetting {
    markMemoId: string;
    editMemoId: string;
    commentMemoId: string;
    isMobileView: boolean;
    showSidebarInMobileView: boolean;
    changedByMemos: boolean;
}

interface SetMarkMemoIdAction {
    type: 'SET_MARK_MEMO_ID';
    payload: {
        markMemoId: string;
    };
}

interface SetEditMemoIdAction {
    type: 'SET_EDIT_MEMO_ID';
    payload: {
        editMemoId: string;
    };
}

interface SetCommentMemoIdAction {
    type: 'SET_COMMENT_MEMO_ID';
    payload: {
        commentMemoId: string;
    };
}

interface SetMobileViewAction {
    type: 'SET_MOBILE_VIEW';
    payload: {
        isMobileView: boolean;
    };
}

interface SetChangedByMemosAction {
    type: 'SET_CHANGED_BY_MEMOS';
    payload: {
        changedByMemos: boolean;
    };
}

interface SetShowSidebarAction {
    type: 'SET_SHOW_SIDEBAR_IN_MOBILE_VIEW';
    payload: {
        showSidebarInMobileView: boolean;
    };
}

interface SetAppSettingAction {
    type: 'SET_APP_SETTING';
    payload: Partial<AppSetting>;
}

export type Actions =
    | SetMobileViewAction
    | SetShowSidebarAction
    | SetEditMemoIdAction
    | SetCommentMemoIdAction
    | SetMarkMemoIdAction
    | SetChangedByMemosAction
    | SetAppSettingAction;

export function reducer(state: State, action: Actions) {
    switch (action.type) {
        case 'SET_MARK_MEMO_ID': {
            if (action.payload.markMemoId === state.markMemoId) {
                return state;
            }

            return {
                ...state,
                markMemoId: action.payload.markMemoId,
            };
        }
        case 'SET_EDIT_MEMO_ID': {
            if (action.payload.editMemoId === state.editMemoId) {
                return state;
            }

            return {
                ...state,
                editMemoId: action.payload.editMemoId,
            };
        }
        case 'SET_COMMENT_MEMO_ID': {
            if (action.payload.commentMemoId === state.commentMemoId) {
                return state;
            }

            return {
                ...state,
                commentMemoId: action.payload.commentMemoId,
            };
        }
        case 'SET_MOBILE_VIEW': {
            if (action.payload.isMobileView === state.isMobileView) {
                return state;
            }

            return {
                ...state,
                isMobileView: action.payload.isMobileView,
            };
        }
        case 'SET_CHANGED_BY_MEMOS': {
            if (action.payload.changedByMemos === state.changedByMemos) {
                return state;
            }

            return {
                ...state,
                changedByMemos: action.payload.changedByMemos,
            };
        }
        case 'SET_SHOW_SIDEBAR_IN_MOBILE_VIEW': {
            if (action.payload.showSidebarInMobileView === state.showSidebarInMobileView) {
                return state;
            }

            return {
                ...state,
                showSidebarInMobileView: action.payload.showSidebarInMobileView,
            };
        }
        case 'SET_APP_SETTING': {
            return {
                ...state,
                ...action.payload,
            };
        }
        default: {
            return state;
        }
    }
}

export const defaultState: State = {
    markMemoId: '',
    editMemoId: '',
    commentMemoId: '',
    shouldSplitMemoWord: true,
    shouldHideImageUrl: true,
    shouldUseMarkdownParser: true,
    useTinyUndoHistoryCache: false,
    isMobileView: false,
    showSidebarInMobileView: false,
    changedByMemos: false,
};
