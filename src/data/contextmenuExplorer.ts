import {Menu} from '@/store/contextmenu';
import treeStore, {TreeSelect, Commit} from '@/store/tree';
import {uuid} from '@/ts/util';

const init: Array<Menu<TreeSelect>> = [
  {
    id: uuid(),
    name: '새 파일',
    execute(tree: TreeSelect | null): void {
      treeStore.commit(Commit.fileCreateStart, tree);
    },
  },
  {
    id: uuid(),
    name: '새 폴더',
    execute(tree: TreeSelect | null): void {
      treeStore.commit(Commit.folderCreateStart, tree);
    },
  },
];
export default init;
