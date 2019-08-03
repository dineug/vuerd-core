import Tree from '@/models/Tree';
import {uuid, randomInt} from '@/ts/util';

const trees: Tree[] = [
  {
    id: uuid(),
    name: '.git',
    children: [],
  },
  {
    id: uuid(),
    name: 'node_modules',
    children: [],
  },
  {
    id: uuid(),
    name: 'public',
    children: [
      {
        id: uuid(),
        name: 'static',
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
];

const setParent = (children: Tree[], parent?: Tree): Tree[] => {
  children.forEach((tree: Tree) => {
    if (parent) {
      tree.parent = parent;
    }
    if (tree.children && tree.children.length !== 0) {
      setParent(tree.children, tree);
    }
  });
  return children;
};

export const dTrees: Tree[] = setParent(trees);
