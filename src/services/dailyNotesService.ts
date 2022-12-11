// import { moment } from 'obsidian';
// import userService from "./userService";
// import api from "../helpers/api";
import appStore from '../stores/appStore';
import { App, TFile } from 'obsidian';
import { Moment } from 'moment';
import utils from '../helpers/utils';

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
    const dailyNotes = utils.getAllDailyNotes();

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

  public async getDailyNoteByMemo(date: Moment): Promise<TFile> {
    const dailyNote = await utils.getDailyNote(date);
    return dailyNote;
  }
}

const dailyNotesService = new DailyNotesService();

export default dailyNotesService;
