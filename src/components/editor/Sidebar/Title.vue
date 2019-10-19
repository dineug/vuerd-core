<template lang="pug">
  .title
    .title-label
      span(:style="`color: ${theme.font};`") {{name}}
</template>

<script lang="ts">
import themeStore, { State as ThemeState } from "@/store/theme";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Title extends Vue {
  @Prop({ type: String, default: "" })
  private name!: string;

  get theme(): ThemeState {
    return themeStore.state;
  }
}
</script>

<style scoped lang="scss">
.title {
  display: flex;
  height: $size-title-height;
  box-sizing: border-box;
  overflow: hidden;
  padding-left: 8px;
  padding-right: 8px;

  .title-label {
    line-height: $size-title-height;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 12px;

    span {
      font-size: $size-font + 2;
      overflow: hidden;
    }
  }
}
</style>
