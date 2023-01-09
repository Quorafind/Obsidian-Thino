import MemosPlugin from '../../memosIndex';
import { SearchComponent, setIcon, Setting } from 'obsidian';
import { t } from '../../translations/helper';

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

class tabModeSetting {
    private plugin: MemosPlugin;
    private tabs: Record<string, string>;
    private tabContent: Map<string, TabContentInfo> = new Map<string, TabContentInfo>();

    private selectedTab: string;
    private containerEl: HTMLElement;
    private navigateEl: HTMLElement;
    private settingsEl: HTMLElement;

    private searchComponent: SearchComponent;
    private searchSettingInfo: Map<string, settingSearchInfo[]> = new Map();
    private searchZeroState: HTMLDivElement;

    private settingTitle: string | undefined;

    constructor(plugin: MemosPlugin) {
        this.plugin = plugin;
    }

    protected addTab(name: string, icon: string) {
        this.tabs[name] = icon;
    }

    protected setDefaultTab(name: string) {
        this.selectedTab = name;
    }

    addTabHeader() {
        const navContainer = this.containerEl.createEl('nav', { cls: 'memos-setting-header' });
        this.navigateEl = navContainer.createDiv('memos-setting-tab-group');
        this.settingsEl = this.containerEl.createDiv('memos-setting-content');
    }

    addTabContent(name: string) {}

    generateSearchBar(containerEl: HTMLElement) {
        // based on https://github.com/valentine195/obsidian-settings-search/blob/master/src/main.ts#L294-L308
        const searchSetting = new Setting(containerEl);
        searchSetting.settingEl.style.border = 'none';
        searchSetting.addSearch((s: SearchComponent) => {
            this.searchComponent = s;
        });

        this.searchComponent.setPlaceholder(t('Search all settings'));

        this.searchComponent.inputEl.oninput = () => {
            for (const tabInfo of this.tabContent) {
                const tab = tabInfo[1];
                tab.navButton.removeClass('memos-navigation-item-selected');
                (tab.content as HTMLElement).show();
                (tab.heading as HTMLElement).show();

                const searchVal = this.searchComponent.getValue();
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

        this.searchComponent.inputEl.onblur = () => {
            this.navigateEl.removeClass('memos-setting-searching');
        };

        this.searchComponent.onChange((value: string) => {
            if (value === '') {
                this.navigateEl.children[0].dispatchEvent(new PointerEvent('click'));
            }
            this.searchSettings(value.toLowerCase());
        });
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

    createTabAndContent(name: string, navigateEl: HTMLElement, containerEl: HTMLElement, generateTabContent?: (el: HTMLElement, tabName: string) => void) {
        const displayTabContent = this.selectedTab === name;
        const tabEl = navigateEl.createDiv('memos-navigation-item');

        const tabClass = 'memos-desktop';
        tabEl.addClass(tabClass);

        setIcon(tabEl.createEl('div', { cls: 'memos-navigation-item-icon' }), this.tabs[name]);
        // @ts-ignore
        tabEl.createSpan().setText(t(tabName));

        tabEl.onclick = () => {
            if (this.selectedTab == name) {
                return;
            }

            tabEl.addClass('memos-navigation-item-selected');
            const tab = this.tabContent.get(name);
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
                    if (name !== tabInfo[0]) {
                        (tab.content as HTMLElement).hide();
                    }
                }
            }

            this.selectedTab = name;
        };

        const tabContent = containerEl.createDiv('memos-tab-settings');

        const tabHeader = tabContent.createEl('h2', { cls: 'memos-setting-heading', text: name + ' Settings' });
        (tabHeader as HTMLElement).hide();

        tabContent.id = name.toLowerCase().replace(' ', '-');
        if (!displayTabContent) {
            (tabContent as HTMLElement).hide();
        } else {
            tabEl.addClass('memos-navigation-item-selected');
        }

        if (generateTabContent) {
            generateTabContent(tabContent, name);
        }

        this.tabContent.set(name, { content: tabContent, heading: tabHeader, navButton: tabEl });
    }

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
}
