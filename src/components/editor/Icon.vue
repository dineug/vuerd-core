<template lang="pug">
  .icon-file-folder
    svg.mdi-file-folder(
      v-if="base"
      viewBox="0 0 24 24"
      :style="svgStyle"
    )
      path(v-if="baseFolder" :d="pathFolder" :fill="fill")
      path(v-if="baseFolderOpen" :d="pathFolderOpen" :fill="fill")
      path(v-if="baseFile" :d="pathFile" :fill="fill")
    .icon-plugin(v-else)
      img(:src="icon()")
</template>

<script lang="ts">
import themeStore from "@/store/theme";
import mdi from "@/ts/mdi";
import pluginManagement from "@/plugin/PluginManagement";
import { Component, Prop, Vue } from "vue-property-decorator";

const SIZE = 24;
const SIZE_REM = 1.5;

@Component
export default class Icon extends Vue {
  @Prop({ type: String, default: "" })
  private name!: string;
  @Prop({ type: Boolean, default: false })
  private folder!: boolean;
  @Prop({ type: Boolean, default: false })
  private open!: boolean;

  get fill(): string {
    return themeStore.state.font;
  }

  get rem(): number {
    return SIZE_REM * (16 / SIZE);
  }

  get svgStyle(): string {
    return `
        width: ${this.rem}rem;
        height: ${this.rem}rem;
      `;
  }

  get pathFile(): string {
    return mdi.mdiFileDocument;
  }

  get pathFolderOpen(): string {
    return mdi.mdiFolderOpen;
  }

  get pathFolder(): string {
    return mdi.mdiFolder;
  }

  get base(): boolean {
    let result = false;
    const icon = pluginManagement.icon;
    if (this.folder && !icon.getFolder) {
      result = true;
    } else if (!this.folder && !icon.getFile) {
      result = true;
    } else if (!this.folder && icon.getFile) {
      result = icon.getFile(this.name) === "";
    }
    return result;
  }

  get baseFolder(): boolean {
    return this.folder && !this.open;
  }

  get baseFolderOpen(): boolean {
    return this.folder && this.open;
  }

  get baseFile(): boolean {
    return !this.folder;
  }

  private icon(): string {
    const icon = pluginManagement.icon;
    if (this.folder) {
      if (icon.getFolder) {
        return icon.getFolder(this.name, this.open);
      }
    } else {
      if (icon.getFile) {
        return icon.getFile(this.name);
      }
    }
    return "";
  }
}
</script>

<style scoped lang="scss">
.icon-file-folder {
  .mdi-file-folder {
    vertical-align: middle;
  }

  .icon-plugin {
    display: inline-block;
    vertical-align: middle;

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
