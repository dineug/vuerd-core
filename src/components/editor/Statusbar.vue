<template lang="pug">
  .statusbar(:style="statusbarStyle")
</template>

<script lang="ts">
import themeStore, { State as ThemeState } from "@/store/theme";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Statusbar extends Vue {
  get statusbarStyle(): string {
    return `
    color: ${this.theme.font};
    background-color: ${this.theme.statusbar};
    `;
  }
  get theme(): ThemeState {
    return themeStore.state;
  }
}
</script>

<style scoped lang="scss">
.statusbar {
  width: 100%;
  height: $size-statusbar-height;
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  font-size: $size-font;
  z-index: 300;
}
</style>
