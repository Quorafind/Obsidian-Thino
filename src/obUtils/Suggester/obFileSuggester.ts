// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
import { TAbstractFile, TFile } from 'obsidian';
import dailyNotesService from '../../services/dailyNotesService';

export const getSuggestions = (inputStr: string) => {
    const { app } = dailyNotesService.getState();

    const abstractFiles = app.vault.getAllLoadedFiles();
    // const files: TFile[] = [];
    const files = [] as any;

    let actualInput: string;

    abstractFiles.forEach((file: TAbstractFile) => {
        if (inputStr === '[') {
            actualInput = '';
            const lowerCaseInputStr = actualInput.toLowerCase();
            if (file instanceof TFile && (file.extension === 'md' || file.extension === 'png' || file.extension === 'jpg' || file.extension === 'jpeg' || file.extension === 'gif') && file.path.toLowerCase().contains(lowerCaseInputStr)) {
                files.push({
                    name: file.basename as string,
                    char: file.name as string,
                    file: file as TFile,
                });
            }
        } else if (inputStr.contains('[')) {
            actualInput = inputStr.slice(1);
            const lowerCaseInputStr = actualInput.toLowerCase();
            if (file instanceof TFile && (file.extension === 'md' || file.extension === 'png' || file.extension === 'jpg' || file.extension === 'jpeg' || file.extension === 'gif') && file.path.toLowerCase().contains(lowerCaseInputStr)) {
                files.push({
                    name: file.basename as string,
                    char: file.name as string,
                    file: file as TFile,
                });
            }
        }
    });

    return files;
};
