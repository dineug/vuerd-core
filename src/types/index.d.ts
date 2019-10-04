import _Vue, {Component} from 'vue';

export interface Tree {
  readonly id?: string;
  readonly parent?: Tree;
  readonly value?: string;
  name: string;
  open?: boolean;
  children?: Tree[];

  read?(path: string, id: string): Promise<string>;
}

export interface Editor {
  component: Component;
  scope: Array<string | RegExp>;
  exclude?: Array<string | RegExp>;
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

export declare class Command {
  editorAdd(editor: Editor): Command;
  themeAdd(theme: Theme): Command;
  iconAdd(icon: Icon): Command;
}

export interface Plugin {
  install(command: Command): void;
}

export declare function use(plugin: Plugin): void;

export type LogLevel = 'debug';

export interface Option {
  logLevel?: LogLevel;
}

export declare function install(Vue: typeof _Vue, option?: Option): void;
declare const _default: {
  install: typeof install;
  use: typeof use;
};

export default _default;
