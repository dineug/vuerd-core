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
  views: [{
    id: uuid(),
    vertical: true,
    horizontal: false,
    width: 2000,
    height: 2000,
    widthRatio: 1,
    heightRatio: 1,
    views: [],
    tabs: dTabs,
  }],
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
