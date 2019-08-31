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

export interface Plugin {
  install(command: Command): void;
}

export interface EditorOption {
  component: Component;
  scope: Array<string | RegExp>;
  exclude?: Array<string | RegExp>;
}

export declare class Command {
  editorAdd(option: EditorOption): Command;
}

export declare function use(plugin: Plugin): void;

export declare function install(Vue: typeof _Vue): void;
declare const _default: {
  install: typeof install;
  use: typeof use;
};

export default _default;
