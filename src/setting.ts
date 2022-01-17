import { App, DropdownComponent, PluginSettingTab, Setting } from "obsidian";
import type MemosPlugin from "./index";

export interface MemosSettings {
  StartDate: string;
  InsertAfter: string;
  UserName: string;
  ProcessEntriesBelow: string;
  Language: string;
  SaveMemoButtonLabel: string;
  DefaultPrefix: string;
}

export const DEFAULT_SETTINGS: MemosSettings = {
  StartDate: "Sunday",
  InsertAfter: "# Journal",
  UserName: "MEMO 😉",
  ProcessEntriesBelow: "# Journal",
  Language: "en",
  SaveMemoButtonLabel: "NOTEIT",
  DefaultPrefix: "List"
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
      .setName("Insert After")
      .setDesc("INSERT_AFTER")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.InsertAfter)
          .setValue(this.plugin.settings.InsertAfter)
          .onChange(async (value) => {
            this.plugin.settings.InsertAfter = value;
            this.applySettingsUpdate();
          })
      );

    new Setting(containerEl)
      .setName("USER_NAME")
      .setDesc("USER_NAME")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.UserName)
          .setValue(this.plugin.settings.UserName)
          .onChange(async (value) => {
            this.plugin.settings.UserName = value;
            this.applySettingsUpdate();
          })
      );

    new Setting(containerEl)
      .setName("Process Memos below")
      .setDesc(
        "Only entries below this string/section in your notes will be processed. If it does not exist no notes will be processed for that file."
      )
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.ProcessEntriesBelow)
          .setValue(this.plugin.settings.ProcessEntriesBelow)
          .onChange(async (value) => {
            this.plugin.settings.ProcessEntriesBelow = value;
            this.applySettingsUpdate();
          })
      );

    new Setting(containerEl)
      .setName("Save Memo Button Label")
      .setDesc("The text shown on the save Memo button in the UI. 'NOTEIT' by default.")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.SaveMemoButtonLabel)
          .setValue(this.plugin.settings.SaveMemoButtonLabel)
          .onChange(async (value) => {
            this.plugin.settings.SaveMemoButtonLabel = value;
            this.applySettingsUpdate();
          })
      );

    new Setting(containerEl)
      .setName("UI Language")
      .setDesc("Translates the UI language. Only 'en' and 'zh' are available.")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.Language)
          .setValue(this.plugin.settings.Language)
          .onChange(async (value) => {
            this.plugin.settings.Language = value;
            this.applySettingsUpdate();
          })
      );

      let dropdown: DropdownComponent;

      new Setting(containerEl)
        .setName("Default Prefix Style")
        .setDesc("Set the default prefix style when create memo, 'List' by default.")
        .addDropdown(async (d: DropdownComponent) => {
          dropdown = d;
          dropdown.addOption("List", "List");
          dropdown.addOption("Task", "Task");
          dropdown
            .setValue(this.plugin.settings.DefaultPrefix)
            .onChange(async (value) => {
              this.plugin.settings.DefaultPrefix = value;
              this.applySettingsUpdate();
            });
        });
  }
}