import 'obsidian';
import { DataviewAPI } from 'obsidian-dataview';

declare module 'obsidian' {
  interface WorkspaceLeaf {
    width: number;
  }

  interface App {
    plugins: {
      getPlugin(name: string): any;
    };
  }

  interface MetadataCache {
    on(name: 'dataview:api-ready', callback: (api: DataviewAPI) => any, ctx?: any): EventRef;

    on(name: 'dataview:metadata-change', callback: (op: string, file: TFile) => any, ctx?: any): EventRef;
  }

  interface Workspace {
    on(name: 'receive-text-menu', callback: (menu: Menu, source: string) => any, ctx?: any): EventRef;
    on(name: 'receive-files-menu', callback: (menu: Menu, file: array) => any, ctx?: any): EventRef;
  }
}
