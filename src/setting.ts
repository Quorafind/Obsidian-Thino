import { App , PluginSettingTab, Setting, } from "obsidian";
import type MemosPlugin from "./index";

export interface MemosSettings {
    StartDate: string;
    InsertAfter: string;
    UserName: string;
  }
  
export const DEFAULT_SETTINGS: MemosSettings = {
    StartDate: "Sunday",
    InsertAfter: "# Journal",
    UserName: "MEMO 😉",
};

export class MemosSettingTab extends PluginSettingTab {

    plugin: MemosPlugin;
    //eslint-disable-next-line
    private applyDebounceTimer: number = 0;

    constructor(app: App, plugin: MemosPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    applySettingsUpdate() {
        clearTimeout(this.applyDebounceTimer);
        const plugin = this.plugin;
        this.applyDebounceTimer = window.setTimeout(() => {
          plugin.saveSettings();
        }, 100);
    }

    //eslint-disable-next-line
    async hide() {}

    async display() {
        await this.plugin.loadSettings();

        const { containerEl } = this;
        this.containerEl.empty();

        new Setting(containerEl)
        .setName("INSERT_AFTER")
        .setDesc("INSERT_AFTER")
        .addText((text) =>
          text
            .setPlaceholder("# JOURNAL")
            .setValue(this.plugin.settings.InsertAfter)
            .onChange(async (value) => {
              this.plugin.settings.InsertAfter = value;
              this.applySettingsUpdate();
            }),
        );

        new Setting(containerEl)
        .setName("USER_NAME")
        .setDesc("USER_NAME")
        .addText((text) =>
          text
            .setPlaceholder("MEMO 😉")
            .setValue(this.plugin.settings.UserName)
            .onChange(async (value) => {
              this.plugin.settings.UserName = value;
              this.applySettingsUpdate();
            }),
        );
    }

}