<template lang="pug">
  .title-bar(:style="titleBarStyle")
    ul
      li(
        v-for="menu in menus"
        :key="menu.id"
        @click="onExecute(menu)"
        @mouseover="onMouseover(menu)"
        @mouseenter="onMouseenter"
        @mouseleave="onMouseleave"
      ) {{ menu.name }}
    Contextmenu.contextmenu-title-bar(
      v-if="currentMenu && currentMenu.children"
      :menus="currentMenu.children"
      :x="contextmenuX"
      :y="contextmenuY"
    )
</template>

<script lang="ts">
import { SIZE_TITLEBAR_HEIGHT } from "@/ts/layout";
import themeStore, { State as ThemeState } from "@/store/theme";
import { Menu } from "@/store/contextmenu";
import pluginManagement from "@/plugin/PluginManagement";
import { log } from "@/ts/util";
import TitleBarMenuModel from "@/models/TitleBarMenuModel";
import { Component, Vue } from "vue-property-decorator";
import Contextmenu from "./Contextmenu.vue";

import { fromEvent, Observable, Subscription } from "rxjs";

@Component({
  components: {
    Contextmenu
  }
})
export default class TitleBar extends Vue {
  private contextmenuX: number = 0;
  private contextmenuY: number = SIZE_TITLEBAR_HEIGHT;
  private currentMenu: Menu<any> | null = null;

  private mousedown$: Observable<MouseEvent> = fromEvent<MouseEvent>(
    window,
    "mousedown"
  );
  private subMousedown!: Subscription;

  get titleBarStyle(): string {
    return `
    color: ${this.theme.font};
    background-color: ${this.theme.titleBar};
    `;
  }

  get theme(): ThemeState {
    return themeStore.state;
  }

  get menus(): Array<Menu<void>> {
    const list: Array<Menu<void>> = [];
    if (
      pluginManagement.remote &&
      pluginManagement.remote.option &&
      pluginManagement.remote.option.titleBarContextmenu
    ) {
      pluginManagement.remote.option.titleBarContextmenu.forEach(value => {
        list.push(new TitleBarMenuModel(value));
      });
    }
    return list;
  }

  // ==================== Event Handler ===================
  private onExecute(menu: Menu<void>) {
    log.debug("Contextmenu onExecute");
    if (!menu.children && menu.execute && typeof menu.execute === "function") {
      menu.execute();
    }
  }

  private onMouseover(menu: Menu<void>) {
    log.debug("TitleBar onMouseover");
    const index = this.menus.indexOf(menu);
    const ul = this.$el.childNodes[0];
    this.contextmenuX = 0;
    ul.childNodes.forEach((child: ChildNode, i: number) => {
      const li = child as HTMLElement;
      if (i < index) {
        this.contextmenuX += li.offsetWidth;
      }
    });
    this.currentMenu = menu;
  }

  private onMouseenter(event: MouseEvent) {
    const el = event.target as HTMLElement;
    el.style.color = this.theme.fontActive;
    el.style.backgroundColor = this.theme.contextmenu;
  }

  private onMouseleave(event: MouseEvent) {
    const el = event.target as HTMLElement;
    el.style.color = "";
    el.style.backgroundColor = "";
  }

  private onMousedown(event: MouseEvent) {
    log.debug("TitleBar onMousedown");
    if (event.target) {
      const el = event.target as HTMLElement;
      if (!el.closest(".title-bar") && !el.closest(".contextmenu-title-bar")) {
        this.currentMenu = null;
      }
    }
  }

  // ==================== Event Handler END ===================

  // ==================== Life Cycle ====================
  private mounted() {
    this.subMousedown = this.mousedown$.subscribe(this.onMousedown);
  }

  private destroyed() {
    this.subMousedown.unsubscribe();
  }
}
</script>

<style scoped lang="scss">
.title-bar {
  width: 100%;
  height: $size-title-bar-height;

  ul {
    li {
      height: $size-title-bar-height;
      font-size: $size-font + 2;
      box-sizing: border-box;
      padding: 5px 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
    }
  }
}

ul,
ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
