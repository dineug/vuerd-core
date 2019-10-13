import {Tree} from '@/store/tree';
import {log, uuid} from '@/ts/util';
import {Tree as TreeModel, TreeMove, TreeSave} from '@/types';

function randomStr(length: number) {
  const buffer = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const size = characters.length;
  for (let i = 0; i < length; i++) {
    buffer.push(characters.charAt(Math.floor(Math.random() * size)));
  }
  return buffer.join('');
}

const data = new Proxy<any>({}, {
  get(target: any, p: string | number | symbol, receiver: any): any {
    if (target[p]) {
      return target[p];
    } else {
      target[p] = randomStr(1000);
      return target[p];
    }
  },
});

async function findFileByPath(path: string): Promise<string> {
  if (path === 'vuerd-core/public/static/logo.png') {
    return 'https://camo.githubusercontent.com/5e5ea0e4e9840bff621382c9db2ed891cb393d31/68747470733a2f2f76756572642e6769746875622e696f2f76756572642d66726f6e742f766572642e706e67';
  } else if (path === 'vuerd-core/public/static/mov_bbb.mp4') {
    return 'https://www.w3schools.com/html/mov_bbb.mp4';
  } else if (path === 'flower.mp4') {
    return 'https://interactive-examples.mdn.mozilla.net/media/examples/flower.mp4';
  } else if (data[path]) {
    return data[path];
  } else {
    throw new Error('not found');
  }
}

async function findTreeBy(): Promise<TreeModel> {
  return {
    name: 'vuerd-core',
    open: true,
    children: [
      {
        name: '.git',
        open: false,
        children: [],
      },
      {
        name: 'node_modules',
        open: false,
        children: [],
      },
      {
        name: 'public',
        open: true,
        children: [
          {
            name: 'static',
            open: false,
            children: [
              {
                name: 'logo.png',
              },
              {
                name: 'mov_bbb.mp4',
              },
              {
                name: 'flower.mp4',
              },
            ],
          },
          {
            name: 'index.html',
          },
        ],
      },
      {
        name: '.gitignore',
      },
      {
        name: 'README.md',
      },
      {
        name: 'package.json',
      },
      {
        name: 'vue.config.js',
      },
      {
        name: 'yarn.lock',
      },
    ],
  } as TreeModel;
}

async function save(treeSave: TreeSave): Promise<void> {
  log.debug(`tree save: ${treeSave}`);
}

async function deleteBy(path: string): Promise<void> {
  log.debug(`tree deleteBy: ${path}`);
}

async function move(treeMove: TreeMove): Promise<void> {
  log.debug(`tree move: ${treeMove}`);
}

export {
  findTreeBy,
  findFileByPath,
  save,
  deleteBy,
  move,
};

const init: Tree = {
  id: uuid(),
  name: '',
  open: true,
  parent: null,
  children: [],
};
export default init;
