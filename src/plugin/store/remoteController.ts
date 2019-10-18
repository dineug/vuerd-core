import { State } from '../store'
import { Remote } from '@/types'
import { log } from '@/ts/util'

export function remoteAdd (state: State, remote: Remote) {
  log.debug('remoteController remoteAdd')
  state.remote = remote
}
