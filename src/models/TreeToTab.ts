import {Tree} from '@/store/tree';
import {Tab} from '@/store/view';
import {path} from '@/ts/recursionTree';

export class TreeToTab implements Tab {
  private tree: Tree;
  constructor(tree: Tree) {
    this.tree = tree;
  }
  get id(): string {
    return this.tree.id;
  }
  get name(): string {
    return this.tree.name;
  }
  set name(name: string) {
    this.tree.name = name;
  }
  get path(): string {
    return path(this.tree).join('/');
  }
}
