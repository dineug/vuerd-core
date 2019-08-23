import {Tree} from '@/store/tree';
import {uuid, setParent} from '@/ts/util';

const tree: Tree = {
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
          name: 'vue.config.js',
          parent: null,
        },
        {
          id: uuid(),
          name: 'package.json',
          parent: null,
        },
        {
          id: uuid(),
          name: 'README.md',
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

export const dTree: Tree = setParent<Tree>(tree, tree.children);
