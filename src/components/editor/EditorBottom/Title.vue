<template lang="pug">
  .title(:style="`border-top-color: ${theme.sash};`")
    .title-tab
      ul
        li domain
        li table
    .title-action
      ul
        li
          MDIcon(:size="16") mdi-close
</template>

<script lang="ts">
import themeStore, { State as ThemeState } from "@/store/theme";
import { Component, Vue } from "vue-property-decorator";
import MDIcon from "@/components/editor/MDIcon.vue";

@Component({
  components: {
    MDIcon
  }
})
export default class Title extends Vue {
  get theme(): ThemeState {
    return themeStore.state;
  }
}
</script>

<style scoped lang="scss">
.title {
  height: $size-title-height;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: solid 1px;

  .title-tab {
    height: $size-title-height;
    line-height: $size-title-lineHeight;
    font-size: $size-font;
    overflow: hidden;

    ul {
      display: flex;
      padding-left: 12px;

      li {
        padding: 4px 10px 3px;
        cursor: pointer;
      }
    }
  }

  .title-action {
    height: $size-title-height;
    flex: 1;
    overflow: hidden;

    ul {
      height: 100%;
      display: flex;
      padding-left: 5px;
      align-items: center;
      justify-content: flex-end;

      li {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        cursor: pointer;
      }
    }
  }
}

ul,
ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
