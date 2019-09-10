import {Store} from 'vuex';
import pluginManagement from './PluginManagement';
import {createStore, Commit, State} from './store';
import {log} from '@/ts/util';
import {EditorOption, Theme} from '@/types';

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

  public themeAdd(theme: Theme): Command {
    this.store.commit(Commit.themeAdd, theme);
    return this;
  }
}
