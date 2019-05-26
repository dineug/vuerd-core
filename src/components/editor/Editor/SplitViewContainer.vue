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

    private viewWidth: number = 0;
    private viewHeight: number = 0;

    private viewWidths: number[] = [];
    private viewHeights: number[] = [];

    @Watch('width')
    private watchWidth() {
      this.viewWidth = this.container.vertical
        ? this.width / this.container.views.length
        : this.width;

      this.container.views.forEach((view: {}, i: number) => {
        this.viewWidths[i] = this.viewWidth;
      });
    }

    @Watch('height')
    private watchHeight() {
      this.viewHeight = this.container.horizontal
        ? this.height / this.container.views.length
        : this.height;

      this.container.views.forEach((view: {}, i: number) => {
        this.viewHeights[i] = this.viewHeight;
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
      } else if (this.container.horizontal) {
        log.debug(`i: ${i}, y: ${e.movementY}`);

        const viewHeights = [...this.viewHeights];
        viewHeights[i - 1] += e.movementY;
        viewHeights[i] -= e.movementY;
        this.viewHeights = viewHeights;
      }
    }

    private created() {
      // this.watchWidth();
      // this.watchHeight();
      log.debug(`created: ${this.width}`);
    }
    private mounted() {
      log.debug(`mounted: ${this.width}`);
    }
    private updated() {
      log.debug(`updated: ${this.width}`);
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
        overflow-x: auto;
        overflow-y: auto;
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
