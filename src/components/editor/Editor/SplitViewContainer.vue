<template lang="pug">
  .split-view-container(:style="{ width: `${width}px`, height: `${height}px` }"
    :class="{ vertical: container.vertical, horizontal: container.horizontal }")

    .split-view-view(v-for="(node, i) in container.views"
      :style="{ width: `${viewWidths[i]}px`, height: `${viewHeights[i]}px` }"
      :class="{ vertical: container.vertical && i !== 0, horizontal: container.horizontal && i !== 0 }")
      Sash(v-if="i !== 0" :vertical="container.vertical" :horizontal="container.horizontal"
        @mousemove="onMousemoveSash($event, i)")
      SplitViewContainer(v-if="node.views && node.views.length"
        :container="node" :width="viewWidths[i]" :height="viewHeights[i]")
      div.split-view-main(v-else) test
</template>

<script lang="ts">
  import {log} from '@/ts/util';
  import {SIZE_SPLIT_MIN} from '@/ts/layout';
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

    private minSize(index: number): any {
      const sum = {
        width: {
          left: 0,
          right: 0,
        },
        height: {
          top: 0,
          bottom: 0,
        },
      };
      this.container.views.forEach((view: any, i: number) => {
        const min = this.minDeep(view);
        if (i < index) {
          if (sum.width.left < min.width) {
            sum.width.left = min.width;
          }
          if (sum.height.top < min.height) {
            sum.height.top = min.height;
          }
        } else {
          if (sum.width.right < min.width) {
            sum.width.right = min.width;
          }
          if (sum.height.bottom < min.height) {
            sum.height.bottom = min.height;
          }
        }
      });
      const length = {
        width: {
          left: 0,
          right: 0,
        },
        height: {
          top: 0,
          bottom: 0,
        },
      };
      if (this.container.vertical) {
        length.width.right = this.container.views.length - index;
        length.width.left = this.container.views.length - length.width.right;
        sum.width.left += length.width.left * SIZE_SPLIT_MIN;
        sum.width.right += length.width.right * SIZE_SPLIT_MIN;
      } else if (this.container.horizontal) {
        length.height.bottom = this.container.views.length - index;
        length.height.top = this.container.views.length - length.height.bottom;
        sum.height.top += length.height.top * SIZE_SPLIT_MIN;
        sum.height.bottom += length.height.bottom * SIZE_SPLIT_MIN;
      }
      return sum;
    }

    private minDeep(container: any): any {
      const sum = {
        width: 0,
        height: 0,
      };
      container.views.forEach((view: any) => {
        const min = this.minDeep(view);
        if (sum.width < min.width) {
          sum.width = min.width;
        }
        if (sum.height < min.height) {
          sum.height = min.height;
        }
      });
      const width = container.vertical ? container.views.length * SIZE_SPLIT_MIN : 0;
      const height = container.horizontal ? container.views.length * SIZE_SPLIT_MIN : 0;
      return {
        width: sum.width + width,
        height: sum.height + height,
      };
    }

    private targetSum(list: number[], index: number): number {
      return list.filter((width: number, i: number) => i !== index)
        .reduce((width: number, current: number) => width + current);
    }

    // event handler
    private onMousemoveSash(e: MouseEvent, i: number) {
      const min = this.minSize(i);
      if (this.container.vertical) {
        log.debug(`i: ${i}, x: ${e.movementX}`);

        const viewWidths = [...this.viewWidths];
        viewWidths[i - 1] += e.movementX;
        viewWidths[i] -= e.movementX;
        if (viewWidths[i - 1] < min.width.left) {
          viewWidths[i - 1] = min.width.left;
          viewWidths[i] = this.width - this.targetSum(viewWidths, i);
        } else if (viewWidths[i] < min.width.right) {
          viewWidths[i] = min.width.right;
          viewWidths[i - 1] = this.width - this.targetSum(viewWidths, i - 1);
        }
        this.viewWidths = viewWidths;
        this.ratioWidths[i - 1] = this.viewWidths[i - 1] / this.width;
        this.ratioWidths[i] = this.viewWidths[i] / this.width;
      } else if (this.container.horizontal) {
        log.debug(`i: ${i}, y: ${e.movementY}`);

        const viewHeights = [...this.viewHeights];
        viewHeights[i - 1] += e.movementY;
        viewHeights[i] -= e.movementY;
        if (viewHeights[i - 1] < min.height.top) {
          viewHeights[i - 1] = min.height.top;
          viewHeights[i] = this.height - this.targetSum(viewHeights, i);
        } else if (viewHeights[i] < min.height.bottom) {
          viewHeights[i] = min.height.bottom;
          viewHeights[i - 1] = this.height - this.targetSum(viewHeights, i - 1);
        }
        this.viewHeights = viewHeights;
        this.ratioHeights[i - 1] = this.viewHeights[i - 1] / this.height;
        this.ratioHeights[i] = this.viewHeights[i] / this.height;
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
