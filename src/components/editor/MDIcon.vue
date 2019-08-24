<template lang="pug">
  i.mdi(
    :class="`${mdi}`"
    :style="`font-size: ${size}px; line-height: ${size}px;`"
  )
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class MDIcon extends Vue {
    @Prop({type: Number, default: 24})
    private size!: number;
    @Prop({type: Boolean, default: false})
    private file!: boolean;

    private mdi: string = 'mdi-file-document';

    private icon(name: string): string {
      const ext = name.substr(name.lastIndexOf('.') + 1);
      let mdi = 'mdi-file-document';
      switch (ext) {
        case 'html':
          mdi = 'mdi-language-html5';
          break;
        case 'css':
          mdi = 'mdi-language-css3';
          break;
        case 'js':
          mdi = 'mdi-language-javascript';
          break;
        case 'ts':
          mdi = 'mdi-language-typescript';
          break;
        case 'json':
          mdi = 'mdi-json';
          break;
        case 'md':
          mdi = 'mdi-markdown';
          break;
        case 'pdf':
          mdi = 'mdi-file-pdf';
          break;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'ico':
          mdi = 'mdi-file-image';
          break;
        case 'xls':
          mdi = 'mdi-file-excel';
          break;
        case 'txt':
        default:
          mdi = 'mdi-file-document';
          break;
      }
      return mdi;
    }

    private setMdi() {
      if (this.$slots.default && this.$slots.default[0].text) {
        if (this.file) {
          this.mdi = this.icon(this.$slots.default[0].text);
        } else {
          this.mdi = this.$slots.default[0].text;
        }
      }
    }

    private created() {
      this.setMdi();
    }

    private updated() {
      this.setMdi();
    }

  }
</script>

<style scoped lang="scss">
  .mdi {
    vertical-align: middle;
  }
</style>
