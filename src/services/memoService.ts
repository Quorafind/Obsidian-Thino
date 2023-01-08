import api from '../helpers/api';
import { FIRST_TAG_REG, NOP_FIRST_TAG_REG, TAG_REG } from '../helpers/consts';
import utils from '../helpers/utils';
import appStore from '../stores/appStore';
import { waitForInsert } from '../obUtils/Memos/obCreateMemo';
import { changeMemo } from '../obUtils/Memos/obUpdateMemo';
import { commentMemo } from '../obUtils/Memos/obCommentMemo';
// import { TFile } from 'obsidian';

// import userService from "./userService";

class MemoService {
    public initialized = false;

    public getState() {
        return appStore.getState().memoState;
    }

    public async fetchAllMemos() {
        // if (!userService.getState().user) {
        //   return false;
        // }

        // const { data } = await api.getMyMemos();
        const data = await api.getMyMemos();
        const memos = [] as any[];
        const commentMemos = [] as any[];
        for (const m of data.memos) {
            memos.push(m);
        }
        for (const m of data.commentMemos) {
            commentMemos.push(m);
        }
        appStore.dispatch({
            type: 'SET_MEMOS',
            payload: {
                memos,
            },
        });
        appStore.dispatch({
            type: 'SET_COMMENT_MEMOS',
            payload: {
                commentMemos,
            },
        });

        if (!this.initialized) {
            this.initialized = true;
        }

        return memos;
    }

    // TODO
    // public async fetchAllCommentsMemos() {
    //   const data = await api.getMyCommentMemos();
    //   const commentMemos = [] as any[];
    //   for (const m of data.commentMemos) {
    //     commentMemos.push(m);
    //   }
    //   appStore.dispatch({
    //     type: 'SET_COMMENT_MEMOS',
    //     payload: {
    //       commentMemos,
    //     },
    //   });
    // }

    // TODO
    // public async fetchFileMemos(file: TFile) {
    //   const data = await api.getFileMemos(file);
    //   const memos = [] as any[];
    //   for (const m of data.memos) {
    //     memos.push(m);
    //   }
    // }

    public async fetchDeletedMemos() {
        // if (!userService.getState().user) {
        //   return false;
        // }

        const data = await api.getMyDeletedMemos();
        data.sort((a: { deletedAt: string | number | Date }, b: { deletedAt: string | number | Date }) => utils.getTimeStampByDate(b.deletedAt) - utils.getTimeStampByDate(a.deletedAt));
        return data;
    }

    // TODO
    // public async deletePageMemo(file: TFile) {
    //   appStore.dispatch({
    //     type: 'DELETED_MEMO_BY_FILE',
    //     payload: {
    //       file,
    //     },
    //   });
    // }

    public pushMemo(memo: Model.Memo) {
        appStore.dispatch({
            type: 'INSERT_MEMO',
            payload: {
                memo: {
                    ...memo,
                },
            },
        });
    }

    public pushCommentMemo(memo: Model.Memo) {
        appStore.dispatch({
            type: 'INSERT_COMMENT_MEMO',
            payload: {
                memo: {
                    ...memo,
                },
            },
        });
    }

    public getMemoById(id: string) {
        for (const m of this.getState().memos) {
            if (m.id === id) {
                return m;
            }
        }

        return null;
    }

    public getCommentMemoById(id: string) {
        for (const m of this.getState().commentMemos) {
            if (m.id === id) {
                return m;
            }
        }

        return null;
    }

    public async hideMemoById(id: string) {
        await api.hideMemo(id);
        appStore.dispatch({
            type: 'DELETE_MEMO_BY_ID',
            payload: {
                id: id,
            },
        });
    }

    public async restoreMemoById(id: string) {
        await api.restoreMemo(id);
        // memoService.clearMemos();
        // memoService.fetchAllMemos();
    }

    public async deleteMemoById(id: string) {
        await api.deleteMemo(id);
    }

    public editMemo(memo: Model.Memo) {
        appStore.dispatch({
            type: 'EDIT_MEMO',
            payload: memo,
        });
    }

    public editCommentMemo(memo: Model.Memo) {
        appStore.dispatch({
            type: 'EDIT_COMMENT_MEMO',
            payload: memo,
        });
    }

    public updateTagsState() {
        const { memos } = this.getState();
        const tagsSet = new Set<string>();
        const tempTags = new Set<string>();
        const tags = [] as string[];
        for (const m of memos) {
            for (const t of Array.from(m.content.match(TAG_REG) ?? [])) {
                tagsSet.add(t.replace(TAG_REG, '$1').trim());
                tempTags.add(t.replace(TAG_REG, '$1').trim());
            }
            for (const t of Array.from(m.content.match(NOP_FIRST_TAG_REG) ?? [])) {
                tagsSet.add(t.replace(NOP_FIRST_TAG_REG, '$1').trim());
                tempTags.add(t.replace(NOP_FIRST_TAG_REG, '$1').trim());
            }
            for (const t of Array.from(m.content.match(FIRST_TAG_REG) ?? [])) {
                tagsSet.add(t.replace(FIRST_TAG_REG, '$2').trim());
                tempTags.add(t.replace(FIRST_TAG_REG, '$2').trim());
            }
            Array.from(tempTags).forEach((t) => {
                tags.push(t);
            });
            tempTags.clear();
        }

        const counts = {} as { [key: string]: number };
        tags.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });

        appStore.dispatch({
            type: 'SET_TAGS',
            payload: {
                tags: Array.from(tagsSet),
                tagsNum: counts,
            },
        });
    }

    public clearMemos() {
        appStore.dispatch({
            type: 'SET_MEMOS',
            payload: {
                memos: [],
            },
        });
    }

    public async getLinkedMemos(memoId: string): Promise<Model.Memo[]> {
        const { memos } = this.getState();
        return memos.filter((m) => m.content.includes(memoId));
    }

    public async getCommentMemos(memoId: string): Promise<Model.Memo[]> {
        const { memos } = this.getState();
        return memos.filter((m) => m.content.includes('comment: ' + memoId));
    }

    public async createMemo(text: string, isTASK: boolean): Promise<Model.Memo> {
        const memo = await waitForInsert(text, isTASK);
        return memo;
    }

    public async createCommentMemo(text: string, isList: boolean, path: string, ID: string, hasID: string): Promise<Model.Memo> {
        const memo = await commentMemo(text, isList, path, ID, hasID);
        return memo;
    }

    public async importMemos(text: string, isList: boolean, date: any): Promise<Model.Memo> {
        const memo = await waitForInsert(text, isList, date);
        return memo;
    }

    public async updateMemo(memoId: string, originalText: string, text: string, type?: string, path?: string): Promise<Model.Memo> {
        const memo = await changeMemo(memoId, originalText, text, type, path);
        return memo;
    }
}

const memoService = new MemoService();

export default memoService;
