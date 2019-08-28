<template lang="pug">
  VuerdCore(
    :tree="tree"
    @changeTree="onChangeTree"
  )
</template>

<script lang="ts">
  import {Tree} from './components';
  import {dataTree} from './data/tree';
  import {log} from './ts/util';
  import {Component, Vue} from 'vue-property-decorator';

  @Component
  export default class App extends Vue {

    get tree(): Tree {
      return dataTree;
    }

    private onChangeTree() {
      log.debug('App onChangeTree', this.tree);
    }

  }
</script>
