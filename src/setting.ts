import { App, DropdownComponent, PluginSettingTab, Setting } from 'obsidian';
import type MemosPlugin from './index';
import memoService from './services/memoService';
import { t } from './translations/helper';
import { getDailyNotePath } from './helpers/utils';

export interface MemosSettings {
  StartDate: string;
  InsertAfter: string;
  UserName: string;
  ProcessEntriesBelow: string;
  Language: string;
  SaveMemoButtonLabel: string;
  SaveMemoButtonIcon: string;
  ShareFooterStart: string;
  ShareFooterEnd: string;
  UseDailyOrPeriodic: string;
  DefaultPrefix: string;
  InsertDateFormat: string;
  DefaultEditorLocation: string;
  UseButtonToShowEditor: boolean;
  FocusOnEditor: boolean;
  OpenDailyMemosWithMemos: boolean;
  HideDoneTasks: boolean;
  OpenMemosAutomatically: boolean;
  // EditorMaxHeight: string;
  ShowTime: boolean;
  ShowDate: boolean;
  AddBlankLineWhenDate: boolean;
  AutoSaveWhenOnMobile: boolean;
  DeleteFileName: string;
  QueryFileName: string;
  UseVaultTags: boolean;
  DefaultLightBackgroundImage: string;
  DefaultDarkBackgroundImage: string;
  DefaultMemoComposition: string;
  ShowTaskLabel: boolean;
  CommentOnMemos: boolean;
  CommentsInOriginalNotes: boolean;
  FetchMemosMark: string;
  FetchMemosFromNote: boolean;
  ShowCommentOnMemos: boolean;
  ShowLeftSideBar: boolean;
}

