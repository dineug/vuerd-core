<template lang="pug">
  .split-view-container(:style="{ width: `${width}px`, height: `${height}px` }"
    :class="{ vertical: container.vertical, horizontal: container.horizontal }")

    .split-view-view(v-for="node in container.view"
      :style="{ width: `${viewWidth}px`, height: `${viewHeight}px` }")
      SplitViewContainer(v-if="node.view && node.view.length"
        :container="node" :width="viewWidth" :height="viewHeight")
      div(v-else) test
</template>

<script lang="ts">
  import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

  @Component
  export default class SplitViewContainer extends Vue {
    @Prop({type: Number, default: 2000})
    private readonly width!: number;
    @Prop({type: Number, default: 1000})
    private readonly height!: number;
    @Prop({type: Object, default: {}})
    private readonly container: any;

    private viewWidth: number = 0;
    private viewHeight: number = 0;

    @Watch('width')
    private watchWidth() {
      this.viewWidth = this.container.vertical
        ? this.width / this.container.view.length
        : this.width;
    }
    @Watch('height')
    private watchHeight() {
      this.viewHeight = this.container.horizontal
        ? this.height / this.container.view.length
        : this.height;
    }

    private created() {
      this.watchWidth();
      this.watchHeight();
    }
  }
</script>

<style scoped lang="scss">
  .split-view-container {
    display: flex;

    &.vertical {
      flex-direction: row;
    }

    &.horizontal {
      flex-direction: column;
    }

    .split-view-view {
      position: relative;
    }
  }
</style>
