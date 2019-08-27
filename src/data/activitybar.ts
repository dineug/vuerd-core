import activitybarStore, {ActivityMenu, Commit} from '@/store/activitybar';
import IconType from '@/models/IconType';
import {uuid} from '@/ts/util';

const explorer: ActivityMenu = {
  id: uuid(),
  icon: 'mdi-file-multiple',
  iconType: IconType.mdi,
  execute(): void {
    activitybarStore.commit(Commit.explorer, explorer);
  },
};
const init: ActivityMenu[] = [explorer];
export default init;
