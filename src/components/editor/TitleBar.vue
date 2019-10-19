<template lang="pug">
  .titlebar(:style="`color: ${theme.font}; background-color: ${theme.titleBar};`")
</template>

<script lang="ts">
import themeStore, { State as ThemeState } from "@/store/theme";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TitleBar extends Vue {
  get theme(): ThemeState {
    return themeStore.state;
  }
}
</script>

<style scoped lang="scss">
.titlebar {
  width: 100%;
  height: $size-titlebar-height;
}
</style>
