<template lang="pug">
  .contextmenu
    ul(:style="`top: ${y}px; left: ${x}px; background-color: ${theme.contextmenu};`" ref="ul")
      li(
        v-for="menu in getMenus"
        :key="menu.id"
        @click="onExecute(menu)"
        @mouseover="onMouseover(menu)"
        @mouseenter="onMouseenter"
        @mouseleave="onMouseleave"
      )
        span.name {{menu.name}}
        span.keymap {{menu.keymap}}
        span.arrow(v-if="menu.children")
          MDIcon(:size="16") mdi-chevron-right
    Contextmenu(
      v-if="currentMenu && currentMenu.children"
      :menus="currentMenu.children"
      :x="childrenX"
      :y="childrenY"
      :scope="scope"
    )
</template>

<script lang="ts">
  import themeStore, {State as ThemeState} from '@/store/theme';
  import {Menu, Scope} from '@/store/contextmenu';
  import treeStore from '@/store/tree';
  import EventBus from '@/models/EventBus';
  import {eventBus, log} from '@/ts/util';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import MDIcon from './MDIcon.vue';

  const MENU_HEIGHT = 39.17;

  @Component({
    components: {
      MDIcon,
    },
  })
  export default class Contextmenu extends Vue {
    @Prop({type: Number, default: 0})
    private x!: number;
    @Prop({type: Number, default: 0})
    private y!: number;
    @Prop({type: Array, default: () => []})
    private menus!: Array<Menu<any>>;
    @Prop({type: String, default: ''})
    private scope!: Scope;

    private currentMenu: Menu<any> | null = null;

    get getMenus(): Array<Menu<any>> {
      let menus = this.menus;
      switch (this.scope) {
        case Scope.explorer:
          if (treeStore.state.selects.length === 0) {
            menus = [];
            this.menus.forEach((menu: Menu<any>) => {
              if (!menu.option || !menu.option.selectOnly) {
                menus.push(menu);
              }
            });
          }
          break;
      }
      return menus;
    }

    get childrenX(): number {
      const ul = this.$refs.ul as HTMLElement;
      return this.x + ul.clientWidth;
    }

    get childrenY(): number {
      if (this.currentMenu) {
        const menus = this.getMenus;
        return this.y + menus.indexOf(this.currentMenu) * MENU_HEIGHT;
      } else {
        return this.y;
      }
    }

    get theme(): ThemeState {
      return themeStore.state;
    }

    private onExecute(menu: Menu<any>) {
      log.debug('Contextmenu onExecute');
      if (!menu.children && menu.execute && typeof menu.execute === 'function') {
        switch (this.scope) {
          case Scope.explorer:
            menu.execute(treeStore.state.selects);
            eventBus.$emit(EventBus.Explorer.contextmenuEnd);
            break;
          default:
            menu.execute(null);
            break;
        }
      }
    }

    private onMouseover(menu: Menu<any>) {
      log.debug('Contextmenu onMouseover');
      this.currentMenu = menu;
    }

    private onMouseenter(event: MouseEvent) {
      const el = event.target as HTMLElement;
      el.style.color = this.theme.fontActive;
      el.style.backgroundColor = this.theme.contextmenuActive;
    }

    private onMouseleave(event: MouseEvent) {
      const el = event.target as HTMLElement;
      el.style.color = this.theme.font;
      el.style.backgroundColor = this.theme.contextmenu;
    }

  }
</script>

<style scoped lang="scss">
  .contextmenu {

    ul {
      position: fixed;
      z-index: 9000;

      li {
        padding: 10px;
        cursor: pointer;
        font-size: $size-font + 2;
        white-space: nowrap;

        span {
          width: 100px;
          display: inline-flex;
          vertical-align: middle;
          align-items: center;
          overflow: hidden;
        }

        .name {

        }

        .keymap, .arrow {
          width: 100%;
          display: inline;
          padding-left: 10px;
        }
      }
    }
  }

  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
