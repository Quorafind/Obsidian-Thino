import { WorkspaceLeaf, ItemView, HoverPopover } from "obsidian";
import { MEMOS_VIEW_TYPE } from "./constants";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import type MemosPlugin from "./index";
import { dailyNotesService } from "./services";

export class Memos extends ItemView {
  plugin: MemosPlugin;
  hoverPopover: HoverPopover | null;
  private reactComponent: React.ReactElement;

  constructor(leaf: WorkspaceLeaf, plugin: MemosPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getDisplayText(): string {
    // TODO: Make this interactive: Either the active workspace or the local graph
    return "Memos";
  }

  getIcon(): string {
    return "Calendar";
  }

  getViewType(): string {
    return MEMOS_VIEW_TYPE;
  }

  async onOpen(): Promise<void> {
    await this.plugin.loadSettings();
    dailyNotesService.getApp(this.app);
    InsertAfter = this.plugin.settings.InsertAfter;
    UserName = this.plugin.settings.UserName;
    ProcessEntriesBelow = this.plugin.settings.ProcessEntriesBelow;
    SaveMemoButtonLabel = this.plugin.settings.SaveMemoButtonLabel;

    this.reactComponent = React.createElement(App);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReactDOM.render(this.reactComponent, (this as any).contentEl);
  }

  async onClose() {
    // Nothing to clean up.
  }
}

export let InsertAfter: string;
export let UserName: string;
export let ProcessEntriesBelow: string;
export let SaveMemoButtonLabel: string;