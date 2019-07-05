<template lang="pug">
  .split-view-container(:style="{ width: `${container.width}px`, height: `${container.height}px` }"
    :class="{ vertical: container.vertical, horizontal: container.horizontal }")

    .split-view-view(v-for="(node, i) in container.views"
      :id="node.id"
      :style="{ width: `${node.width}px`, height: `${node.height}px` }"
      :class="{ vertical: container.vertical && i !== 0, horizontal: container.horizontal && i !== 0 }")
      Sash(v-if="i !== 0" :vertical="container.vertical" :horizontal="container.horizontal"
        @mousemove="onMousemoveSash($event, i)")
      SplitViewContainer(v-if="node.views && node.views.length"
        :container="node")
      .split-view-main(v-else) test
</template>

<script lang="ts">
  import {log} from '@/ts/util';
  import * as recursion from '@/ts/recursionSplitView';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Sash from '..//Sash.vue';

  @Component({
    components: {
      Sash,
    },
  })
  export default class SplitViewContainer extends Vue {
    @Prop({type: Object, default: {}})
    private readonly container: any;

    private first: any = {
      left: false,
      right: false,
      top: false,
      bottom: false,
    };

    private moveWidth(movementX: number, view1: any, view2: any) {
      const direction = movementX < 0 ? 'left' : 'right';
      const minWidth = recursion.minVertical(view1);
      const width = direction === 'left' ? view1.width + movementX : view1.width - movementX;
      if (minWidth < width) {
        view1.width = width;
        view2.width = direction === 'left' ? view2.width - movementX : view2.width + movementX;
        view1.widthRatio = view1.width / this.container.width;
        view2.widthRatio = view2.width / this.container.width;
        recursion.resetWidthRatio(view1);
        recursion.resetWidthRatio(view2);
        this.first[direction] = true;
      } else {
        const oldWidth = view1.width;
        view1.width = minWidth;
        view1.widthRatio = view1.width / this.container.width;
        recursion.resetWidthRatio(view1);
        if (this.first[direction]) {
          view2.width += oldWidth - minWidth;
          view2.widthRatio = view2.width / this.container.width;
          recursion.resetWidthRatio(view2);
          this.first[direction] = false;
        }
      }
    }

    private moveHeight(movementY: number, view1: any, view2: any) {
      const direction = movementY < 0 ? 'top' : 'bottom';
      const minHeight = recursion.minVertical(view1);
      const height = direction === 'top' ? view1.height + movementY : view1.height - movementY;
      if (minHeight < height) {
        view1.height = height;
        view2.height = direction === 'top' ? view2.height - movementY : view2.height + movementY;
        view1.heightRatio = view1.height / this.container.height;
        view2.heightRatio = view2.height / this.container.height;
        recursion.resetHeightRatio(view1);
        recursion.resetHeightRatio(view2);
        this.first[direction] = true;
      } else {
        const oldHeight = view1.height;
        view1.height = minHeight;
        view1.heightRatio = view1.height / this.container.height;
        recursion.resetHeightRatio(view1);
        if (this.first[direction]) {
          view2.height += oldHeight - minHeight;
          view2.heightRatio = view2.height / this.container.height;
          recursion.resetHeightRatio(view2);
          this.first[direction] = false;
        }
      }
    }

    // event handler
    private onMousemoveSash(e: MouseEvent, i: number) {
      if (this.container.vertical) {
        if (e.movementX < 0) {
          // left
          this.moveWidth(e.movementX, this.container.views[i - 1], this.container.views[i]);
        } else {
          // right
          this.moveWidth(e.movementX, this.container.views[i], this.container.views[i - 1]);
        }
      } else if (this.container.horizontal) {
        if (e.movementY < 0) {
          // top
          this.moveHeight(e.movementY, this.container.views[i - 1], this.container.views[i]);
        } else {
          // bottom
          this.moveHeight(e.movementY, this.container.views[i], this.container.views[i - 1]);
        }
      }
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
