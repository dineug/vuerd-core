import Vue from "vue";
import VuerdCore from "@/components";
import { Command, Tree, TreeMove, TreeSave } from "@/types";
import { log } from "@/ts/util";

const dataList: Array<{ path: string; value: string }> = [
  {
    path: "vuerd-core/public/static/logo.png",
    value:
      "https://camo.githubusercontent.com/5e5ea0e4e9840bff621382c9db2ed891cb393d31/68747470733a2f2f76756572642e6769746875622e696f2f76756572642d66726f6e742f766572642e706e67"
  },
  {
    path: "vuerd-core/public/static/mov_bbb.mp4",
    value: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    path: "vuerd-core/public/static/flower.mp4",
    value:
      "https://interactive-examples.mdn.mozilla.net/media/examples/flower.mp4"
  }
];

async function findFileByPath(path: string): Promise<string> {
  let value = "";
  for (const data of dataList) {
    if (data.path === path) {
      value = data.value;
      break;
    }
  }
  return value;
}

async function findTreeBy(): Promise<Tree> {
  return {
    name: "vuerd-core",
    open: true,
    children: [
      {
        name: ".git",
        open: false,
        children: []
      },
      {
        name: "node_modules",
        open: false,
        children: []
      },
      {
        name: "public",
        open: true,
        children: [
          {
            name: "static",
            open: false,
            children: [
              {
                name: "logo.png"
              },
              {
                name: "mov_bbb.mp4"
              },
              {
                name: "flower.mp4"
              }
            ]
          },
          {
            name: "index.html"
          }
        ]
      },
      {
        name: ".gitignore"
      },
      {
        name: "README.md"
      },
      {
        name: "package.json"
      },
      {
        name: "vue.config.js"
      },
      {
        name: "yarn.lock"
      }
    ]
  } as Tree;
}

async function save(treeSaves: TreeSave[]): Promise<void> {
  log.debug(`tree save`, treeSaves);
}

async function deleteByPaths(paths: string[]): Promise<void> {
  log.debug(`tree deleteBy: ${paths}`);
}

async function move(treeMove: TreeMove): Promise<void> {
  log.debug(`tree move`, treeMove);
}

VuerdCore.use({
  install(command: Command): void {
    command.remoteAdd({
      name: "vuerd",
      findTreeBy,
      findFileByPath,
      save,
      deleteByPaths,
      move
    });
  }
});

Vue.use(VuerdCore);
