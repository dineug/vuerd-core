<template lang="pug">
  .content
    TreeView(:trees="trees")
</template>

<script lang="ts">
  import Tree from '@/models/Tree';
  import treeStore from '@/store/tree';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import TreeView from './TreeView.vue';

  @Component({
    components: {
      TreeView,
    },
  })
  export default class Content extends Vue {

    get trees(): Tree[] {
      return treeStore.getters.trees;
    }

  }
</script>

<style scoped lang="scss">
  .content {

  }
</style>
