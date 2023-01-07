import { debounce, HoverPopover, ItemView, Platform, TFile, WorkspaceLeaf } from 'obsidian';
import React from 'react';
import ReactDOM from 'react-dom/client';
import StrictApp from './App';
import type MemosPlugin from './memosIndex';
import { dailyNotesService, globalStateService, memoService } from './services';
import { getDateFromFile } from 'obsidian-daily-notes-interface';

export const MEMOS_VIEW_TYPE = 'memos_view';

export class Memos extends ItemView {
    plugin: MemosPlugin;
    hoverPopover: HoverPopover | null;
    private memosComponent: React.ReactElement;

    constructor(leaf: WorkspaceLeaf, plugin: MemosPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getDisplayText(): string {
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

            if (this.plugin.settings.ShowLeftSideBar && !Platform.isMobile) {
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

        const memosProps = {
            plugin: this.plugin,
            app: this.app,
        };

        ReactDOM.createRoot(this.containerEl).render(
            <React.StrictMode>
                <StrictApp {...memosProps} />
            </React.StrictMode>,
        );
    }

    async onClose() {
        // Nothing to clean up.
    }
}
