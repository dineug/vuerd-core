<template lang="pug">
  .plugin
    Title(name="Plugin")
    Title(name="Theme")
    ul
      li(
        v-for="theme of themes"
        :key="theme.id"
        :style="themeActive().name === theme.name ? activeStyle : ''"
        @click="onTheme(theme)"
      ) {{theme.name}}
</template>

<script lang="ts">
  import pluginManagement from '@/plugin/PluginManagement';
  import {Theme} from '@/types';
  import themeStore, {State as ThemeState} from '@/store/theme';
  import {log} from '@/ts/util';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Title from './Title.vue';

  @Component({
    components: {
      Title,
    },
  })
  export default class Plugin extends Vue {

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

    private themeActive(): Theme {
      return pluginManagement.theme;
    }

    private onTheme(theme: Theme) {
      log.debug('Plugin onTheme');
      pluginManagement.themeLoad(theme.name);
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    }

  }
</script>

<style scoped lang="scss">
  .plugin {

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
  }

  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
