import utils from '../helpers/utils';

export interface State {
  memos: Model.Memo[];
  commentMemos: Model.Memo[];
  tags: string[];
  tagsNum: object;
}

interface SetMemosAction {
  type: 'SET_MEMOS';
  payload: {
    memos: Model.Memo[];
  };
}

interface SetCommentMemosAction {
  type: 'SET_COMMENT_MEMOS';
  payload: {
    commentMemos: Model.Memo[];
  };
}

interface SetTagsAction {
  type: 'SET_TAGS';
  payload: {
    tags: string[];
    tagsNum: object;
  };
}

interface InsertMemoAction {
  type: 'INSERT_MEMO';
  payload: {
    memo: Model.Memo;
  };
}

interface InsertCommentMemoAction {
  type: 'INSERT_COMMENT_MEMO';
  payload: {
    memo: Model.Memo;
  };
}

interface DeleteMemoByIdAction {
  type: 'DELETE_MEMO_BY_ID';
  payload: {
    id: string;
  };
}

interface EditMemoByIdAction {
  type: 'EDIT_MEMO';
  payload: Model.Memo;
}

interface EditCommentMemoByIdAction {
  type: 'EDIT_COMMENT_MEMO';
  payload: Model.Memo;
}

export type Actions =
  | SetMemosAction
  | SetCommentMemosAction
  | SetTagsAction
  | InsertMemoAction
  | InsertCommentMemoAction
  | DeleteMemoByIdAction
  | EditMemoByIdAction
  | EditCommentMemoByIdAction;

export function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'SET_MEMOS': {
      const memos = utils.dedupeObjectWithId(
        action.payload.memos.sort(
          (a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt),
        ),
      );

      // const memos = action.payload.memos.sort((a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt));

      return {
        ...state,
        memos: [...memos],
      };
    }
    case 'SET_COMMENT_MEMOS': {
      const memos = utils.dedupeObjectWithId(
        action.payload.commentMemos.sort(
          (a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt),
        ),
      );

      // const memos = action.payload.memos.sort((a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt));

      return {
        ...state,
        commentMemos: [...memos],
      };
    }
    case 'SET_TAGS': {
      return {
        ...state,
        tags: action.payload.tags,
        tagsNum: action.payload.tagsNum,
      };
    }
    case 'INSERT_MEMO': {
      const memos = utils.dedupeObjectWithId(
        [action.payload.memo, ...state.memos].sort(
          (a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt),
        ),
      );

      return {
        ...state,
        memos,
      };
    }
    case 'INSERT_COMMENT_MEMO': {
      const memos = utils.dedupeObjectWithId(
        [action.payload.memo, ...state.commentMemos].sort(
          (a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt),
        ),
      );

      return {
        ...state,
        commentMemos: [...memos],
      };
    }
    case 'DELETE_MEMO_BY_ID': {
      return {
        ...state,
        memos: [...state.memos].filter((memo) => memo.id !== action.payload.id),
      };
    }
    case 'EDIT_MEMO': {
      const memos = state.memos.map((m) => {
        if (m.id === action.payload.id) {
          return {
            ...m,
            ...action.payload,
          };
        } else {
          return m;
        }
      });

      return {
        ...state,
        memos,
      };
    }
    case 'EDIT_COMMENT_MEMO': {
      const memos = state.commentMemos.map((m) => {
        if (m.id === action.payload.id) {
          return {
            ...m,
            ...action.payload,
          };
        } else {
          return m;
        }
      });

      return {
        ...state,
        commentMemos: [...memos],
      };
    }
    default: {
      return state;
    }
  }
}

export const defaultState: State = {
  memos: [],
  commentMemos: [],
  tags: [],
  tagsNum: {} as { [key: string]: number },
};
