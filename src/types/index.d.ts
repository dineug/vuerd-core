import _Vue from 'vue';
import {Plugin, EditorOption} from '@/plugin/Command';

export interface Tree {
  readonly id?: string;
  readonly parent?: Tree;
  readonly value?: string;
  name: string;
  open?: boolean;
  children?: Tree[];

  read?(path: string, id: string): Promise<string>;
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
