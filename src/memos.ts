import {WorkspaceLeaf, ItemView, HoverPopover, TFile} from 'obsidian';
import {MEMOS_VIEW_TYPE} from './constants';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import type MemosPlugin from './index';
import {dailyNotesService, memoService} from './services';
import {getDateFromFile} from 'obsidian-daily-notes-interface';

export class Memos extends ItemView {
  plugin: MemosPlugin;
  hoverPopover: HoverPopover | null;
  private memosComponent: React.ReactElement;

  constructor(leaf: WorkspaceLeaf, plugin: MemosPlugin) {
    super(leaf);
    this.plugin = plugin;

    // this.plugin.settings = null;
    // 	plugin.settings.subscribe((val:any) => {
    // 	this.plugin.settings = val;

    // 	// Refresh the calendar if settings change
    // 	if (this.memosComponent) {
    // 		useRefresh();
    // 	}
    // 	});
  }

  getDisplayText(): string {
    // TODO: Make this interactive: Either the active workspace or the local graph
    return 'Memos';
  }

  getIcon(): string {
    return 'Memos';
  }

  getViewType(): string {
    return MEMOS_VIEW_TYPE;
  }

  private onMemosSettingsUpdate(): void {
    memoService.clearMemos();
    memoService.fetchAllMemos();
  }

  private async onFileDeleted(file: TFile): Promise<void> {
    if (getDateFromFile(file, 'day')) {
      await dailyNotesService.getMyAllDailyNotes();
      memoService.clearMemos();
      memoService.fetchAllMemos();
    }
  }

  private async onFileModified(file: TFile): Promise<void> {
    const date = getDateFromFile(file, 'day');

    if (date && this.memosComponent) {
      // memoService.clearMemos();
      memoService.fetchAllMemos();
    }
  }

  private onFileCreated(file: TFile): void {
    if (this.app.workspace.layoutReady && this.memosComponent) {
      if (getDateFromFile(file, 'day')) {
        dailyNotesService.getMyAllDailyNotes();
        // memoService.clearMemos();
        memoService.fetchAllMemos();
      }
    }
  }

  async onOpen(): Promise<void> {
    this.onMemosSettingsUpdate = this.onMemosSettingsUpdate.bind(this);
    this.onFileCreated = this.onFileCreated.bind(this);
    this.onFileDeleted = this.onFileDeleted.bind(this);
    this.onFileModified = this.onFileModified.bind(this);

    this.registerEvent(
      this.plugin.app.workspace.on('layout-change', () => {
        if (!this.memosComponent) return;
        const leaves = this.app.workspace.getLeavesOfType(MEMOS_VIEW_TYPE);
        if (!(leaves.length > 0)) {
          return;
        }
        const leaf = leaves[0];
        const side = leaf.getRoot().side;
        let sidebar: HTMLElement;
        let page: HTMLElement;
        if (leaf.view.containerEl.querySelector('.memos-sidebar-wrapper')) {
          sidebar = leaf.view.containerEl.querySelector('.memos-sidebar-wrapper') as HTMLElement;
        } else {
          sidebar = leaf.view.containerEl.querySelector('.memos-sidebar-wrapper-display') as HTMLElement;
        }
        if (leaf.view.containerEl.querySelector('.content-wrapper')) {
          page = leaf.view.containerEl.querySelector('.content-wrapper') as HTMLElement;
        } else {
          page = leaf.view.containerEl.querySelector('.content-wrapper-padding-fix') as HTMLElement;
        }
        // const page = leaf.view.containerEl.querySelector('.content-wrapper') as HTMLElement;
        if (side !== undefined && (side === 'left' || side === 'right')) {
          if (!sidebar?.className.contains('memos-sidebar-wrapper-display') && page !== undefined) {
            sidebar.className = 'memos-sidebar-wrapper-display';
            page.className = 'content-wrapper-padding-fix';
          }
        } else {
          if (sidebar?.classList.contains('memos-sidebar-wrapper-display') && page !== undefined) {
            sidebar.className = 'memos-sidebar-wrapper';
            page.className = 'content-wrapper';
          }
        }
      }),
    );

    this.registerEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any>this.app.workspace).on('obsidian-memos:settings-updated', this.onMemosSettingsUpdate),
    );

    this.registerEvent(this.app.vault.on('create', this.onFileCreated));
    this.registerEvent(this.app.vault.on('delete', this.onFileDeleted));
    this.registerEvent(this.app.vault.on('modify', this.onFileModified));

    dailyNotesService.getApp(this.app);
    InsertAfter = this.plugin.settings.InsertAfter;
    UserName = this.plugin.settings.UserName;
    ProcessEntriesBelow = this.plugin.settings.ProcessEntriesBelow;
    SaveMemoButtonLabel = this.plugin.settings.SaveMemoButtonLabel;
    DefaultPrefix = this.plugin.settings.DefaultPrefix;
    InsertDateFormat = this.plugin.settings.InsertDateFormat;
    DefaultEditorLocation = this.plugin.settings.DefaultEditorLocation;
    UseButtonToShowEditor = this.plugin.settings.UseButtonToShowEditor;
    FocusOnEditor = this.plugin.settings.FocusOnEditor;
    OpenDailyMemosWithMemos = this.plugin.settings.OpenDailyMemosWithMemos;
    HideDoneTasks = this.plugin.settings.HideDoneTasks;
    ShareFooterStart = this.plugin.settings.ShareFooterStart;
    ShareFooterEnd = this.plugin.settings.ShareFooterEnd;
    OpenMemosAutomatically = this.plugin.settings.OpenMemosAutomatically;
    // EditorMaxHeight = this.plugin.settings.EditorMaxHeight;
    ShowTime = this.plugin.settings.ShowTime;
    ShowDate = this.plugin.settings.ShowDate;
    AddBlankLineWhenDate = this.plugin.settings.AddBlankLineWhenDate;
	AutoSaveWhenOnMobile = this.plugin.settings.AutoSaveWhenOnMobile;

    this.memosComponent = React.createElement(App);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReactDOM.render(this.memosComponent, (this as any).contentEl);
  }

  async onClose() {
    // Nothing to clean up.
  }
}

export let InsertAfter: string;
export let UserName: string;
export let ProcessEntriesBelow: string;
export let SaveMemoButtonLabel: string;
export let DefaultPrefix: string;
export let InsertDateFormat: string;
export let DefaultEditorLocation: string;
export let UseButtonToShowEditor: boolean;
export let FocusOnEditor: boolean;
export let OpenDailyMemosWithMemos: boolean;
export let HideDoneTasks: boolean;
export let ShareFooterStart: string;
export let ShareFooterEnd: string;
export let OpenMemosAutomatically: boolean;
// export let EditorMaxHeight: string;
export let ShowTime: boolean;
export let ShowDate: boolean;
export let AddBlankLineWhenDate: boolean;
export let AutoSaveWhenOnMobile: boolean;
