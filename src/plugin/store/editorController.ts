import { State } from '../store'
import { Editor } from '@/types'
import viewStore, { View, Tab, TabView, Commit } from '@/store/view'
import { loaded } from './handler'
import { log } from '@/ts/util'
import pluginManagement from '@/plugin/PluginManagement'
import eventBus, { Bus } from '@/ts/EventBus'

export function editorAdd (state: State, editor: Editor) {
  log.debug('editorController editorAdd')
  state.editor = editor
}

export function editorLoad (state: State, payload: { view: View, tab: Tab }) {
  log.debug('editorController editorLoad')
  const {view, tab} = payload
  const tabView = tab as TabView
  tabView.view = view

  if (tabView.value === undefined) {
    const remote = pluginManagement.remote
    remote.findFileByPath(tabView.path).then((value) => {
      tabView.value = value
      if (state.editor) {
        loaded(state.editor, state.editorInstances, tabView)
      }
    }).catch((err) => {
      log.error(err)
      eventBus.$emit(Bus.ToastBar.start, {
        message: err.toString()
      })
      viewStore.commit(Commit.tabDelete, tab.id)
    })
  } else if (state.editor) {
    loaded(state.editor, state.editorInstances, tabView)
  }
}
