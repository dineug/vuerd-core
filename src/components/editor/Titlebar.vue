<template lang="pug">
  .titlebar
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Titlebar extends Vue {
  }
</script>

<style scoped lang="scss">
  .titlebar {
    width: 100%;
    height: 30px;
    background-color: $color-titlebar;
    color: $color-font;
  }
</style>
