<template lang="pug">
  .split-view-container(:style="{ width: `${width}px`, height: `${height}px` }"
    :class="{ vertical: container.vertical, horizontal: container.horizontal }")

    .split-view-view(v-for="(node, i) in container.views"
      :style="{ width: `${viewWidths[i]}px`, height: `${viewHeights[i]}px` }"
      :class="{ vertical: container.vertical && i !== 0, horizontal: container.horizontal && i !== 0 }")
      Sash(v-if="i !== 0" :vertical="container.vertical" :horizontal="container.horizontal"
        @mousemove="onMousemoveSash($event, i)")
      SplitViewContainer(v-if="node.views && node.views.length" :deep="deep + 1"
        :container="node" :width="viewWidths[i]" :height="viewHeights[i]")
      div.split-view-main(v-else) test
</template>

<script lang="ts">
  import {log} from '@/ts/util';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
  import Sash from '..//Sash.vue';

  @Component({
    components: {
      Sash,
    },
  })
  export default class SplitViewContainer extends Vue {
    @Prop({type: Number, default: 2000})
    private readonly width!: number;
    @Prop({type: Number, default: 1000})
    private readonly height!: number;
    @Prop({type: Object, default: {}})
    private readonly container: any;
    @Prop({type: Boolean, default: false})
    private readonly root!: boolean;
    @Prop({type: Number, default: 0})
    private readonly deep!: number;

    private ratioWidths: number[] = [];
    private ratioHeights: number[] = [];
    private viewWidths: number[] = [];
    private viewHeights: number[] = [];

    @Watch('width')
    private watchWidth() {
      this.container.views.forEach((view: {}, i: number) => {
        this.viewWidths[i] = this.width * this.ratioWidths[i];
      });
    }

    @Watch('height')
    private watchHeight() {
      this.container.views.forEach((view: {}, i: number) => {
        this.viewHeights[i] = this.height * this.ratioHeights[i];
      });
    }

    // event handler
    private onMousemoveSash(e: MouseEvent, i: number) {
      if (this.container.vertical) {
        log.debug(`i: ${i}, x: ${e.movementX}`);

        const viewWidths = [...this.viewWidths];
        viewWidths[i - 1] += e.movementX;
        viewWidths[i] -= e.movementX;
        this.viewWidths = viewWidths;
        this.ratioWidths[i - 1] = viewWidths[i - 1] / this.width;
        this.ratioWidths[i] = viewWidths[i] / this.width;
      } else if (this.container.horizontal) {
        log.debug(`i: ${i}, y: ${e.movementY}`);

        const viewHeights = [...this.viewHeights];
        viewHeights[i - 1] += e.movementY;
        viewHeights[i] -= e.movementY;
        this.viewHeights = viewHeights;
        this.ratioHeights[i - 1] = viewHeights[i - 1] / this.height;
        this.ratioHeights[i] = viewHeights[i] / this.height;
      }
    }

    private created() {
      // 비율 초기화
      const ratioWidth = this.container.vertical
        ? 1 / this.container.views.length
        : 1;
      const ratioHeight = this.container.horizontal
        ? 1 / this.container.views.length
        : 1;
      this.container.views.forEach((view: {}, i: number) => {
        this.ratioWidths[i] = ratioWidth;
      });
      this.container.views.forEach((view: {}, i: number) => {
        this.ratioHeights[i] = ratioHeight;
      });
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

      .split-view-main {
        height: 100%;
        overflow: auto;
      }

      &.vertical {
        border-left: solid 1px $color-editorBottom-top;
      }

      &.horizontal {
        border-top: solid 1px $color-editorBottom-top;
      }
    }
  }
</style>
