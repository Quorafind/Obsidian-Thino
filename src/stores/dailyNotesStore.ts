import { App, TFile } from "obsidian";
import { getAllDailyNotes } from "obsidian-daily-notes-interface";

export interface State {
  dailyNotes: Record<string, TFile>;
  app: App;
}

interface SetDailyNotesAction {
  type: "SET_DAILYNOTES";
  payload: {
    dailyNotes: Record<string, TFile>;
  };
}

interface SetObsidianAppAction {
  type: "SET_APP";
  payload: {
    app: App;
  };
}

// interface InsertDailyNoteAction {
//   type: "INSERT_DAILYNOTE";
//   payload: {
//     dailyNote: TFile;
//   };
// }

export type Actions = SetDailyNotesAction | SetObsidianAppAction ;

export function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case "SET_DAILYNOTES": {
      
      const dailyNotes = getAllDailyNotes();

      return {
        ...state,
        dailyNotes: dailyNotes,
      };
    }
    case "SET_APP": {
      return {
        ...state,
        app: action.payload.app,
      };
    }
    default: {
      return state;
    }
  }
}

export const defaultState: State = {
  dailyNotes: null,
  app: null,
};
