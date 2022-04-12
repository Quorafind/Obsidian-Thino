import 'obsidian';

declare module 'obsidian' {
  interface WorkspaceLeaf {
    width: number;
  }

  interface App {
    plugins: any;
  }

  interface Workspace {
    on(name: 'receive-text-menu', callback: (menu: Menu, source: string) => any, ctx?: any): EventRef;
    on(name: 'receive-files-menu', callback: (menu: Menu, file: array) => any, ctx?: any): EventRef;
  }
}
