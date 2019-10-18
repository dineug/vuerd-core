import { State } from '../store'
import { Theme } from '@/types'
import { log } from '@/ts/util'

export function themeAdd (state: State, theme: Theme) {
  log.debug('themeController themeAdd')
  state.theme = theme
}
