import View from '@/model/View';
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

export default (): View => {
  const view: View = create();
  createChild(view);
  return view;
};
