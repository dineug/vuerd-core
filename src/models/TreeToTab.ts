import {Tree} from '@/store/tree';
import {Tab} from '@/store/view';
import {path} from '@/store/tree/treeHelper';

export default class TreeToTab implements Tab {
  public active: boolean;
  private tree: Tree;
  constructor(tree: Tree) {
    this.tree = tree;
    this.active = false;
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
  get value(): string | undefined {
    return this.tree.value;
  }
  set value(value: string | undefined) {
    if (value) {
      this.tree.value = value;
    }
  }
  get path(): string {
    return path(this.tree);
  }
  public setTree(tree: Tree) {
    this.tree = tree;
  }
  get read() {
    return this.tree.read;
  }
}
