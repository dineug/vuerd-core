<template lang="pug">
  .split-view-container(
    :style="{ width: `${container.width}px`, height: `${container.height}px` }"
    :class="{ vertical: container.vertical, horizontal: container.horizontal }"
  )
    .split-view-view(
      v-for="(node, i) in container.children"
      :key="node.id"
      :style="`width: ${node.width}px; height: ${node.height}px; ${container.vertical && i !== 0 ? `border-left-color: ${theme.sash};` : ''} ${container.horizontal && i !== 0 ? `border-top-color: ${theme.sash};` : ''}`"
      :class="{ vertical: container.vertical && i !== 0, horizontal: container.horizontal && i !== 0 }"
    )
      Sash(
        v-if="i !== 0"
        :vertical="container.vertical"
        :horizontal="container.horizontal"
        @mousemove="onMousemoveSash($event, i)"
        @mousedown="onMousedownSash"
      )
      ViewContainer(
        v-if="node.children.length !== 0"
        :container="node"
      )
      ViewView(v-else :view="node")
</template>

<script lang="ts">
  import themeStore, {State as ThemeState} from '@/store/theme';
  import {View} from '@/store/view';
  import Direction from '@/models/Direction';
  import {log} from '@/ts/util';
  import pluginManagement from '@/plugin/PluginManagement';
  import {minHorizontal, minVertical, resetHeightRatio, resetWidthRatio} from '@/store/view/viewHandler';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Sash from '../Sash.vue';
  import ViewView from './ViewView.vue';

  interface First {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  }

  @Component({
    components: {
      Sash,
      ViewView,
    },
  })
  export default class ViewContainer extends Vue {
    @Prop({type: Object, default: () => ({})})
    private container!: View;

    private x: number = 0;
    private y: number = 0;

    private first: First = {
      left: false,
      right: false,
      top: false,
      bottom: false,
    };

    get theme(): ThemeState {
      return themeStore.state;
    }

    private moveWidth(event: MouseEvent, view1: View, view2: View) {
      const direction: Direction = event.movementX < 0 ? Direction.left : Direction.right;
      const minWidth = minVertical(view1);
      const width = direction === Direction.left ? view1.width + event.movementX : view1.width - event.movementX;
      switch (direction) {
        case Direction.left:
          if (minWidth < width && event.x < this.x) {
            view1.width = width;
            view2.width = view2.width - event.movementX;
            view1.widthRatio = view1.width / this.container.width;
            view2.widthRatio = view2.width / this.container.width;
            resetWidthRatio(view1);
            resetWidthRatio(view2);
            this.first[direction] = true;
            this.x += event.movementX;
            pluginManagement.editorResize();
          }
          break;
        case Direction.right:
          if (minWidth < width && event.x > this.x) {
            view1.width = width;
            view2.width = view2.width + event.movementX;
            view1.widthRatio = view1.width / this.container.width;
            view2.widthRatio = view2.width / this.container.width;
            resetWidthRatio(view1);
            resetWidthRatio(view2);
            this.first[direction] = true;
            this.x += event.movementX;
            pluginManagement.editorResize();
          }
          break;
      }
    }

    private moveHeight(event: MouseEvent, view1: View, view2: View) {
      const direction: Direction = event.movementY < 0 ? Direction.top : Direction.bottom;
      const minHeight = minHorizontal(view1);
      const height = direction === Direction.top ? view1.height + event.movementY : view1.height - event.movementY;
      switch (direction) {
        case Direction.top:
          if (minHeight < height && event.y < this.y) {
            view1.height = height;
            view2.height = view2.height - event.movementY;
            view1.heightRatio = view1.height / this.container.height;
            view2.heightRatio = view2.height / this.container.height;
            resetHeightRatio(view1);
            resetHeightRatio(view2);
            this.first[direction] = true;
            this.y += event.movementY;
            pluginManagement.editorResize();
          }
          break;
        case Direction.bottom:
          if (minHeight < height && event.y > this.y) {
            view1.height = height;
            view2.height = view2.height + event.movementY;
            view1.heightRatio = view1.height / this.container.height;
            view2.heightRatio = view2.height / this.container.height;
            resetHeightRatio(view1);
            resetHeightRatio(view2);
            this.first[direction] = true;
            this.y += event.movementY;
            pluginManagement.editorResize();
          }
          break;
      }
    }

    // ==================== Event Handler ===================
    private onMousemoveSash(event: MouseEvent, i: number) {
      if (this.container.vertical) {
        if (event.movementX < 0) {
          // left
          this.moveWidth(event, this.container.children[i - 1], this.container.children[i]);
        } else {
          // right
          this.moveWidth(event, this.container.children[i], this.container.children[i - 1]);
        }
      } else if (this.container.horizontal) {
        if (event.movementY < 0) {
          // top
          this.moveHeight(event, this.container.children[i - 1], this.container.children[i]);
        } else {
          // bottom
          this.moveHeight(event, this.container.children[i], this.container.children[i - 1]);
        }
      }
    }

    private onMousedownSash(event: MouseEvent) {
      log.debug('ViewContainer onMousedownSash');
      this.x = event.x;
      this.y = event.y;
    }

    // ==================== Event Handler END ===================
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

      &.vertical {
        border-left: solid 1px;
      }

      &.horizontal {
        border-top: solid 1px;
      }
    }
  }
</style>
