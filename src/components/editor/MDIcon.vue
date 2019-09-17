<template lang="pug">
  svg.mdi(
    viewBox="0 0 24 24"
    :style="svgStyle"
  )
    path(:d="path" :fill="fill")
</template>

<script lang="ts">
  import themeStore from '@/store/theme';
  import mdi from '@/ts/mdi';
  import {Component, Prop, Vue} from 'vue-property-decorator';

  const SIZE = 24;
  const SIZE_REM = 1.5;

  @Component
  export default class MDIcon extends Vue {
    @Prop({type: Number, default: SIZE})
    private size!: number;
    @Prop({type: Boolean, default: false})
    private file!: boolean;
    @Prop({type: String, default: ''})
    private color!: string;

    private path: string = mdi.mdiFileDocument;

    get rem(): number {
      return SIZE_REM * (this.size / SIZE);
    }

    get svgStyle(): string {
      return `
        width: ${this.rem}rem;
        height: ${this.rem}rem;
      `;
    }

    get fill(): string {
      if (this.color === '') {
        return themeStore.state.font;
      } else {
        return this.color;
      }
    }

    private icon(name: string): string {
      const ext = name.substr(name.lastIndexOf('.') + 1);
      let path = mdi.mdiFileDocument;
      switch (ext) {
        case 'html':
          path = mdi.mdiLanguageHtml5;
          break;
        case 'css':
          path = mdi.mdiLanguageCss3;
          break;
        case 'js':
          path = mdi.mdiLanguageJavascript;
          break;
        case 'ts':
          path = mdi.mdiLanguageTypescript;
          break;
        case 'json':
          path = mdi.mdiJson;
          break;
        case 'md':
          path = mdi.mdiMarkdown;
          break;
        case 'pdf':
          path = mdi.mdiFilePdf;
          break;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'ico':
          path = mdi.mdiFileImage;
          break;
        case 'xls':
          path = mdi.mdiFileExcel;
          break;
        case 'txt':
        default:
          path = mdi.mdiFileDocument;
          break;
      }
      return path;
    }

    private mdiKey(name: string): string {
      const list = name.split('-');
      for (let i = 1; i < list.length; i++) {
        list[i] = list[i].charAt(0).toUpperCase() + list[i].slice(1);
      }
      return list.join('');
    }

    private setMdi() {
      if (this.$slots.default && this.$slots.default[0].text) {
        if (this.file) {
          this.path = this.icon(this.$slots.default[0].text);
        } else {
          const key = this.mdiKey(this.$slots.default[0].text);
          this.path = mdi[key];
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
