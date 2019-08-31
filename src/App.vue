<template lang="pug">
  div
    VuerdCore(
      v-model="tree"
    )
</template>

<script lang="ts">
  import {Tree} from './types';
  import {read} from './data/tree';
  import {log} from './ts/util';
  import {Component, Watch, Vue} from 'vue-property-decorator';

  @Component
  export default class App extends Vue {

    private tree: Tree = {
      name: 'vuerd-core',
      open: true,
      children: [
        {
          name: '.git',
          open: false,
          children: [],
        },
        {
          name: 'node_modules',
          open: false,
          children: [],
        },
        {
          name: 'public',
          open: true,
          children: [
            {
              name: 'static',
              open: false,
              children: [
                {
                  name: 'logo.png',
                  read,
                },
              ],
            },
            {
              name: 'index.html',
              read,
            },
          ],
        },
        {
          name: '.gitignore',
          read,
        },
        {
          name: 'README.md',
          read,
        },
        {
          name: 'package.json',
          read,
        },
        {
          name: 'vue.config.js',
          read,
        },
        {
          name: 'yarn.lock',
          read,
        },
      ],
    };

    @Watch('tree')
    private watchTree(tree: Tree) {
      log.debug('App watchTree', tree);
    }

  }
</script>
