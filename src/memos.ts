import { debounce, HoverPopover, ItemView, Platform, TFile, WorkspaceLeaf } from 'obsidian';
import { MEMOS_VIEW_TYPE } from './constants';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import type MemosPlugin from './index';
import { dailyNotesService, globalStateService, memoService } from './services';
import { getDateFromFile } from 'obsidian-daily-notes-interface';

export class Memos extends ItemView {
  plugin: MemosPlugin;
  hoverPopover: HoverPopover | null;
  private memosComponent: React.ReactElement;

  constructor(leaf: WorkspaceLeaf, plugin: MemosPlugin) {
    super(leaf);
    this.plugin = plugin;
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
    console.log('debounce');
    if (globalStateService.getState().changedByMemos) {
      globalStateService.setChangedByMemos(false);
      return;
    }
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

  async handleResize() {
    const leaves = this.app.workspace.getLeavesOfType(MEMOS_VIEW_TYPE);
    if (leaves.length > 0) {
      const leaf = leaves[0];
      if (leaf.width > 875) {
        // hide the sidebar

        globalStateService.setIsMobileView(false);
        leaf.view.containerEl.classList.remove('mobile-view');
        globalStateService.setIsMobileView(leaf.width <= 875);
        return;
      }

      if (ShowLeftSideBar && !Platform.isMobile) {
        return;
      }

      globalStateService.setIsMobileView(true);
      leaf.view.containerEl.classList.add('mobile-view');
      globalStateService.setIsMobileView(leaf.width <= 875);
    }
  }

  async onOpen(): Promise<void> {
    this.onMemosSettingsUpdate = this.onMemosSettingsUpdate.bind(this);
    this.onFileCreated = this.onFileCreated.bind(this);
    this.onFileDeleted = this.onFileDeleted.bind(this);
    this.onFileModified = this.onFileModified.bind(this);

    this.registerEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any>this.app.workspace).on('obsidian-memos:settings-updated', this.onMemosSettingsUpdate),
    );

    this.registerEvent(this.app.vault.on('create', this.onFileCreated));
    this.registerEvent(this.app.vault.on('delete', this.onFileDeleted));
    this.registerEvent(this.app.vault.on('modify', debounce(this.onFileModified, 2000, true)));
    this.registerEvent(
      this.app.workspace.on('resize', () => {
        this.handleResize();
      }),
    );
    this.registerEvent(
      this.app.metadataCache.on('dataview:api-ready', () => {
        console.log('Dataview API ready');
      }),
    );
    // this.registerEvent(
    //   this.app.metadataCache.on('dataview:metadata-change', (_, file) => {
    //     if (!(file instanceof TFile)) {
    //       return;
    //     }
    //     const dataviewAPI = getAPI();
    //     if (getDateFromFile(file, 'day') === undefined || dataviewAPI.page(file.path) === undefined) {
    //       return;
    //     }
    //     getAPI().index.reload(file);
    //     memoService.fetchAllMemos();
    //   }),
    // );

    dailyNotesService.getApp(this.app);

    InsertAfter = this.plugin.settings.InsertAfter;
    UserName = this.plugin.settings.UserName;
    ProcessEntriesBelow = this.plugin.settings.ProcessEntriesBelow;
    SaveMemoButtonLabel = this.plugin.settings.SaveMemoButtonLabel;
    SaveMemoButtonIcon = this.plugin.settings.SaveMemoButtonIcon;
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
    QueryFileName = this.plugin.settings.QueryFileName;
    DeleteFileName = this.plugin.settings.DeleteFileName;
    UseVaultTags = this.plugin.settings.UseVaultTags;
    DefaultDarkBackgroundImage = this.plugin.settings.DefaultDarkBackgroundImage;
    DefaultLightBackgroundImage = this.plugin.settings.DefaultLightBackgroundImage;
    DefaultMemoComposition = this.plugin.settings.DefaultMemoComposition;
    ShowTaskLabel = this.plugin.settings.ShowTaskLabel;
    CommentOnMemos = this.plugin.settings.CommentOnMemos;
    CommentsInOriginalNotes = this.plugin.settings.CommentsInOriginalNotes;
    FetchMemosMark = this.plugin.settings.FetchMemosMark;
    FetchMemosFromNote = this.plugin.settings.FetchMemosFromNote;
    ShowCommentOnMemos = this.plugin.settings.ShowCommentOnMemos;
    UseDailyOrPeriodic = this.plugin.settings.UseDailyOrPeriodic;
    ShowLeftSideBar = this.plugin.settings.ShowLeftSideBar;

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
export let SaveMemoButtonIcon: string;
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
export let QueryFileName: string;
export let DeleteFileName: string;
export let UseVaultTags: boolean;
export let DefaultDarkBackgroundImage: string;
export let DefaultLightBackgroundImage: string;
export let DefaultMemoComposition: string;
export let ShowTaskLabel: boolean;
export let CommentOnMemos: boolean;
export let CommentsInOriginalNotes: boolean;
export let FetchMemosMark: string;
export let FetchMemosFromNote: boolean;
export let ShowCommentOnMemos: boolean;
export let UseDailyOrPeriodic: string;
export let ShowLeftSideBar: boolean;
