<template lang="pug">
  .explorer
    Title(name="탐색기")
    Title(name="OPEN FILES")
    .content
      OpenFile.file(:tab-groups="tabGroups")
    Title(name="WORKSPACE")
    .content
      TreeView.file(:trees="container.children")
      transition-group(name="select")
        .active(
          v-for="select in selects"
          :key="select.id"
          :style="`top: ${select.top}px;`"
        )
</template>

<script lang="ts">
  import treeStore, {Tree, TreeSelect} from '@/store/tree';
  import viewStore, {View} from '@/store/view';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Title from './Title.vue';
  import TreeView from './TreeView.vue';
  import OpenFile from './OpenFile.vue';

  @Component({
    components: {
      Title,
      TreeView,
      OpenFile,
    },
  })
  export default class Explorer extends Vue {

    get container(): Tree {
      return treeStore.state.container;
    }

    get selects(): TreeSelect[] {
      return treeStore.state.selects;
    }

    get tabGroups(): View[] {
      return viewStore.getters.tabGroups;
    }

  }
</script>

<style scoped lang="scss">
  .explorer {
    height: 100%;

    .content {
      position: relative;

      .file {
        padding-left: 6px;
      }

      .active {
        background-color: $color-sidebar-hover;
        height: 20px;
        position: absolute;
        width: 100%;
        z-index: 100;
      }
    }
  }

  /* animation */
  .select-move {
    transition: transform 0.2s;
  }
</style>
