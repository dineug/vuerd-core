import {Component} from 'vue';
import {Store} from 'vuex';
import {Commit, State} from './store';
import {View, Tab} from '@/store/view';
import {getEditor} from './store/handler';
import EventBus from '@/models/EventBus';
import {eventBus} from '@/ts/util';

class PluginManagement {
  private readonly plugins: Array<Store<State>> = [];

  public add(store: Store<State>) {
    this.plugins.push(store);
  }

  public editorLoad(view: View, tab: Tab) {
    const editor = getEditor(tab.name, this.plugins);
    editor.commit(Commit.editorLoad, {
      view,
      tab,
    });
  }

  public isEditor(component: Component): boolean {
    let result = true;
    for (const value of this.plugins) {
      if (value.state.component && value.state.component.name === component.name) {
        result = false;
        break;
      }
    }
    return result;
  }

}

export default new PluginManagement();
