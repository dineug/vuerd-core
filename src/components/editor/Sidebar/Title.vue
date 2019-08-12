<template lang="pug">
  .title
    .title-label
      span {{name}}
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Title extends Vue {
    @Prop({type: String, default: ''})
    private name!: string;
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
        color: $color-title;
        font-size: $size-font + 2;
        overflow: hidden;
      }
    }
  }
</style>
