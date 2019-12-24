<template lang="pug">
  .plugin(:style="`height: ${height}px;`")
    Title(name="Plugin")
    Title(name="Theme")
    ul.plugin-theme.scrollbar
      li(
        v-for="theme of themes"
        :key="theme.id"
        :style="themeActive().name === theme.name ? activeStyle : ''"
        @click="onTheme(theme)"
      ) {{theme.name}}
    Title(
      v-if="editors.length !== 0"
      name="Editor"
    )
    ul.plugin-editor.scrollbar(
      v-if="editors.length !== 0"
      :style="`height: ${editorHeight}px;`"
    )
      li(
        v-for="editor of editors"
        :key="editor.id"
        @click="onEditor(editor)"
      ) {{editor.name}}
</template>

<script lang="ts">
import { SIZE_STATUSBAR_HEIGHT, SIZE_TITLEBAR_HEIGHT } from "@/ts/layout";
import pluginManagement from "@/plugin/PluginManagement";
import { Theme, Editor } from "@/types";
import themeStore, { State as ThemeState } from "@/store/theme";
import viewStore, { Commit as ViewCommit } from "@/store/view";
import eventBus, { Bus } from "@/ts/EventBus";
import { log, uuid } from "@/ts/util";
import { Component, Vue } from "vue-property-decorator";
import Title from "./Title.vue";

import { fromEvent, Observable, Subscription } from "rxjs";

const TITLE_HEIGHT = 35;
const LIST_HEIGHT = 19.76;

@Component({
  components: {
    Title
  }
})
export default class Plugin extends Vue {
  private windowWidth: number = window.innerWidth;
  private windowHeight: number = window.innerHeight;
  private resize$: Observable<Event> = fromEvent(window, "resize");
  private subResize!: Subscription;

  get height(): number {
    return this.windowHeight - SIZE_TITLEBAR_HEIGHT - SIZE_STATUSBAR_HEIGHT;
  }

  get editorHeight(): number {
    return (
      this.windowHeight -
      TITLE_HEIGHT * 3 -
      SIZE_TITLEBAR_HEIGHT -
      SIZE_STATUSBAR_HEIGHT -
      this.themes.length * LIST_HEIGHT
    );
  }

  get themeState(): ThemeState {
    return themeStore.state;
  }

  get themes(): Theme[] {
    return pluginManagement.themes;
  }

  get activeStyle(): string {
    return `
        color: ${this.themeState.fontActive};
        background-color: ${this.themeState.sidebarActive};
      `;
  }

  get editors(): Editor[] {
    const editors = pluginManagement.editors;
    const reEditors: Editor[] = [];
    editors.forEach(editor => {
      if (
        editor.editor &&
        editor.editor.option &&
        editor.editor.option.readme
      ) {
        reEditors.push(editor.editor);
      }
    });
    return reEditors;
  }

  private themeActive(): Theme {
    return pluginManagement.theme;
  }

  // ==================== Event Handler ===================
  private onTheme(theme: Theme) {
    log.debug("Plugin onTheme");
    pluginManagement.themeLoad(theme.name);
    eventBus.$emit(Bus.VuerdCore.changeTheme);
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  private onEditor(editor: Editor) {
    if (editor && editor.option && editor.option.readme) {
      fetch(
        `https://api.github.com/repos/${editor.option.readme.owner}/${editor.option.readme.repo}/readme`
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`HTTP Statue Code: ${response.status}`);
        })
        .then(data => {
          viewStore.commit(ViewCommit.tabAddPreviewStart, {
            id: uuid(),
            name: `${editor.component.name}.README`,
            parent: null,
            value: atob(data.content)
          });
        })
        .catch(err => {
          log.error(err);
          eventBus.$emit(Bus.ToastBar.start, {
            message: err.toString()
          });
        });
    }
  }

  private onResize() {
    log.debug("Plugin onResize");
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }
  // ==================== Event Handler END ===================

  // ==================== Life Cycle ====================
  private mounted() {
    this.subResize = this.resize$.subscribe(this.onResize);
  }

  private destroyed() {
    this.subResize.unsubscribe();
  }
  // ==================== Life Cycle END ====================
}
</script>

<style scoped lang="scss">
.plugin {
  height: 100%;

  ul {
    li {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: $size-font + 2;
      cursor: pointer;
      padding: 1px 0 1px 20px;
    }
  }

  .plugin-theme {
    overflow-y: auto;
    max-height: 300px;
  }

  .plugin-editor {
    overflow-y: auto;
  }
}

ul,
ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
