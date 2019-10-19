<template lang="pug">
  .video-preview(:style="`width: ${width}px; height: ${height}px;`")
    video(
      controls
      :src="value"
    )
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VideoPreview extends Vue {
  @Prop({ type: String, default: "" })
  private value!: string;
  @Prop({ type: Number, default: 0 })
  private width!: number;
  @Prop({ type: Number, default: 0 })
  private height!: number;
}
</script>

<style scoped lang="scss">
.video-preview {
  overflow: auto;
}
</style>
