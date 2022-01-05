import { Plugin, Notice, FileView } from "obsidian";
import { Memos } from "./memos";
import { MEMOS_VIEW_TYPE } from "./constants";
import addIcons from "./obComponents/customIcons";
import "./helpers/polyfill";
import "./less/global.less";
import { MemosSettingTab,DEFAULT_SETTINGS,MemosSettings } from "./setting";
import { appHasDailyNotesPluginLoaded } from "obsidian-daily-notes-interface";
import { editorInput } from "./components/Editor/Editor";
import showDailyMemoDiaryDialog from "./components/DailyMemoDiaryDialog";

// declare global {
//   interface Window {
//     app: App;
//     plugin: MemosPlugin;
//   }
// }

export default class MemosPlugin extends Plugin {
  public settings: MemosSettings;
  async onload(): Promise<void> {

    this.registerView(
      MEMOS_VIEW_TYPE,(leaf) => new Memos(leaf, this),
    );

    this.addSettingTab(new MemosSettingTab(this.app, this));
    await this.loadSettings();

    addIcons();
    this.addRibbonIcon('Memos', 'Memos', () => {
			new Notice('Open Memos Successfully');
      this.openMemos();
		});

    if(appHasDailyNotesPluginLoaded()){
      new Notice("Check if you opened Daily Notes Plugin")
    }

    this.addCommand({
      id: "open-memos",
      name: "Open Memos",
      callback: () => this.openMemos(),
      hotkeys: [],
    });

    this.addCommand({
      id: "focus-on-memos-editor",
      name: "Focus On Memos Editor",
      callback: () => editorInput.focus(),
      hotkeys: [],
    });

    this.addCommand({
      id: "show-daily-memo",
      name: "Show Daily Memo",
      callback: () => this.openDailyMemo(),
      hotkeys: [],
    });

    // this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
  }

  public async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(MEMOS_VIEW_TYPE);
    new Notice('Close Memos Successfully');
  }

  // onLayoutReady(): void {
  //   if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
  //     return;
  //   }
  //   this.app.workspace.getRightLeaf(false).setViewState({
  //     type: VIEW_TYPE,
  //     active: true,
  //   });
  // }
  async openDailyMemo() {
    const workspaceLeaves = this.app.workspace.getLeavesOfType(MEMOS_VIEW_TYPE);
    if(workspaceLeaves.length === 0){
      this.openMemos();
      showDailyMemoDiaryDialog();
    }else{
      showDailyMemoDiaryDialog();
    }
  }

  async openMemos() {
    const { view } = this.app.workspace.activeLeaf;
    const workspace = this.app.workspace;
    workspace.detachLeavesOfType(MEMOS_VIEW_TYPE);
    if (!(view instanceof FileView)) {
      await workspace.getLeaf(false).setViewState({type: MEMOS_VIEW_TYPE});
    }else{
      await workspace.getLeaf(true).setViewState({type: MEMOS_VIEW_TYPE});
    }
    workspace.revealLeaf(workspace.getLeavesOfType(MEMOS_VIEW_TYPE)[0]);
    // const viewType = view.getViewType();
    // let leaf;
    // if (!(view instanceof FileView)) {
    //   leaf = this.app.workspace.getLeaf(false);
    //   this.app.workspace.setActiveLeaf(leaf,true,true);
    // }else{
    //   leaf = this.app.workspace.getLeaf(true);
    //   this.app.workspace.setActiveLeaf(leaf,true,true);
    // }
    // const neovisView = new Memos(leaf, this);
    // await leaf.open(neovisView);
  }
}
