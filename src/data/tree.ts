import {Tree} from '@/store/tree';
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

async function read(path: string, id: string): Promise<string> {
  if (data[id]) {
    return data[id];
  } else {
    throw new Error('not found');
  }
}

export {
  read,
};

const init: Tree = {
  id: uuid(),
  name: '',
  open: true,
  parent: null,
  children: [],
};
export default init;
