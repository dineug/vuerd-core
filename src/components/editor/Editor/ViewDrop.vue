<template lang="pug">
  .split-view-drop
    .split-view-drop-ghost(ref="ghost")
    .split-view-drop-split(ref="split" :style="splitStyle")
</template>

<script lang="ts">
  import {SIZE_VIEW_TAB_HEIGHT} from '@/ts/layout';
  import themeStore, {State as ThemeState} from '@/store/theme';
  import Direction from '@/models/Direction';
  import {log} from '@/ts/util';
  import AnimationFrame from '@/ts/AnimationFrame';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  import {fromEvent, Subscription} from 'rxjs';
  import {throttleTime} from 'rxjs/operators';

  interface SplitAnimation {
    width: number;
    height: number;
    top: number;
    left: number;
  }

  @Component
  export default class ViewDrop extends Vue {
    @Prop({type: Number, default: 0})
    private width!: number;
    @Prop({type: Number, default: 0})
    private height!: number;
    @Prop({type: String, default: 'all'})
    private direction!: Direction;

    private subDragover!: Subscription;
    private splitAnimation: AnimationFrame<SplitAnimation> | null = null;
    private splitWidth: number = 0;
    private splitHeight: number = 0;
    private splitTop: number = 0;
    private splitLeft: number = 0;

    get theme(): ThemeState {
      return themeStore.state;
    }

    get splitStyle(): string {
      return `
      background-color: ${this.theme.drop};
      top: ${this.splitTop}px;
      left: ${this.splitLeft}px;
      width: ${this.splitWidth}px;
      height: ${this.splitHeight}px;
      `;
    }

    @Watch('direction')
    private watchDirection(direction: Direction) {
      log.debug('ViewDrop watchDirection');
      let top = SIZE_VIEW_TAB_HEIGHT;
      let left = 0;
      let width = this.width;
      let height = this.height;
      switch (direction) {
        case Direction.right:
          left = this.width / 2;
        case Direction.left:
          width = this.width / 2;
          break;
        case Direction.bottom:
          top = SIZE_VIEW_TAB_HEIGHT + this.height / 2;
        case Direction.top:
          height = this.height / 2;
          break;
      }

      if (this.splitAnimation) {
        this.splitAnimation.stop();
      }
      this.splitAnimation = new AnimationFrame(
        {
          width: this.splitWidth,
          height: this.splitHeight,
          top: this.splitTop,
          left: this.splitLeft,
        },
        {
          width,
          height,
          top,
          left,
        }, 100).update((value: SplitAnimation) => {
          this.splitWidth = value.width;
          this.splitHeight = value.height;
          this.splitTop = value.top;
          this.splitLeft = value.left;
        }).start();
    }

    // ==================== Event Handler ===================
    private onDragover(event: DragEvent) {
      log.debug('ViewDrop onDragover');
      this.$emit('dragover', event);
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private mounted() {
      const el = this.$refs.ghost as HTMLElement;
      this.subDragover = fromEvent<DragEvent>(el, 'dragover').pipe(
        throttleTime(100),
      ).subscribe(this.onDragover);
      this.watchDirection(this.direction);
    }

    private destroyed() {
      this.subDragover.unsubscribe();
    }

    // ==================== Life Cycle END ====================
  }
</script>

<style scoped lang="scss">
  .split-view-drop {

    .split-view-drop-ghost {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 9000;
      opacity: 0;
    }

    .split-view-drop-split {
      position: absolute;
      z-index: 8000;
      opacity: 0.3;
    }
  }
</style>
