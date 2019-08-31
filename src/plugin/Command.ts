import {Store} from 'vuex';
import pluginManagement from '@/plugin/PluginManagement';
import {createStore, Commit, State} from '@/plugin/store';
import {log} from '@/ts/util';
import {EditorOption} from '@/types';

export default class Command {
  private readonly store: Store<State>;

  constructor() {
    this.store = createStore();
    pluginManagement.add(this.store);
  }

  public editorAdd(option: EditorOption): Command {
    if (pluginManagement.isEditor(option.component)) {
      this.store.commit(Commit.editorAdd, option);
    } else {
      log.warn('Command editorAdd: component duplication');
    }
    return this;
  }
}
