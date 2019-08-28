import {Tree} from '@/store/tree';
import {Tree as TreeModel} from '@/components';
import {uuid} from '@/ts/util';

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

function read(path: string, id: string) {
  return new Promise<string>((resolve, reject) => {
    if (data[path]) {
      resolve(data[path]);
    } else {
      reject();
    }
  });
}

const dataTree: TreeModel = {
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
              read,
            },
          ],
        },
        {
          name: 'index.html',
          read,
        },
      ],
    },
    {
      name: '.gitignore',
      read,
    },
    {
      name: 'README.md',
      read,
    },
    {
      name: 'package.json',
      read,
    },
    {
      name: 'vue.config.js',
      read,
    },
    {
      name: 'yarn.lock',
      read,
    },
  ],
};

export {
  dataTree,
};

const init: Tree = {
  id: uuid(),
  name: '',
  open: true,
  parent: null,
  children: [],
};
export default init;
