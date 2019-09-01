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
                  read: async (path, id) => {
                    return 'https://camo.githubusercontent.com/5e5ea0e4e9840bff621382c9db2ed891cb393d31/68747470733a2f2f76756572642e6769746875622e696f2f76756572642d66726f6e742f766572642e706e67';
                  },
                },
                {
                  name: 'mov_bbb.mp4',
                  read: async (path, id) => {
                    return 'https://www.w3schools.com/html/mov_bbb.mp4';
                  },
                },
                {
                  name: 'flower.mp4',
                  read: async (path, id) => {
                    return 'https://interactive-examples.mdn.mozilla.net/media/examples/flower.mp4';
                  },
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
