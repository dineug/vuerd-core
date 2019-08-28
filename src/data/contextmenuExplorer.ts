import {Menu} from '@/store/contextmenu';
import treeStore, {TreeSelect, Commit} from '@/store/tree';
import {lastSelect} from '@/store/tree/treeHandler';
import {eventBus, uuid} from '@/ts/util';
import EventBus from '@/models/EventBus';

const init: Array<Menu<TreeSelect[]>> = [
  {
    id: uuid(),
    name: '새 파일',
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
    name: '새 폴더',
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
    name: '이름 바꾸기',
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
    name: '삭제',
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
        eventBus.$emit(EventBus.VuerdCore.changeTree);
      }
    },
    option: {
      selectOnly: true,
    },
  },
];
export default init;
