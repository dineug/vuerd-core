<template lang="pug">
  .statusbar
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Statusbar extends Vue {
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
    color: $color-statusbar-font;
    background-color: $color-statusbar;
    z-index: 300;
  }
</style>
