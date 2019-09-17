import {Component} from 'vue';
import {Store} from 'vuex';
import {Commit, State} from './store';
import {View, Tab} from '@/store/view';
import {getEditor, getDataset} from './store/handler';
import {Theme} from '@/types';
import themeStore, {Commit as ThemeCommit} from '@/store/theme';
import {log} from '@/ts/util';

class PluginManagement {
  private plugins: Array<Store<State>> = [];
  private theme: Theme | null = null;

  public add(store: Store<State>) {
    log.debug('PluginManagement add');
    this.plugins.push(store);
  }

  public editorLoad(view: View, tab: Tab) {
    log.debug('PluginManagement editorLoad');
    const editor = getEditor(tab.name, this.plugins);
    editor.commit(Commit.editorLoad, {
      view,
      tab,
    });
    this.editorResize();
  }

  public isEditor(component: Component): boolean {
    log.debug('PluginManagement isEditor');
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
    log.debug('PluginManagement themeLoad');
    this.theme = theme;
    themeStore.commit(ThemeCommit.theme, theme);
    const editors = this.editors();
    editors.forEach((editor) => {
      editor.editors.forEach((value) => {
        value.parent.$data.color = themeStore.getters.color;
      });
    });
  }

  public themes(): Theme[] {
    log.debug('PluginManagement themes');
    const list: Theme[] = [];
    this.plugins.forEach((plugin) => {
      if (plugin.state.theme) {
        list.push(plugin.state.theme);
      }
    });
    return list;
  }

  public currentTheme(): Theme | null {
    log.debug('PluginManagement currentTheme');
    return this.theme;
  }

  public editors(): State[] {
    log.debug('PluginManagement editors');
    const list: State[] = [];
    this.plugins.forEach((plugin) => {
      if (plugin.state.component) {
        list.push(plugin.state);
      }
    });
    return list;
  }

  public editorResize() {
    log.debug('PluginManagement editorResize');
    const list = this.editors();
    list.forEach((value) => {
      value.editors.forEach((editor) => {
        const selector = `#editor-${editor.tab.view.id}`;
        const dataset = getDataset(selector);
        if (dataset) {
          editor.parent.$data.width = dataset.width;
          editor.parent.$data.height = dataset.height;
        }
      });
    });
  }

  public editorFocusStart(view: View) {
    log.debug('PluginManagement editorFocusStart');
    const list = this.editors();
    let result = false;
    for (const value of list) {
      for (const editor of value.editors) {
        if (editor.tab.view.id === view.id) {
          editor.parent.$data.focus = true;
          result = true;
          break;
        }
      }
      if (result) {
        break;
      }
    }
  }

  public editorFocusEnd() {
    log.debug('PluginManagement editorFocusEnd');
    const list = this.editors();
    list.forEach((value) => {
      value.editors.forEach((editor) => editor.parent.$data.focus = false);
    });
  }

}

export default new PluginManagement();
