<template lang="pug">
  .editor-bottom(:style="editorBottomStyle")
    slot
    Title
</template>

<script lang="ts">
import themeStore, { State as ThemeState } from "@/store/theme";
import { Component, Prop, Vue } from "vue-property-decorator";
import Title from "./EditorBottom/Title.vue";

@Component({
  components: {
    Title
  }
})
export default class EditorBottom extends Vue {
  @Prop({ type: Number, default: 200 })
  private height!: number;

  get editorBottomStyle(): string {
    return `
    height: ${this.height}px;
    background-color: ${this.theme.editor};
    `;
  }

  get theme(): ThemeState {
    return themeStore.state;
  }
}
</script>

<style scoped lang="scss">
.editor-bottom {
  width: 100%;
  position: absolute;
  bottom: 0;
}
</style>
