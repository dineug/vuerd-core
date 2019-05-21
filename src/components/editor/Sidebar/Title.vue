<template lang="pug">
  .title
    .title-label
      h2(title="탐색기(Ctrl+<Shift>+E)") 탐색기
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Title extends Vue {
  }
</script>

<style scoped lang="scss">
  .title {
    display: flex;
    height: 35px;
    box-sizing: border-box;
    overflow: hidden;
    padding-left: 8px;
    padding-right: 8px;

    .title-label {
      line-height: 35px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-left: 12px;

      h2 {
        color: $color-title;
        font-size: 11px;
        cursor: default;
        font-weight: 400;
        -webkit-margin-before: 0;
        -webkit-margin-after: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
</style>
