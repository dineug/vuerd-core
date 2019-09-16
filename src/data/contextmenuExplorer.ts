import {Menu} from '@/store/contextmenu';
import treeStore, {TreeSelect, Commit} from '@/store/tree';
import {lastSelect} from '@/store/tree/treeHandler';
import {uuid} from '@/ts/util';
import eventBus, {Bus} from '@/ts/EventBus';

const init: Array<Menu<TreeSelect[]>> = [
  {
    id: uuid(),
    name: 'New File',
    execute(trees: TreeSelect[] | null): void {
      let tree: TreeSelect | null = null;
      if (trees) {
        tree = lastSelect(trees);
      }
      treeStore.commit(Commit.fileCreateStart, tree);
    },
  },
  {
    id: uuid(),
    name: 'New Folder',
    execute(trees: TreeSelect[] | null): void {
      let tree: TreeSelect | null = null;
      if (trees) {
        tree = lastSelect(trees);
      }
      treeStore.commit(Commit.folderCreateStart, tree);
    },
  },
  {
    id: uuid(),
    name: 'Rename',
    keymap: 'F2',
    execute(trees: TreeSelect[] | null): void {
      let tree: TreeSelect | null = null;
      if (trees) {
        tree = lastSelect(trees);
      }
      treeStore.commit(Commit.fileRenameStart, tree);
    },
    option: {
      selectOnly: true,
    },
  },
  {
    id: uuid(),
    name: 'Delete',
    keymap: 'Delete',
    execute(trees: TreeSelect[] | null): void {
      if (trees) {
        trees.forEach((tree: TreeSelect) => {
          if (tree.children) {
            treeStore.commit(Commit.folderDelete, tree);
          } else {
            treeStore.commit(Commit.fileDelete, tree);
          }
        });
        eventBus.$emit(Bus.VuerdCore.changeTree);
      }
    },
    option: {
      selectOnly: true,
    },
  },
];
export default init;
