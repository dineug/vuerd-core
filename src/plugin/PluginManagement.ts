import {Component} from 'vue';
import {Store} from 'vuex';
import {Commit, State} from './store';
import {View, Tab} from '@/store/view';
import {getEditor} from './store/handler';
import {Theme} from '@/types';
import themeStore, {Commit as ThemeCommit} from '@/store/theme';

class PluginManagement {
  private plugins: Array<Store<State>> = [];
  private theme: Theme | null = null;

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

  public themeLoad(theme: Theme) {
    this.theme = theme;
    themeStore.commit(ThemeCommit.theme, theme);
    const editors = this.editors();
    editors.forEach((editor) => {
      editor.editors.forEach((value) => {
        value.node.$data.color = themeStore.getters.color;
      });
    });
  }

  public themes(): Theme[] {
    const list: Theme[] = [];
    this.plugins.forEach((plugin) => {
      if (plugin.state.theme) {
        list.push(plugin.state.theme);
      }
    });
    return list;
  }

  public currentTheme(): Theme | null {
    return this.theme;
  }

  public editors(): State[] {
    const list: State[] = [];
    this.plugins.forEach((plugin) => {
      if (plugin.state.component) {
        list.push(plugin.state);
      }
    });
    return list;
  }

}

export default new PluginManagement();