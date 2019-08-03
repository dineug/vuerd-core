<template lang="pug">
  ul.tree-view
    li(v-for="node in trees" :key="node.id")
      span
        v-icon.icon(
          v-if="node.children"
          color="grey lighten-1"
          small
        ) mdi-folder
        v-icon.icon(
          v-else
          color="grey lighten-1"
          small
        ) {{node.name | mdi}}
      span {{node.name}}
      TreeView(v-if="node.children && node.children.length !== 0" :trees="node.children")
</template>

<script lang="ts">
  import Tree from '@/models/Tree';
  import {icon, log, eventBus} from '@/ts/util';
  import { Component, Prop, Vue } from 'vue-property-decorator';

  // 'mdi-folder-open' : 'mdi-folder'

  @Component({
    filters: {
      mdi(name: string): string {
        const ext = name.substr(name.lastIndexOf('.') + 1);
        return icon(ext.toLowerCase());
      },
    },
  })
  export default class TreeView extends Vue {
    @Prop({type: Array, default: []})
    private trees!: Tree[];
  }
</script>

<style scoped lang="scss">
  .tree-view {
    padding-left: 20px;

    li {
      padding: 1px 0;
      min-width: max-content;
    }

    .icon {
      padding-right: 4px;
    }
  }
</style>
