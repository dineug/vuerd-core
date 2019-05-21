<template lang="pug">
  .content
    v-treeview(:open="open" :items="items" activatable dark item-key="name" open-on-click)
      template(v-slot:prepend="{ item, open }")
        v-icon(v-if="!item.file" color="grey lighten-1") {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        v-icon(v-else color="grey lighten-1") {{ files[item.file] }}
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Content extends Vue {
    private open: string[] = ['public'];
    private files: {} = {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-json',
      md: 'mdi-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel',
    };
    private items: object[] = [
      {
        name: '.git',
      },
      {
        name: 'node_modules',
      },
      {
        name: 'public',
        children: [
          {
            name: 'static',
            children: [
              {
                name: 'logo.png',
                file: 'png',
              },
            ],
          },
          {
            name: 'favicon.ico',
            file: 'png',
          },
          {
            name: 'index.html',
            file: 'html',
          },
        ],
      },
      {
        name: '.gitignore',
        file: 'txt',
      },
      {
        name: 'babel.config.js',
        file: 'js',
      },
      {
        name: 'package.json',
        file: 'json',
      },
      {
        name: 'README.md',
        file: 'md',
      },
      {
        name: 'vue.config.js',
        file: 'js',
      },
      {
        name: 'yarn.lock',
        file: 'txt',
      },
    ];
  }
</script>

<style scoped lang="scss">
  .content {

  }
</style>
