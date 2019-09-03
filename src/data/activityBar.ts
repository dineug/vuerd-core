import activityBarStore, {ActivityMenu, Commit} from '@/store/activityBar';
import IconType from '@/models/IconType';
import {uuid} from '@/ts/util';

const init: ActivityMenu[] = [
  {
    id: uuid(),
    name: 'explorer',
    icon: 'mdi-file-multiple',
    iconType: IconType.mdi,
    execute(): void {
      activityBarStore.commit(Commit.explorer);
    },
  },
  {
    id: uuid(),
    name: 'plugin',
    icon: 'mdi-shape',
    iconType: IconType.mdi,
    execute(): void {
      activityBarStore.commit(Commit.plugin);
    },
  },
];
export default init;
