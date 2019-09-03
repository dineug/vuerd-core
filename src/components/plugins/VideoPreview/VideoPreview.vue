<template lang="pug">
  video.video-preview(
    controls
    :src="value"
  )
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class VideoPreview extends Vue {
    private value: string = '';
  }
</script>

<style scoped lang="scss">
  .video-preview {

  }
</style>
