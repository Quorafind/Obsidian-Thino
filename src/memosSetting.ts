import { App, DropdownComponent, Platform, PluginSettingTab, SearchComponent, setIcon, Setting } from 'obsidian';
import type MemosPlugin from './memosIndex';
import memoService from './services/memoService';
import { t } from './translations/helper';
import { getDailyNotePath } from './helpers/utils';
import TabSetting from './obUtils/Setting/addTabSetting';

type settingSearchInfo = {
    containerEl: HTMLElement;
    name: string;
    description: string;
    options: SearchOptionInfo[];
    alias?: string;
};
type TabContentInfo = { content: HTMLElement; heading: HTMLElement; navButton: HTMLElement };
export type SearchOptionInfo = { name: string; description: string; options?: DropdownRecord[] };

export class DropdownRecord {
    public value: string;
    public description: string;

    constructor(value: string, description: string) {
        this.value = value;
        this.description = description;
    }
}

const tabNameToTabIconId: Record<string, string> = {
    General: 'chef-hat',
    Memos: 'memos',
    Theme: 'brush',
    Share: 'share-2',
    Advanced: 'cog',
};

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
    private tabContent: Map<string, TabContentInfo> = new Map<string, TabContentInfo>();
    private selectedTab = 'General';
    private search: SearchComponent;
    private searchSettingInfo: Map<string, settingSearchInfo[]> = new Map();
    private searchZeroState: HTMLDivElement;
    private navigateEl: HTMLElement;

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

    async display() {
        this.containerEl.empty();

        this.generateSettingsTitle();
        this.addTabHeader();
    }

    private generateSettingsTitle() {
        const linterHeader = this.containerEl.createDiv('memos-setting-title');
        linterHeader.createEl('h2', { text: 'Memos' });
        this.generateSearchBar(linterHeader);
    }

    private addTabHeader() {
        const navContainer = this.containerEl.createEl('nav', { cls: 'memos-setting-header' });
        this.navigateEl = navContainer.createDiv('memos-setting-tab-group');
        const settingsEl = this.containerEl.createDiv('memos-setting-content');

        this.createTabAndContent('General', this.navigateEl, settingsEl, (el: HTMLElement, tabName: string) => this.generateGeneralSettings(tabName, el));
        this.createTabAndContent('Memos', this.navigateEl, settingsEl, (el: HTMLElement, tabName: string) => this.generateMemosSettings(tabName, el));
        this.createTabAndContent('Theme', this.navigateEl, settingsEl, (el: HTMLElement, tabName: string) => this.generateThemeSettings(tabName, el));
        this.createTabAndContent('Share', this.navigateEl, settingsEl, (el: HTMLElement, tabName: string) => this.generateShareSettings(tabName, el));
        this.createTabAndContent('Advanced', this.navigateEl, settingsEl, (el: HTMLElement, tabName: string) => this.generateAdvancedSettings(tabName, el));
        this.createSearchZeroState(settingsEl);
    }

    generateSearchBar(containerEl: HTMLElement) {
        // based on https://github.com/valentine195/obsidian-settings-search/blob/master/src/main.ts#L294-L308
        const searchSetting = new Setting(containerEl);
        searchSetting.settingEl.style.border = 'none';
        searchSetting.addSearch((s: SearchComponent) => {
            this.search = s;
        });

        this.search.setPlaceholder(t('Search all settings'));

        this.search.inputEl.oninput = () => {
            for (const tabInfo of this.tabContent) {
                const tab = tabInfo[1];
                tab.navButton.removeClass('memos-navigation-item-selected');
                (tab.content as HTMLElement).show();
                (tab.heading as HTMLElement).show();

                const searchVal = this.search.getValue();
                if (this.selectedTab == '' && searchVal.trim() != '') {
                    this.searchSettings(searchVal.toLowerCase());
                }

                this.selectedTab = '';
            }
            this.navigateEl.addClass('memos-setting-searching');
        };

        // this.search.clearButtonEl.addEventListener('click', () => {
        // 	this.selectedTab = 'General';
        // })

        this.search.inputEl.onblur = () => {
            this.navigateEl.removeClass('memos-setting-searching');
        };

        this.search.onChange((value: string) => {
            if (value === '') {
                this.navigateEl.children[0].dispatchEvent(new PointerEvent('click'));
            }
            this.searchSettings(value.toLowerCase());
        });
    }

    createTabAndContent(tabName: string, navigateEl: HTMLElement, containerEl: HTMLElement, generateTabContent?: (el: HTMLElement, tabName: string) => void) {
        const displayTabContent = this.selectedTab === tabName;
        const tabEl = navigateEl.createDiv('memos-navigation-item');

        const tabClass = 'memos-desktop';
        tabEl.addClass(tabClass);

        setIcon(tabEl.createEl('div', { cls: 'memos-navigation-item-icon' }), tabNameToTabIconId[tabName]);
        // @ts-ignore
        tabEl.createSpan().setText(t(tabName));

        tabEl.onclick = () => {
            if (this.selectedTab == tabName) {
                return;
            }

            tabEl.addClass('memos-navigation-item-selected');
            const tab = this.tabContent.get(tabName);
            (tab?.content as HTMLElement).show();

            if (this.selectedTab != '') {
                const tabInfo = this.tabContent.get(this.selectedTab);
                tabInfo?.navButton.removeClass('memos-navigation-item-selected');
                (tabInfo?.content as HTMLElement).hide();
            } else {
                (this.searchZeroState as HTMLElement).hide();

                for (const settingTab of this.searchSettingInfo) {
                    for (const setting of settingTab[1]) {
                        (setting.containerEl as HTMLElement).show();
                    }
                }

                for (const tabInfo of this.tabContent) {
                    const tab = tabInfo[1];
                    (tab.heading as HTMLElement).hide();
                    if (tabName !== tabInfo[0]) {
                        (tab.content as HTMLElement).hide();
                    }
                }
            }

            this.selectedTab = tabName;
        };

        const tabContent = containerEl.createDiv('memos-tab-settings');

        const tabHeader = tabContent.createEl('h2', { cls: 'memos-setting-heading', text: tabName + ' Settings' });
        (tabHeader as HTMLElement).hide();

        tabContent.id = tabName.toLowerCase().replace(' ', '-');
        if (!displayTabContent) {
            (tabContent as HTMLElement).hide();
        } else {
            tabEl.addClass('memos-navigation-item-selected');
        }

        if (generateTabContent) {
            generateTabContent(tabContent, tabName);
        }

        this.tabContent.set(tabName, { content: tabContent, heading: tabHeader, navButton: tabEl });
    }

    private searchSettings(searchVal: string) {
        const tabsWithSettingsInSearchResults = new Set<string>();
        const showSearchResultAndAddTabToResultList = (settingContainer: HTMLElement, tabName: string) => {
            (settingContainer as HTMLElement).show();

            if (!tabsWithSettingsInSearchResults.has(tabName)) {
                tabsWithSettingsInSearchResults.add(tabName);
            }
        };

        for (const tabSettingInfo of this.searchSettingInfo) {
            const tabName = tabSettingInfo[0];
            const tabSettings = tabSettingInfo[1];
            for (const settingInfo of tabSettings) {
                // check the more common things first and then make sure to search the options since it will be slower to do that
                // Note: we check for an empty string for searchVal to see if the search is essentially empty which will display all rules
                if (searchVal.trim() === '' || settingInfo.alias?.includes(searchVal) || settingInfo.description.includes(searchVal) || settingInfo.name.includes(searchVal)) {
                    showSearchResultAndAddTabToResultList(settingInfo.containerEl, tabName);
                } else if (settingInfo.options) {
                    for (const optionInfo of settingInfo.options) {
                        if (optionInfo.description.toLowerCase().includes(searchVal) || optionInfo.name.toLowerCase().includes(searchVal)) {
                            showSearchResultAndAddTabToResultList(settingInfo.containerEl, tabName);

                            break;
                        } else if (optionInfo.options) {
                            for (const optionsForOption of optionInfo.options) {
                                if (optionsForOption.description.toLowerCase().includes(searchVal) || optionsForOption.value.toLowerCase().includes(searchVal)) {
                                    showSearchResultAndAddTabToResultList(settingInfo.containerEl, tabName);

                                    break;
                                }
                            }
                        }

                        (settingInfo.containerEl as HTMLElement).hide();
                    }
                } else {
                    (settingInfo.containerEl as HTMLElement).hide();
                }
            }
        }

        // display any headings that have setting results and hide any that do not
        for (const tabInfo of this.tabContent) {
            if (tabsWithSettingsInSearchResults.has(tabInfo[0])) {
                (tabInfo[1].heading as HTMLElement).show();
            } else {
                (tabInfo[1].heading as HTMLElement).hide();
            }
        }

        if (tabsWithSettingsInSearchResults.size === 0) {
            (this.searchZeroState as HTMLElement).show();
        } else {
            (this.searchZeroState as HTMLElement).hide();
        }
    }

    // @ts-ignore
    addSettingToMasterSettingsList(tabName: string, containerEl: HTMLElement, name = '', description = '', options: SearchOptionInfo[] = null, alias: string = null) {
        const settingInfo = {
            containerEl: containerEl,
            name: name.toLowerCase(),
            description: description.toLowerCase(),
            options: options,
            alias: alias,
        };

        if (!this.searchSettingInfo.has(tabName)) {
            this.searchSettingInfo.set(tabName, [settingInfo]);
        } else {
            this.searchSettingInfo.get(tabName)?.push(settingInfo);
        }
    }

    private createSearchZeroState(containerEl: HTMLElement) {
        this.searchZeroState = containerEl.createDiv();
        (this.searchZeroState as HTMLElement).hide();
        this.searchZeroState.createEl(Platform.isMobile ? 'h3' : 'h2', {
            text: 'No settings match search',
        }).style.textAlign = 'center';
    }

    private generateGeneralSettings(tabName: string, memosContainerEl: HTMLElement) {
        this.customHeading(tabName, memosContainerEl);
    }

    private generateThemeSettings(tabName: string, memosContainerEl: HTMLElement) {
        this.customNameAndTheme(tabName, memosContainerEl);
    }

    private generateMemosSettings(tabName: string, memosContainerEl: HTMLElement) {
        this.addMemoSettings(tabName, memosContainerEl);
        this.memosCommentSettings(tabName, memosContainerEl);
    }

    private generateShareSettings(tabName: string, memosContainerEl: HTMLElement) {
        this.copyMemosSettings(tabName, memosContainerEl);
        this.shareMemosSettings(tabName, memosContainerEl);
    }

    private generateAdvancedSettings(tabName: string, memosContainerEl: HTMLElement) {
        this.saveDataSettings(tabName, memosContainerEl);
        this.fetchDataSettings(tabName, memosContainerEl);
        this.customFileNameSettings(tabName, memosContainerEl);
    }

    private customNameAndTheme(tabName: string, memosContainerEl: HTMLElement) {
        new TabSetting(memosContainerEl, this)
            .setName(t('User name in Memos'))
            .setDesc(t("Set your user name here. 'Memos 😏' By default"))
            .setTab(tabName)
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.UserName)
                    .setValue(this.plugin.settings.UserName)
                    .onChange(async (value) => {
                        this.plugin.settings.UserName = value;
                        this.applySettingsUpdate();
                    }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Save Memo button label'))
            .setDesc(t("The text shown on the save Memo button in the UI. 'NOTEIT' by default."))
            .setTab(tabName)
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.SaveMemoButtonLabel)
                    .setValue(this.plugin.settings.SaveMemoButtonLabel)
                    .onChange(async (value) => {
                        this.plugin.settings.SaveMemoButtonLabel = value;
                        this.applySettingsUpdate();
                    }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Save Memo button icon'))
            .setDesc(t('The icon shown on the save Memo button in the UI.'))
            .setTab(tabName)
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.SaveMemoButtonIcon)
                    .setValue(this.plugin.settings.SaveMemoButtonIcon)
                    .onChange(async (value) => {
                        this.plugin.settings.SaveMemoButtonIcon = value;
                        this.applySettingsUpdate();
                    }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Always Show Leaf Sidebar on PC'))
            .setDesc(t('Show left sidebar on PC even when the leaf width is less than 875px. False by default.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.ShowLeftSideBar).onChange(async (value) => {
                    this.plugin.settings.ShowLeftSideBar = value;
                    this.applySettingsUpdate();
                }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Focus on editor when open memos'))
            .setDesc(t('Focus on editor when open memos. Focus by default.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.FocusOnEditor).onChange(async (value) => {
                    this.plugin.settings.FocusOnEditor = value;
                    this.applySettingsUpdate();
                }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Open daily memos with open memos'))
            .setDesc(t('Open daily memos with open memos. Open by default.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.OpenDailyMemosWithMemos).onChange(async (value) => {
                    this.plugin.settings.OpenDailyMemosWithMemos = value;
                    this.applySettingsUpdate();
                }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Open Memos when obsidian opens'))
            .setDesc(t('When enable this, Memos will open when Obsidian opens. False by default.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.OpenMemosAutomatically).onChange(async (value) => {
                    this.plugin.settings.OpenMemosAutomatically = value;
                    this.applySettingsUpdate();
                }),
            );

        let dropdown: DropdownComponent;

        new TabSetting(memosContainerEl, this)
            .setName(t('Default prefix'))
            .setDesc(t("Set the default prefix when create memo, 'List' by default."))
            .setTab(tabName)
            .addDropdown(async (d: DropdownComponent) => {
                dropdown = d;
                dropdown.addOption('List', t('List'));
                dropdown.addOption('Task', t('Task'));
                dropdown.setValue(this.plugin.settings.DefaultPrefix).onChange(async (value) => {
                    this.plugin.settings.DefaultPrefix = value;
                    this.applySettingsUpdate();
                });
            });

        new TabSetting(memosContainerEl, this)
            .setName(t('Default insert date format'))
            .setDesc(t("Set the default date format when insert date by @, 'Tasks' by default."))
            .setTab(tabName)
            .addDropdown(async (d: DropdownComponent) => {
                dropdown = d;
                dropdown.addOption('Tasks', 'Tasks');
                dropdown.addOption('Dataview', 'Dataview');
                dropdown.setValue(this.plugin.settings.InsertDateFormat).onChange(async (value) => {
                    this.plugin.settings.InsertDateFormat = value;
                    this.applySettingsUpdate();
                });
            });

        new TabSetting(memosContainerEl, this)
            .setName(t('Default editor position on mobile'))
            .setDesc(t("Set the default editor position on Mobile, 'Top' by default."))
            .setTab(tabName)
            .addDropdown(async (d: DropdownComponent) => {
                dropdown = d;
                dropdown.addOption('Top', t('Top'));
                dropdown.addOption('Bottom', t('Bottom'));
                dropdown.setValue(this.plugin.settings.DefaultEditorLocation).onChange(async (value) => {
                    this.plugin.settings.DefaultEditorLocation = value;
                    this.applySettingsUpdate();
                });
            });

        new TabSetting(memosContainerEl, this)
            .setName(t('Use button to show editor on mobile'))
            .setDesc(t('Set a float button to call editor on mobile. Only when editor located at the bottom works.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.UseButtonToShowEditor).onChange(async (value) => {
                    this.plugin.settings.UseButtonToShowEditor = value;
                    this.applySettingsUpdate();
                }),
            );
    }

    private customHeading(tabName: string, memosContainerEl: HTMLElement) {
        new TabSetting(memosContainerEl, this)
            .setName(t('Use Tags In Vault'))
            .setDesc(t('Use tags in vault rather than only in Memos. False by default.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.UseVaultTags).onChange(async (value) => {
                    this.plugin.settings.UseVaultTags = value;
                    this.applySettingsUpdate();
                }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Insert after heading'))
            .setDesc(t('You should set the same heading below if you want to insert and process memos below the same heading.'))
            .setTab(tabName)
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.InsertAfter)
                    .setValue(this.plugin.settings.InsertAfter)
                    .onChange(async (value) => {
                        this.plugin.settings.InsertAfter = value;
                        this.applySettingsUpdate();
                    }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Process Memos below'))
            .setDesc(t('Only entries below this string/section in your notes will be processed. If it does not exist no notes will be processed for that file.'))
            .setTab(tabName)
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.ProcessEntriesBelow)
                    .setValue(this.plugin.settings.ProcessEntriesBelow)
                    .onChange(async (value) => {
                        this.plugin.settings.ProcessEntriesBelow = value;
                        this.applySettingsUpdate();
                    }),
            );
    }

    private addMemoSettings(tabName: string, memosContainerEl: HTMLElement) {
        new TabSetting(memosContainerEl, this)
            .setName(t('Hide done tasks in Memo list'))
            .setDesc(t('Hide all done tasks in Memo list. Show done tasks by default.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.HideDoneTasks).onChange(async (value) => {
                    this.plugin.settings.HideDoneTasks = value;
                    this.applySettingsUpdate();
                }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Show Tasks Label'))
            .setDesc(t('Show tasks label near the time text. False by default'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.ShowTaskLabel).onChange(async (value) => {
                    this.plugin.settings.ShowTaskLabel = value;
                    this.applySettingsUpdate();
                }),
            );
    }

    private memosCommentSettings(tabName: string, memosContainerEl: HTMLElement) {
        new TabSetting(memosContainerEl, this)
            .setName(t('Allow Comments On Memos'))
            .setDesc(t('You can comment on memos. False by default'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.CommentOnMemos).onChange(async (value) => {
                    this.plugin.settings.CommentOnMemos = value;
                    this.applySettingsUpdate();

                    this.display();
                }),
            );

        if (!this.plugin.settings.CommentOnMemos) return;

        new TabSetting(memosContainerEl, this)
            .setName(t('Always Show Memo Comments'))
            .setDesc(t('Always show memo comments on memos. False by default'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.ShowCommentOnMemos).onChange(async (value) => {
                    this.plugin.settings.ShowCommentOnMemos = value;
                    this.applySettingsUpdate();
                }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Comments In Original DailyNotes/Notes'))
            .setDesc(t('You should install Dataview Plugin ver 0.5.9 or later to use this feature.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.CommentsInOriginalNotes).onChange(async (value) => {
                    this.plugin.settings.CommentsInOriginalNotes = value;
                    this.applySettingsUpdate();
                }),
            );
    }

    private copyMemosSettings(tabName: string, memosContainerEl: HTMLElement) {
        new TabSetting(memosContainerEl, this)
            .setName(t('Show Time When Copy Results'))
            .setDesc(t('Show time when you copy results, like 12:00. Copy time by default.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.ShowTime).onChange(async (value) => {
                    this.plugin.settings.ShowTime = value;
                    this.applySettingsUpdate();
                }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Show Date When Copy Results'))
            .setDesc(t('Show date when you copy results, like [[2022-01-01]]. Copy date by default.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.ShowDate).onChange(async (value) => {
                    this.plugin.settings.ShowDate = value;
                    this.applySettingsUpdate();
                }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Add Blank Line Between Different Date'))
            .setDesc(t('Add blank line when copy result with date. No blank line by default.'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.AddBlankLineWhenDate).onChange(async (value) => {
                    this.plugin.settings.AddBlankLineWhenDate = value;
                    this.applySettingsUpdate();
                }),
            );
    }

    private shareMemosSettings(tabName: string, memosContainerEl: HTMLElement) {
        new TabSetting(memosContainerEl, this)
            .setName(t('Share Memos Image Footer Start'))
            .setDesc(t("Set anything you want here, use {MemosNum} to display Number of memos, {UsedDay} for days. '{MemosNum} Memos {UsedDay} Days' By default"))
            .setTab(tabName)
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.ShareFooterStart)
                    .setValue(this.plugin.settings.ShareFooterStart)
                    .onChange(async (value) => {
                        this.plugin.settings.ShareFooterStart = value;
                        this.applySettingsUpdate();
                    }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Share Memos Image Footer End'))
            .setDesc(t("Set anything you want here, use {UserName} as your username. '✍️ By {UserName}' By default"))
            .setTab(tabName)
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.ShareFooterEnd)
                    .setValue(this.plugin.settings.ShareFooterEnd)
                    .onChange(async (value) => {
                        this.plugin.settings.ShareFooterEnd = value;
                        this.applySettingsUpdate();
                    }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Background Image in Light Theme'))
            .setDesc(t('Set background image in light theme. Set something like "Daily/one.png"'))
            .setTab(tabName)
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.DefaultLightBackgroundImage)
                    .setValue(this.plugin.settings.DefaultLightBackgroundImage)
                    .onChange(async (value: string) => {
                        this.plugin.settings.DefaultLightBackgroundImage = value;
                        this.applySettingsUpdate();
                    }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Background Image in Dark Theme'))
            .setDesc(t('Set background image in dark theme. Set something like "Daily/one.png"'))
            .setTab(tabName)
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.DefaultDarkBackgroundImage)
                    .setValue(this.plugin.settings.DefaultDarkBackgroundImage)
                    .onChange(async (value: string) => {
                        this.plugin.settings.DefaultDarkBackgroundImage = value;
                        this.applySettingsUpdate();
                    }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Save Shared Image To Folder For Mobile'))
            .setDesc(t('Save image to folder for mobile. False by Default'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.AutoSaveWhenOnMobile).onChange(async (value) => {
                    this.plugin.settings.AutoSaveWhenOnMobile = value;
                    this.applySettingsUpdate();
                }),
            );
    }

    private saveDataSettings(tabName: string, memosContainerEl: HTMLElement) {
        new TabSetting(memosContainerEl, this)
            .setName(t('Default Memo Composition'))
            .setDesc(t('Set default memo composition, you should use {TIME} as "HH:mm" and {CONTENT} as content. "{TIME} {CONTENT}" by default'))
            .setTab(tabName)
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.DefaultMemoComposition)
                    .setValue(this.plugin.settings.DefaultMemoComposition)
                    .onChange(async (value) => {
                        this.plugin.settings.DefaultMemoComposition = value;
                        this.applySettingsUpdate();
                    }),
            );
    }

    private fetchDataSettings(tabName: string, memosContainerEl: HTMLElement) {
        let dropdown: DropdownComponent;

        new TabSetting(memosContainerEl, this)
            .setName(t("Use Which Plugin's Default Configuration"))
            .setDesc(t("Memos use the plugin's default configuration to fetch memos from daily, 'Daily' by default."))
            .setTab(tabName)
            .addDropdown(async (d: DropdownComponent) => {
                dropdown = d;
                dropdown.addOption('Daily', t('Daily'));
                dropdown.addOption('Periodic', 'Periodic');
                dropdown.setValue(this.plugin.settings.UseDailyOrPeriodic).onChange(async (value) => {
                    this.plugin.settings.UseDailyOrPeriodic = value;
                    this.applySettingsUpdate();
                });
            });

        new TabSetting(memosContainerEl, this)
            .setName(t('Allow Memos to Fetch Memo from Notes'))
            .setDesc(t('Use Memos to manage all memos in your notes, not only in daily notes. False by default'))
            .setTab(tabName)
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.FetchMemosFromNote).onChange(async (value) => {
                    this.plugin.settings.FetchMemosFromNote = value;
                    this.applySettingsUpdate();
                }),
            );

        new TabSetting(memosContainerEl, this)
            .setName(t('Fetch Memos From Particular Notes'))
            .setDesc(t('You can set any Dataview Query for memos to fetch it. All memos in those notes will show on list. "#memo" by default'))
            .setTab(tabName)
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
    }

    private customFileNameSettings(tabName: string, memosContainerEl: HTMLElement) {
        new TabSetting(memosContainerEl, this)
            .setName(t('File Name of Recycle Bin'))
            .setDesc(t("Set the filename for recycle bin. 'delete' By default"))
            .setTab(tabName)
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

        new TabSetting(memosContainerEl, this)
            .setName(t('File Name of Query File'))
            .setDesc(t("Set the filename for query file. 'query' By default"))
            .setTab(tabName)
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
}
