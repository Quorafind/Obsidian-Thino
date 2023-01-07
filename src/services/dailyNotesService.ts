// import { moment } from 'obsidian';
// import userService from "./userService";
// import api from "../helpers/api";
import appStore from '../stores/appStore';
import { getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import { App, TFile } from 'obsidian';

// import { Moment}  from "obsidian";

class DailyNotesService {
    public getState() {
        return appStore.getState().dailyNotesState;
    }

    public getApp(app: App) {
        appStore.dispatch({
            type: 'SET_APP',
            payload: {
                app,
            },
        });
        return app;
    }

    public async getMyAllDailyNotes() {
        const dailyNotes = getAllDailyNotes();

        appStore.dispatch({
            type: 'SET_DAILYNOTES',
            payload: {
                dailyNotes,
            },
        });
        return dailyNotes;
    }

    // public pushDailyNote(dailyNote: TFile) {
    //   appStore.dispatch({
    //     type: "INSERT_DAILYNOTE",
    //     payload: {
    //       memo: {
    //         ...memo,
    //       },
    //     },
    //   });
    // }

    public async getDailyNoteByMemo(date: any): Promise<TFile> {
        const { dailyNotes } = this.getState();
        const dailyNote = getDailyNote(date, dailyNotes);
        return dailyNote;
    }
}

const dailyNotesService = new DailyNotesService();

export default dailyNotesService;
