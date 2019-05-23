<template lang="pug">
  .editor
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Editor extends Vue {
  }
</script>

<style scoped lang="scss">
  .editor {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    background-color: $color-editor;
  }
</style>
