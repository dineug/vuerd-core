import View from '@/models/View';
import {uuid, randomInt} from '@/ts/util';

const rVertical = (): boolean => {
  return randomInt(0, 1) === 0;
};

const create = (): View => {
  const isVertical = rVertical();
  return {
    id: uuid(),
    vertical: isVertical,
    horizontal: !isVertical,
    width: 2000,
    height: 2000,
    widthRatio: 1,
    heightRatio: 1,
    views: [],
    tabs: dTabs,
  };
};

const createChild = (root: View) => {
  const stack: View[] = [];
  stack.push(root);
  for (let i = 0; i < 10; i++) {
    const view = create();
    stack[randomInt(0, stack.length - 1)].views.push(view);
    stack.push(view);
  }
};

// split view
export const dContainer = (): View => {
  const view: View = create();
  createChild(view);
  return view;
};

// tabs
export const dTabs = [
  {
    id: uuid(),
    name: 'index.ts',
    path: 'public/index.ts',
  },
  {
    id: uuid(),
    name: 'index.html',
    path: 'public/index.html',
  },
  {
    id: uuid(),
    name: 'index.js',
    path: 'public/index.js',
  },
  {
    id: uuid(),
    name: 'index.jsp',
    path: 'public/index.jsp',
  },
  {
    id: uuid(),
    name: '1.ts',
    path: 'public/1.ts',
  },
  {
    id: uuid(),
    name: '2.ts',
    path: 'public/2.ts',
  },
  {
    id: uuid(),
    name: '3.ts',
    path: 'public/3.ts',
  },
  {
    id: uuid(),
    name: '4.ts',
    path: 'public/5.ts',
  },
  {
    id: uuid(),
    name: '6.ts',
    path: 'public/6.ts',
  },
];

// view
export const dView = {
  id: uuid(),
  vertical: true,
  horizontal: false,
  width: 2000,
  height: 2000,
  widthRatio: 1,
  heightRatio: 1,
  views: [
    {
      id: uuid(),
      vertical: true,
      horizontal: false,
      width: 2000,
      height: 2000,
      widthRatio: 1,
      heightRatio: 1,
      views: [],
      tabs: [
        dTabs[2],
        dTabs[3],
        dTabs[4],
        dTabs[5],
        dTabs[6],
        dTabs[7],
        dTabs[8],
      ],
    },
    {
      id: uuid(),
      vertical: true,
      horizontal: false,
      width: 2000,
      height: 2000,
      widthRatio: 1,
      heightRatio: 1,
      views: [],
      tabs: [dTabs[0], dTabs[1]],
    },
  ],
  tabs: [],
};

/**
 * view init
 */
export default {
  id: uuid(),
  vertical: true,
  horizontal: false,
  width: 2000,
  height: 2000,
  widthRatio: 1,
  heightRatio: 1,
  views: [],
  tabs: [],
};