export const DEFAULT_SETTINGS: MemosSettings = {
  StartDate: 'Sunday',
  InsertAfter: '# Journal',
  UserName: 'MEMO 😉',
  ProcessEntriesBelow: '',
  Language: 'en',
  SaveMemoButtonLabel: 'NOTEIT',
  SaveMemoButtonIcon: '✍️',
  ShareFooterStart: '{MemosNum} Memos {UsedDay} Day',
  ShareFooterEnd: '✍️ by {UserName}',
  DefaultPrefix: 'List',
  UseDailyOrPeriodic: 'Daily',
  InsertDateFormat: 'Tasks',
  DefaultEditorLocation: 'Top',
  UseButtonToShowEditor: false,
  FocusOnEditor: true,
  OpenDailyMemosWithMemos: true,
  HideDoneTasks: false,
  ShowTaskLabel: false,
  OpenMemosAutomatically: false,
  // EditorMaxHeight: '250',
  ShowTime: true,
  ShowDate: true,
  AddBlankLineWhenDate: false,
  AutoSaveWhenOnMobile: false,
  DeleteFileName: 'delete',
  QueryFileName: 'query',
  UseVaultTags: false,
  DefaultLightBackgroundImage: '',
  DefaultDarkBackgroundImage: '',
  DefaultMemoComposition: '{TIME} {CONTENT}',
  CommentOnMemos: false,
  CommentsInOriginalNotes: false,
  FetchMemosMark: '#memo',
  FetchMemosFromNote: false,
  ShowCommentOnMemos: false,
  ShowLeftSideBar: false,
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

  async changeFileName(originalFileName: string, fileName: string) {
    const filePath = getDailyNotePath();
    const absolutePath = filePath + '/' + originalFileName + '.md';
    const newFilePath = filePath + '/' + fileName + '.md';
    const getFile = this.app.vault.getAbstractFileByPath(absolutePath);
    // const deleteFile = this.app.metadataCache.getFirstLinkpathDest('', absolutePath);
    await this.app.fileManager.renameFile(getFile, newFilePath);
  }

  //eslint-disable-next-line
  async hide() {}

  async display() {
    await this.plugin.loadSettings();

    const { containerEl } = this;
    this.containerEl.empty();

    this.containerEl.createEl('h1', { text: t('Basic Options') });
    // containerEl.createDiv("", (el) => {
    //   el.innerHTML = "Basic Options";
    // });

    new Setting(containerEl)
      .setName(t('User name in Memos'))
      .setDesc(t("Set your user name here. 'Memos 😏' By default"))
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.UserName)
          .setValue(this.plugin.settings.UserName)
          .onChange(async (value) => {
            this.plugin.settings.UserName = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('Insert after heading'))
      .setDesc(
        t('You should set the same heading below if you want to insert and process memos below the same heading.'),
      )
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.InsertAfter)
          .setValue(this.plugin.settings.InsertAfter)
          .onChange(async (value) => {
            this.plugin.settings.InsertAfter = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('Process Memos below'))
      .setDesc(
        t(
          'Only entries below this string/section in your notes will be processed. If it does not exist no notes will be processed for that file.',
        ),
      )
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.ProcessEntriesBelow)
          .setValue(this.plugin.settings.ProcessEntriesBelow)
          .onChange(async (value) => {
            this.plugin.settings.ProcessEntriesBelow = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('Save Memo button label'))
      .setDesc(t("The text shown on the save Memo button in the UI. 'NOTEIT' by default."))
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.SaveMemoButtonLabel)
          .setValue(this.plugin.settings.SaveMemoButtonLabel)
          .onChange(async (value) => {
            this.plugin.settings.SaveMemoButtonLabel = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('Save Memo button icon'))
      .setDesc(t('The icon shown on the save Memo button in the UI.'))
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.SaveMemoButtonIcon)
          .setValue(this.plugin.settings.SaveMemoButtonIcon)
          .onChange(async (value) => {
            this.plugin.settings.SaveMemoButtonIcon = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('Focus on editor when open memos'))
      .setDesc(t('Focus on editor when open memos. Focus by default.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.FocusOnEditor).onChange(async (value) => {
          this.plugin.settings.FocusOnEditor = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Open daily memos with open memos'))
      .setDesc(t('Open daily memos with open memos. Open by default.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.OpenDailyMemosWithMemos).onChange(async (value) => {
          this.plugin.settings.OpenDailyMemosWithMemos = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Open Memos when obsidian opens'))
      .setDesc(t('When enable this, Memos will open when Obsidian opens. False by default.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.OpenMemosAutomatically).onChange(async (value) => {
          this.plugin.settings.OpenMemosAutomatically = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Hide done tasks in Memo list'))
      .setDesc(t('Hide all done tasks in Memo list. Show done tasks by default.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.HideDoneTasks).onChange(async (value) => {
          this.plugin.settings.HideDoneTasks = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Show Tasks Label'))
      .setDesc(t('Show tasks label near the time text. False by default'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.ShowTaskLabel).onChange(async (value) => {
          this.plugin.settings.ShowTaskLabel = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Use Tags In Vault'))
      .setDesc(t('Use tags in vault rather than only in Memos. False by default.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.UseVaultTags).onChange(async (value) => {
          this.plugin.settings.UseVaultTags = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Always Show Leaf Sidebar on PC'))
      .setDesc(t('Show left sidebar on PC even when the leaf width is less than 875px. False by default.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.ShowLeftSideBar).onChange(async (value) => {
          this.plugin.settings.ShowLeftSideBar = value;
          this.applySettingsUpdate();
        }),
      );

    this.containerEl.createEl('h1', { text: t('Advanced Options') });

    // new Setting(containerEl)
    //   .setName('Set The Max-Height for Editor')
    //   .setDesc("Set the max height for editor in Memos. '250' By default")
    //   .addText((text) =>
    //     text
    //       .setPlaceholder(DEFAULT_SETTINGS.EditorMaxHeight)
    //       .setValue(this.plugin.settings.EditorMaxHeight)
    //       .onChange(async (value) => {
    //         this.plugin.settings.EditorMaxHeight = value;
    //         this.applySettingsUpdate();
    //       }),
    //   );

    let dropdown: DropdownComponent;

    // new Setting(containerEl)
    //   .setName(t('UI language for date'))
    //   .setDesc(t("Translates the date UI language. Only 'en' and 'zh' are available."))
    //   .addDropdown(async (d: DropdownComponent) => {
    //     dropdown = d;
    //     dropdown.addOption('zh', '中文');
    //     dropdown.addOption('en', 'English');
    //     dropdown.setValue(this.plugin.settings.Language).onChange(async (value) => {
    //       this.plugin.settings.Language = value;
    //       this.applySettingsUpdate();
    //     });
    //   });

    new Setting(containerEl)
      .setName(t('Default prefix'))
      .setDesc(t("Set the default prefix when create memo, 'List' by default."))
      .addDropdown(async (d: DropdownComponent) => {
        dropdown = d;
        dropdown.addOption('List', t('List'));
        dropdown.addOption('Task', t('Task'));
        dropdown.setValue(this.plugin.settings.DefaultPrefix).onChange(async (value) => {
          this.plugin.settings.DefaultPrefix = value;
          this.applySettingsUpdate();
        });
      });

    new Setting(containerEl)
      .setName(t('Default insert date format'))
      .setDesc(t("Set the default date format when insert date by @, 'Tasks' by default."))
      .addDropdown(async (d: DropdownComponent) => {
        dropdown = d;
        dropdown.addOption('Tasks', 'Tasks');
        dropdown.addOption('Dataview', 'Dataview');
        dropdown.setValue(this.plugin.settings.InsertDateFormat).onChange(async (value) => {
          this.plugin.settings.InsertDateFormat = value;
          this.applySettingsUpdate();
        });
      });

    new Setting(containerEl)
      .setName(t('Show Time When Copy Results'))
      .setDesc(t('Show time when you copy results, like 12:00. Copy time by default.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.ShowTime).onChange(async (value) => {
          this.plugin.settings.ShowTime = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Show Date When Copy Results'))
      .setDesc(t('Show date when you copy results, like [[2022-01-01]]. Copy date by default.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.ShowDate).onChange(async (value) => {
          this.plugin.settings.ShowDate = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Add Blank Line Between Different Date'))
      .setDesc(t('Add blank line when copy result with date. No blank line by default.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.AddBlankLineWhenDate).onChange(async (value) => {
          this.plugin.settings.AddBlankLineWhenDate = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('File Name of Recycle Bin'))
      .setDesc(t("Set the filename for recycle bin. 'delete' By default"))
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.DeleteFileName)
          .setValue(this.plugin.settings.DeleteFileName)
          .onChange(async (value) => {
            await this.changeFileName(this.plugin.settings.DeleteFileName, value);
            this.plugin.settings.DeleteFileName = value;

            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('File Name of Query File'))
      .setDesc(t("Set the filename for query file. 'query' By default"))
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.QueryFileName)
          .setValue(this.plugin.settings.QueryFileName)
          .onChange(async (value) => {
            await this.changeFileName(this.plugin.settings.QueryFileName, value);
            this.plugin.settings.QueryFileName = value;

            this.applySettingsUpdate();
          }),
      );

    this.containerEl.createEl('h1', { text: t('Mobile Options') });

    new Setting(containerEl)
      .setName(t('Default editor position on mobile'))
      .setDesc(t("Set the default editor position on Mobile, 'Top' by default."))
      .addDropdown(async (d: DropdownComponent) => {
        dropdown = d;
        dropdown.addOption('Top', t('Top'));
        dropdown.addOption('Bottom', t('Bottom'));
        dropdown.setValue(this.plugin.settings.DefaultEditorLocation).onChange(async (value) => {
          this.plugin.settings.DefaultEditorLocation = value;
          this.applySettingsUpdate();
        });
      });

    new Setting(containerEl)
      .setName(t('Use button to show editor on mobile'))
      .setDesc(t('Set a float button to call editor on mobile. Only when editor located at the bottom works.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.UseButtonToShowEditor).onChange(async (value) => {
          this.plugin.settings.UseButtonToShowEditor = value;
          this.applySettingsUpdate();
        }),
      );

    this.containerEl.createEl('h1', { text: t('Share Options') });

    new Setting(containerEl)
      .setName(t('Share Memos Image Footer Start'))
      .setDesc(
        t(
          "Set anything you want here, use {MemosNum} to display Number of memos, {UsedDay} for days. '{MemosNum} Memos {UsedDay} Days' By default",
        ),
      )
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.ShareFooterStart)
          .setValue(this.plugin.settings.ShareFooterStart)
          .onChange(async (value) => {
            this.plugin.settings.ShareFooterStart = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('Share Memos Image Footer End'))
      .setDesc(t("Set anything you want here, use {UserName} as your username. '✍️ By {UserName}' By default"))
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.ShareFooterEnd)
          .setValue(this.plugin.settings.ShareFooterEnd)
          .onChange(async (value) => {
            this.plugin.settings.ShareFooterEnd = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('Background Image in Light Theme'))
      .setDesc(t('Set background image in light theme. Set something like "Daily/one.png"'))
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.DefaultLightBackgroundImage)
          .setValue(this.plugin.settings.DefaultLightBackgroundImage)
          .onChange(async (value) => {
            this.plugin.settings.DefaultLightBackgroundImage = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('Background Image in Dark Theme'))
      .setDesc(t('Set background image in dark theme. Set something like "Daily/one.png"'))
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.DefaultDarkBackgroundImage)
          .setValue(this.plugin.settings.DefaultDarkBackgroundImage)
          .onChange(async (value) => {
            this.plugin.settings.DefaultDarkBackgroundImage = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('Save Shared Image To Folder For Mobile'))
      .setDesc(t('Save image to folder for mobile. False by Default'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.AutoSaveWhenOnMobile).onChange(async (value) => {
          this.plugin.settings.AutoSaveWhenOnMobile = value;
          this.applySettingsUpdate();
        }),
      );

    this.containerEl.createEl('h1', { text: t('Experimental Options') });

    new Setting(containerEl)
      .setName(t("Use Which Plugin's Default Configuration"))
      .setDesc(t("Memos use the plugin's default configuration to fetch memos from daily, 'Daily' by default."))
      .addDropdown(async (d: DropdownComponent) => {
        dropdown = d;
        dropdown.addOption('Daily', t('Daily'));
        dropdown.addOption('Periodic', 'Periodic');
        dropdown.setValue(this.plugin.settings.UseDailyOrPeriodic).onChange(async (value) => {
          this.plugin.settings.UseDailyOrPeriodic = value;
          this.applySettingsUpdate();
        });
      });

    new Setting(containerEl)
      .setName(t('Default Memo Composition'))
      .setDesc(
        t(
          'Set default memo composition, you should use {TIME} as "HH:mm" and {CONTENT} as content. "{TIME} {CONTENT}" by default',
        ),
      )
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.DefaultMemoComposition)
          .setValue(this.plugin.settings.DefaultMemoComposition)
          .onChange(async (value) => {
            this.plugin.settings.DefaultMemoComposition = value;
            this.applySettingsUpdate();
          }),
      );

    new Setting(containerEl)
      .setName(t('Allow Comments On Memos'))
      .setDesc(t('You can comment on memos. False by default'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.CommentOnMemos).onChange(async (value) => {
          this.plugin.settings.CommentOnMemos = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Always Show Memo Comments'))
      .setDesc(t('Always show memo comments on memos. False by default'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.ShowCommentOnMemos).onChange(async (value) => {
          this.plugin.settings.ShowCommentOnMemos = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Comments In Original DailyNotes/Notes'))
      .setDesc(t('You should install Dataview Plugin ver 0.5.9 or later to use this feature.'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.CommentsInOriginalNotes).onChange(async (value) => {
          this.plugin.settings.CommentsInOriginalNotes = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Allow Memos to Fetch Memo from Notes'))
      .setDesc(t('Use Memos to manage all memos in your notes, not only in daily notes. False by default'))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.FetchMemosFromNote).onChange(async (value) => {
          this.plugin.settings.FetchMemosFromNote = value;
          this.applySettingsUpdate();
        }),
      );

    new Setting(containerEl)
      .setName(t('Fetch Memos From Particular Notes'))
      .setDesc(
        t(
          'You can set any Dataview Query for memos to fetch it. All memos in those notes will show on list. "#memo" by default',
        ),
      )
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.FetchMemosMark)
          .setValue(this.plugin.settings.FetchMemosMark)
          .onChange(async (value) => {
            this.plugin.settings.FetchMemosMark = value;
            if (value === '') {
              this.plugin.settings.FetchMemosMark = DEFAULT_SETTINGS.FetchMemosMark;
            }
            this.applySettingsUpdate();
          }),
      );

    this.containerEl.createEl('h1', { text: t('Say Thank You') });

    new Setting(containerEl)
      .setName(t('Donate'))
      .setDesc(t('If you like this plugin, consider donating to support continued development:'))
      // .setClass("AT-extra")
      .addButton((bt) => {
        bt.buttonEl.outerHTML = `<a href="https://www.buymeacoffee.com/boninall"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=boninall&button_colour=6495ED&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00"></a>`;
      });
  }
}
