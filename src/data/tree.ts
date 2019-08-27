import {Tree} from '@/store/tree';
import {uuid, setParent} from '@/ts/util';

const dataTree: Tree = {
  id: uuid(),
  name: '',
  open: true,
  parent: null,
  children: [
    {
      id: uuid(),
      name: 'vuerd-core',
      open: true,
      parent: null,
      children: [
        {
          id: uuid(),
          name: '.git',
          open: false,
          parent: null,
          children: [],
        },
        {
          id: uuid(),
          name: 'node_modules',
          open: false,
          parent: null,
          children: [],
        },
        {
          id: uuid(),
          name: 'public',
          open: true,
          parent: null,
          children: [
            {
              id: uuid(),
              name: 'static',
              open: false,
              parent: null,
              children: [
                {
                  id: uuid(),
                  name: 'logo.png',
                  parent: null,
                },
              ],
            },
            {
              id: uuid(),
              name: 'index.html',
              parent: null,
            },
          ],
        },
        {
          id: uuid(),
          name: '.gitignore',
          parent: null,
        },
        {
          id: uuid(),
          name: 'README.md',
          parent: null,
        },
        {
          id: uuid(),
          name: 'package.json',
          parent: null,
        },
        {
          id: uuid(),
          name: 'vue.config.js',
          parent: null,
        },
        {
          id: uuid(),
          name: 'yarn.lock',
          parent: null,
        },
      ],
    },
  ],
};
setParent<Tree>(dataTree, dataTree.children);

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
