import { Notice, Platform, Plugin, TFile } from 'obsidian';
import { FocusOnEditor, Memos, OpenDailyMemosWithMemos } from './memos';
import { MEMOS_VIEW_TYPE } from './constants';
import addIcons from './obComponents/customIcons';
import { DEFAULT_SETTINGS, MemosSettings, MemosSettingTab } from './setting';
import showDailyMemoDiaryDialog from './components/DailyMemoDiaryDialog';
import { t } from './translations/helper';
import { memoService } from './services';

export default class MemosPlugin extends Plugin {
  public settings: MemosSettings;

  async onload(): Promise<void> {
    console.log('obsidian-memos loading...');
    await this.loadSettings();

    this.registerView(MEMOS_VIEW_TYPE, (leaf) => new Memos(leaf, this));

    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
    console.log(t('welcome'));
  }

  public async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(MEMOS_VIEW_TYPE);
    new Notice(t('Close Memos Successfully'));
  }

  registerMobileEvent() {
    this.registerEvent(
      this.app.workspace.on('receive-text-menu', (menu, source) => {
        menu.addItem((item: any) => {
          item
            .setIcon('popup-open')
            .setTitle(t('Insert as Memo'))
            .onClick(async () => {
              const newMemo = await memoService.createMemo(source, false);
              memoService.pushMemo(newMemo);
            });
        });
      }),
    );

    this.registerEvent(
      this.app.workspace.on('receive-files-menu', (menu, source) => {
        menu.addItem((item) => {
          item
            .setIcon('popup-open')
            .setTitle(t('Insert file as memo content'))
            .onClick(async () => {
              const fileName = source.map((file: TFile) => {
                return this.app.fileManager.generateMarkdownLink(file, file.path);
              });
              const newMemo = await memoService.createMemo(fileName.join('\n'), false);
              memoService.pushMemo(newMemo);
              // console.log(source, 'hello world');
            });
        });
      }),
    );
  }

  onRegisterProjectView(data: DataFrame, contentEl: HTMLElement) {
    contentEl.createEl('h1', { text: 'Debug' });

    const ul = contentEl.createEl('ul');

    for (const field of data.fields) {
      ul.createEl('li', {
        text: field.name,
      });
    }
  }

  async onLayoutReady(): Promise<void> {
    addIcons();
    this.addSettingTab(new MemosSettingTab(this.app, this));
    this.addCommand({
      id: 'open-memos',
      name: 'Open Memos',
      callback: () => this.openMemos(),
      hotkeys: [],
    });

    this.addCommand({
      id: 'focus-on-memos-editor',
      name: 'Focus On Memos Editor',
      callback: () => this.focusOnEditor(),
      hotkeys: [],
    });

    this.addCommand({
      id: 'show-daily-memo',
      name: 'Show Daily Memo',
      callback: () => this.openDailyMemo(),
      hotkeys: [],
    });

    this.addCommand({
      id: 'note-it',
      name: 'Note It',
      callback: () => this.noteIt(),
      hotkeys: [],
    });

    this.addCommand({
      id: 'focus-on-search-bar',
      name: 'Search It',
      callback: () => this.searchIt(),
      hotkeys: [],
    });

    this.addCommand({
      id: 'change-status',
      name: 'Change Status Between Task Or List',
      callback: () => this.changeStatus(),
      hotkeys: [],
    });

    this.addCommand({
      id: 'show-memos-in-popover',
      name: 'Show Memos in Popover',
      callback: () => this.showInPopover(),
      hotkeys: [],
    });

    if (Platform.isMobile) {
      this.registerMobileEvent();
    }

    this.addRibbonIcon('Memos', t('ribbonIconTitle'), () => {
      new Notice(t('Open Memos Successfully'));
      this.openMemos();
    });

    const leaves = this.app.workspace.getLeavesOfType(MEMOS_VIEW_TYPE);
    if (!(leaves.length > 0)) {
      return;
    }
    if (this.settings.FocusOnEditor) {
      const leaf = leaves[0];
      leaf.view.containerEl.querySelector('textarea').focus();
      return;
    }
    if (!this.settings.OpenMemosAutomatically) {
      return;
    }
    this.openMemos();
  }

  openDailyMemo() {
    const workspaceLeaves = this.app.workspace.getLeavesOfType(MEMOS_VIEW_TYPE);
    if (!OpenDailyMemosWithMemos) {
      showDailyMemoDiaryDialog();
      return;
    }

    if (workspaceLeaves.length > 0) {
      showDailyMemoDiaryDialog();
      return;
    }

    this.openMemos();
    showDailyMemoDiaryDialog();
  }

  async openMemos() {
    const workspace = this.app.workspace;
    workspace.detachLeavesOfType(MEMOS_VIEW_TYPE);
    // const leaf = workspace.getLeaf(
    //   !Platform.isMobile && workspace.activeLeaf && workspace.activeLeaf.view instanceof FileView,
    // );
    const leaf = workspace.getLeaf(false);
    await leaf.setViewState({ type: MEMOS_VIEW_TYPE });
    workspace.revealLeaf(leaf);

    if (!FocusOnEditor) {
      return;
    }

    if (leaf.view.containerEl.querySelector('textarea') !== undefined) {
      leaf.view.containerEl.querySelector('textarea').focus();
    }
  }

  searchIt() {
    const workspace = this.app.workspace;
    const leaves = workspace.getLeavesOfType(MEMOS_VIEW_TYPE);
    if (!(leaves.length > 0)) {
      this.openMemos();
      return;
      // this.openMemos();
    }

    const leaf = leaves[0];
    workspace.setActiveLeaf(leaf);
    (leaf.view.containerEl.querySelector('.search-bar-inputer .text-input') as HTMLElement).focus();
  }

  focusOnEditor() {
    const workspace = this.app.workspace;
    const leaves = workspace.getLeavesOfType(MEMOS_VIEW_TYPE);
    if (!(leaves.length > 0)) {
      this.openMemos();
      return;
      // this.openMemos();
    }

    const leaf = leaves[0];
    workspace.setActiveLeaf(leaf);
    leaf.view.containerEl.querySelector('textarea').focus();
  }

  noteIt() {
    const workspace = this.app.workspace;
    const leaves = workspace.getLeavesOfType(MEMOS_VIEW_TYPE);
    if (!(leaves.length > 0)) {
      new Notice(t('Please Open Memos First'));
      return;
      // this.openMemos();
    }

    const leaf = leaves[0];
    workspace.setActiveLeaf(leaf);
    leaf.view.containerEl.querySelector('.memo-editor .confirm-btn').click();
  }

  changeStatus() {
    const workspace = this.app.workspace;
    const leaves = workspace.getLeavesOfType(MEMOS_VIEW_TYPE);
    if (!(leaves.length > 0)) {
      new Notice(t('Please Open Memos First'));
      return;
      // this.openMemos();
    }

    const leaf = leaves[0];
    workspace.setActiveLeaf(leaf);
    leaf.view.containerEl.querySelector('.list-or-task').click();
  }

  async showInPopover() {
    const workspace = this.app.workspace;
    workspace.detachLeavesOfType(MEMOS_VIEW_TYPE);
    const leaf = await window.app.plugins.getPlugin('obsidian-hover-editor')?.spawnPopover();

    await leaf.setViewState({ type: MEMOS_VIEW_TYPE });
    workspace.revealLeaf(leaf);
    leaf.view.containerEl.classList.add('mobile-view');
    if (!FocusOnEditor) {
      return;
    }

    if (leaf.view.containerEl.querySelector('textarea') !== undefined) {
      leaf.view.containerEl.querySelector('textarea').focus();
    }
  }
}
