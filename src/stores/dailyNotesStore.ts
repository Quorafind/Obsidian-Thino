import { TFile } from 'obsidian';
import MemosPlugin from '../memosIndex';

export interface State {
    data: TFile[];
    plugin: MemosPlugin;
    dateFormat: string;
}

interface SetDataAction {
    type: 'SET_DATA';
    payload: {
        data: TFile[];
    };
}

interface SetPluginAction {
    type: 'SET_PLUGIN';
    payload: {
        plugin: MemosPlugin;
    };
}

interface SetDateFormatAction {
    type: 'SET_DATE_FORMAT';
    payload: {
        dateFormat: string;
    };
}

export type Actions = SetDataAction | SetPluginAction | SetDateFormatAction;

export function reducer(state: State, action: Actions): State {
    switch (action.type) {
        case 'SET_DATA': {
            return {
                ...state,
                data: action.payload.data,
            };
        }
        case 'SET_PLUGIN': {
            return {
                ...state,
                plugin: action.payload.plugin,
            };
        }
        case 'SET_DATE_FORMAT': {
            return {
                ...state,
                dateFormat: action.payload.dateFormat,
            };
        }
        default: {
            return state;
        }
    }
}

export const defaultState: State = {
    data: null,
    plugin: null,
    dateFormat: null,
};
