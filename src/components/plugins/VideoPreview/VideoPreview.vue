<template lang="pug">
  .video-preview(:style="`width: ${width}px; height: ${height}px;`")
    video(
      controls
      :src="value"
    )
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class VideoPreview extends Vue {
    private value: string = '';
    private width: number = 0;
    private height: number = 0;
  }
</script>

<style scoped lang="scss">
  .video-preview {
    overflow: auto;
  }
</style>
