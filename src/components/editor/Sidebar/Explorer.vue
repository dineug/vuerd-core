<template lang="pug">
  .explorer
    Title(name="탐색기")
    .content
      TreeView.tree(:trees="container.children")
      transition-group(name="select")
        .active(
          v-for="select in selects"
          :key="select.tree.id"
          :style="`top: ${select.top}px;`"
        )
</template>

<script lang="ts">
  import treeStore, {Tree, TreeSelect} from '@/store/tree';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Title from './Title.vue';
  import TreeView from './TreeView.vue';

  @Component({
    components: {
      Title,
      TreeView,
    },
  })
  export default class Explorer extends Vue {

    get container(): Tree {
      return treeStore.state.container;
    }

    get selects(): TreeSelect[] {
      return treeStore.state.selects;
    }

  }
</script>

<style scoped lang="scss">
  .explorer {

    .content {
      position: relative;

      .tree {
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
