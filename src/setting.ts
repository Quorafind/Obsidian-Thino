import { App, DropdownComponent, PluginSettingTab, Setting } from "obsidian";
import type MemosPlugin from "./index";
import memoService from './services/memoService';

export interface MemosSettings {
  StartDate: string;
  InsertAfter: string;
  UserName: string;
  ProcessEntriesBelow: string;
  Language: string;
  SaveMemoButtonLabel: string;
  DefaultPrefix: string;
  InsertDateFormat: string;
  DefaultEditorLocation: string;
  UseButtonToShowEditor: boolean;
  FocusOnEditor: boolean;
  OpenDailyMemosWithMemos: boolean;
  HideDoneTasks: boolean;
}

export const DEFAULT_SETTINGS: MemosSettings = {
  StartDate: "Sunday",
  InsertAfter: "# Journal",
  UserName: "MEMO 😉",
  ProcessEntriesBelow: "# Journal",
  Language: "en",
  SaveMemoButtonLabel: "NOTEIT",
  DefaultPrefix: "List",
  InsertDateFormat: "Tasks",
  DefaultEditorLocation: "Top",
  UseButtonToShowEditor: false,
  FocusOnEditor: true,
  OpenDailyMemosWithMemos: true,
  HideDoneTasks: false
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
    memoService.updateTagsState();
  }

  //eslint-disable-next-line
  async hide() {}

  async display() {
    await this.plugin.loadSettings();

    const { containerEl } = this;
    this.containerEl.empty();

    this.containerEl.createEl("h1", { text: "Basic Options" });
    // containerEl.createDiv("", (el) => {
    //   el.innerHTML = "Basic Options";
    // });

    new Setting(containerEl)
      .setName("User name in Memos")
      .setDesc("Set your user name here. 'Memos 😏' By default")
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
      .setName("Insert after heading")
      .setDesc("You should set the same heading below if you want to insert and process memos below the same heading.")
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
      .setName("Focus on editor when open memos")
      .setDesc("Focus on editor when open memos. Focus by default.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.FocusOnEditor)
          .onChange(async (value) => {
            this.plugin.settings.FocusOnEditor = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName("Open daily memos without open memos")
      .setDesc("Open daily memos without open memos. Open by default.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.OpenDailyMemosWithMemos)
          .onChange(async (value) => {
            this.plugin.settings.OpenDailyMemosWithMemos = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName("Save Memo button label")
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
    
    this.containerEl.createEl("h1", { text: "Advanced Options" });

    let dropdown: DropdownComponent;

    new Setting(containerEl)
      .setName("UI language")
      .setDesc("Translates the UI language. Only 'en' and 'zh' are available.")
      .addDropdown(async (d: DropdownComponent) => {
        dropdown = d;
        dropdown.addOption("zh", "中文");
        dropdown.addOption("en", "English");
        dropdown
          .setValue(this.plugin.settings.Language)
          .onChange(async (value) => {
            this.plugin.settings.Language = value;
            this.applySettingsUpdate();
          });
      });

    new Setting(containerEl)
      .setName("Default prefix")
      .setDesc("Set the default prefix when create memo, 'List' by default.")
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

    new Setting(containerEl)
    .setName("Default insert date format")
    .setDesc("Set the default date format when insert date by @, 'Tasks' by default.")
    .addDropdown(async (d: DropdownComponent) => {
      dropdown = d;
      dropdown.addOption("Tasks", "Tasks");
      dropdown.addOption("Dataview", "Dataview");
      dropdown
        .setValue(this.plugin.settings.InsertDateFormat)
        .onChange(async (value) => {
          this.plugin.settings.InsertDateFormat = value;
          this.applySettingsUpdate();
        });
    });

    new Setting(containerEl)
    .setName("Default editor position on mobile")
    .setDesc("Set the default editor position on Mobile, 'Top' by default.")
    .addDropdown(async (d: DropdownComponent) => {
      dropdown = d;
      dropdown.addOption("Top", "Top");
      dropdown.addOption("Bottom", "Bottom");
      dropdown
        .setValue(this.plugin.settings.DefaultEditorLocation)
        .onChange(async (value) => {
          this.plugin.settings.DefaultEditorLocation = value;
          this.applySettingsUpdate();
        });
    });

    new Setting(containerEl)
      .setName("Use button to show editor on mobile")
      .setDesc("Set a float button to call editor on mobile. Only when editor located at the bottom works.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.UseButtonToShowEditor)
          .onChange(async (value) => {
            this.plugin.settings.UseButtonToShowEditor = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName("Hide done tasks in Memo list")
      .setDesc("Hide all done tasks in Memo list. Show done tasks by default.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.HideDoneTasks)
          .onChange(async (value) => {
            this.plugin.settings.HideDoneTasks = value;
            this.applySettingsUpdate();
          }),
      );

    this.containerEl.createEl("h1", { text: "Say Thank You" });

    new Setting(containerEl)
      .setName('Donate')
      .setDesc('If you like this plugin, consider donating to support continued development:')
      // .setClass("AT-extra")
      .addButton((bt) => {
          bt.buttonEl.outerHTML = `<a href="https://www.buymeacoffee.com/boninall"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=boninall&button_colour=6495ED&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00"></a>`;
    });
  }
}