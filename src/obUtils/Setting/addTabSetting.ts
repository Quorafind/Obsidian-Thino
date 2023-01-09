import { Setting } from 'obsidian';
import { MemosSettingTab } from '../../memosSetting';

export default class TabSetting extends Setting {
    private settingTab: MemosSettingTab;
    private name: string;
    private desc: string;

    constructor(containerEl: HTMLElement, settingTab: MemosSettingTab) {
        super(containerEl);
        this.settingTab = settingTab;
    }

    setName(name: string): this {
        super.setName(name);
        this.name = name;
        return this;
    }

    setDesc(desc: string): this {
        super.setDesc(desc);
        this.desc = desc;
        return this;
    }

    setTab(tabName: string): this {
        this.settingTab.addSettingToMasterSettingsList(tabName, this.settingEl, this.name, this.desc);
        return this;
    }
}
