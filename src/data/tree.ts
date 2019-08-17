import {Tree} from '@/store/tree';
import {uuid, setParent} from '@/ts/util';

const tree: Tree = {
  id: uuid(),
  name: '',
  folderOpen: true,
  children: [
    {
      id: uuid(),
      name: 'vuerd-core',
      folderOpen: true,
      children: [
        {
          id: uuid(),
          name: '.git',
          folderOpen: false,
          children: [],
        },
        {
          id: uuid(),
          name: 'node_modules',
          folderOpen: false,
          children: [],
        },
        {
          id: uuid(),
          name: 'public',
          folderOpen: true,
          children: [
            {
              id: uuid(),
              name: 'static',
              folderOpen: false,
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
