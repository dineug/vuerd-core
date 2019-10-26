import { Menu } from "@/store/contextmenu";
import treeStore, { TreeSelect, Commit } from "@/store/tree";
import { lastSelect, selectParentTrees, path } from "@/store/tree/treeHelper";
import { log, uuid } from "@/ts/util";
import pluginManagement from "@/plugin/PluginManagement";
import eventBus, { Bus } from "@/ts/EventBus";

export const enum MenuType {
  explorer = "explorer"
}

const init: Array<Menu<TreeSelect[]>> = [
  {
    id: uuid(),
    name: "New File",
    type: MenuType.explorer,
    execute(trees?: TreeSelect[]): void {
      let tree: TreeSelect | null = null;
      if (trees) {
        tree = lastSelect(trees);
      }
      treeStore.commit(Commit.fileCreateStart, tree);
    }
  },
  {
    id: uuid(),
    name: "New Folder",
    type: MenuType.explorer,
    execute(trees?: TreeSelect[]): void {
      let tree: TreeSelect | null = null;
      if (trees) {
        tree = lastSelect(trees);
      }
      treeStore.commit(Commit.folderCreateStart, tree);
    }
  },
  {
    id: uuid(),
    name: "Rename",
    type: MenuType.explorer,
    keymap: "F2",
    execute(trees?: TreeSelect[]): void {
      let tree: TreeSelect | null = null;
      if (trees) {
        tree = lastSelect(trees);
      }
      treeStore.commit(Commit.fileRenameStart, tree);
    },
    option: {
      selectOnly: true
    }
  },
  {
    id: uuid(),
    name: "Delete",
    type: MenuType.explorer,
    keymap: "Delete",
    execute(trees?: TreeSelect[]): void {
      if (trees) {
        if (window.confirm("Are you sure you want to delete it?")) {
          const reTrees = selectParentTrees(trees);
          const paths: string[] = [];
          reTrees.forEach((tree: TreeSelect) => paths.push(path(tree)));
          pluginManagement.remote
            .deleteByPaths(paths)
            .then(() => {
              reTrees.forEach((tree: TreeSelect) => {
                if (tree.children) {
                  treeStore.commit(Commit.folderDelete, tree);
                } else {
                  treeStore.commit(Commit.fileDelete, tree);
                }
              });
            })
            .catch(err => {
              log.error(err);
              eventBus.$emit(Bus.ToastBar.start, {
                message: err.toString()
              });
            });
        }
      }
    },
    option: {
      selectOnly: true
    }
  }
];

export default init;
