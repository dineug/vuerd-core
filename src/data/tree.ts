import {Tree} from '@/store/tree';
import {uuid, setParent} from '@/ts/util';

const tree: Tree = {
  id: uuid(),
  name: '',
  open: true,
  children: [
    {
      id: uuid(),
      name: 'vuerd-core',
      open: true,
      children: [
        {
          id: uuid(),
          name: '.git',
          open: false,
          children: [],
        },
        {
          id: uuid(),
          name: 'node_modules',
          open: false,
          children: [],
        },
        {
          id: uuid(),
          name: 'public',
          open: true,
          children: [
            {
              id: uuid(),
              name: 'static',
              open: false,
              children: [
                {
                  id: uuid(),
                  name: 'logo.png',
                },
              ],
            },
            {
              id: uuid(),
              name: 'index.html',
            },
          ],
        },
        {
          id: uuid(),
          name: '.gitignore',
        },
        {
          id: uuid(),
          name: 'vue.config.js',
        },
        {
          id: uuid(),
          name: 'package.json',
        },
        {
          id: uuid(),
          name: 'README.md',
        },
        {
          id: uuid(),
          name: 'yarn.lock',
        },
      ],
    },
  ],
};

export const dTree: Tree = setParent<Tree>(tree, tree.children);
