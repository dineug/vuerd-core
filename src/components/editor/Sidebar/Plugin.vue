<template lang="pug">
  .plugin
    Title(name="Plugin")
    Title(name="Theme")
    ul
      li(
        v-for="theme of themes"
        :key="theme.id"
        @click="onTheme(theme)"
      ) {{theme.name}}
</template>

<script lang="ts">
  import pluginManagement from '@/plugin/PluginManagement';
  import {Theme} from '@/types';
  import {log} from '@/ts/util';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Title from './Title.vue';

  @Component({
    components: {
      Title,
    },
  })
  export default class Plugin extends Vue {

    get themes(): Theme[] {
      return pluginManagement.themes();
    }

    private onTheme(theme: Theme) {
      log.debug('Plugin onTheme');
      pluginManagement.themeLoad(theme);
    }

  }
</script>

<style scoped lang="scss">
  .plugin {

    ul {
      padding-left: 20px;

      li {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: $size-font + 2;
        cursor: pointer;
      }
    }
  }

  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
