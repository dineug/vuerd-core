import _Vue, { Component } from "vue";

export interface Editor {
  component: Component;
  scope: Array<string | RegExp>;
  exclude?: Array<string | RegExp>;
  option?: EditorOption;
}

export interface EditorOption {
  undoManager?: boolean;
  readme?: EditorReadme;
}

export interface EditorReadme {
  owner: string;
  repo: string;
}

export interface Theme {
  name: string;
  color: Color;
}

export interface Color {
  drop: string;
  sash: string;
  active: string;
  editor: string;
  titleBar: string;
  activityBar: string;
  statusbar: string;
  font: string;
  fontActive: string;
  contextmenu: string;
  contextmenuActive: string;
  sidebar: string;
  sidebarActive: string;
  tabBar: string;
  tab: string;
  tabActive: string;
}

export interface Icon {
  name: string;
  getFile?(name: string): string;
  getFolder?(name: string, open: boolean): string;
}

export interface Remote {
  name: string;
  findTreeBy(): Promise<Tree>;
  findFileByPath(path: string): Promise<string>;
  save(treeSaves: TreeSave[]): Promise<void>;
  deleteByPaths(paths: string[]): Promise<void>;
  move(treeMove: TreeMove): Promise<void>;
  option?: RemoteOption;
}

export interface RemoteOption {
  explorerContextmenu?: ExplorerContextmenu[];
  titleBarContextmenu?: TitleBarContextmenu[];
}

export interface ExplorerContextmenu {
  name: string;
  children?: ExplorerContextmenu[];
  execute?(selectPaths: string[]): void;
}

export interface TitleBarContextmenu {
  name: string;
  children?: TitleBarContextmenu[];
  execute?(): void;
}

export interface Tree {
  name: string;
  open?: boolean;
  children?: Tree[];
}

export interface TreeSave {
  oldPath: string | null;
  path: string;
  name: string;
  value?: string;
}

export interface TreeMove {
  fromPaths: string[];
  toPath: string;
}

export interface Command {
  editorAdd(editor: Editor): Command;
  themeAdd(theme: Theme): Command;
  iconAdd(icon: Icon): Command;
  remoteAdd(remote: Remote): Command;
}

export declare function install(Vue: typeof _Vue, option?: Option): void;

export interface Option {
  logLevel?: LogLevel;
}

export type LogLevel = "debug";

export interface Plugin<T> {
  install(command: Command, option?: T): void;
}
export declare function use<T>(plugin: Plugin<T>, option?: T): void;

declare const _default: {
  install: typeof install;
  use: typeof use;
};

export default _default;
