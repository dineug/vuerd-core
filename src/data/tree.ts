import { Tree } from '@/store/tree'
import { uuid } from '@/ts/util'

const init: Tree = {
  id: uuid(),
  name: '',
  open: true,
  parent: null,
  children: []
}
export default init
