import { moment, TFile } from 'obsidian';
import appStore from '../stores/appStore';
import MemosPlugin from '../memosIndex';

class DailyNotesService {
    public getState() {
        return appStore.getState().dailyNotesState;
    }

    public setPlugin(plugin: MemosPlugin) {
        appStore.dispatch({
            type: 'SET_PLUGIN',
            payload: {
                plugin,
            },
        });
    }

    public async setData(data: TFile[]) {
        appStore.dispatch({
            type: 'SET_DATA',
            payload: {
                data,
            },
        });
        return data;
    }

    public setDateFormat(dateFormat: string) {
        appStore.dispatch({
            type: 'SET_DATE_FORMAT',
            payload: {
                dateFormat,
            },
        });
    }

    getDateFormat(): string {
        return this.getState().dateFormat;
    }

    public getFileByMemo(date: any): TFile {
        const { data } = this.getState();

        return data.find((file) => {
            return moment(file.basename, this.getDateFormat()).clone().startOf('day').format() === date.clone().startOf('day').format();
        });
    }

    public getPlugin(): MemosPlugin {
        return this.getState().plugin;
    }

    public getData(): TFile[] {
        return this.getState().data;
    }
}

const dailyNotesService = new DailyNotesService();

export default dailyNotesService;
