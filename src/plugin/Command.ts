import {Store} from 'vuex';
import pluginManagement from './PluginManagement';
import {createStore, Commit, State} from './store';
import {log} from '@/ts/util';
import {Editor, Theme, Icon} from '@/types';

export default class Command {
  private readonly store: Store<State>;

  constructor() {
    this.store = createStore();
    pluginManagement.add(this.store);
  }

  public editorAdd(editor: Editor): Command {
    if (pluginManagement.isEditor(editor.component)) {
      this.store.commit(Commit.editorAdd, editor);
    } else {
      log.warn(`Command editorAdd: component '${editor.component.name}' duplication`);
    }
    return this;
  }

  public themeAdd(theme: Theme): Command {
    this.store.commit(Commit.themeAdd, theme);
    return this;
  }

  public iconAdd(icon: Icon): Command {
    this.store.commit(Commit.iconAdd, icon);
    return this;
  }

}
