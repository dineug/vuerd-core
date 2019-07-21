<template lang="pug">
  .split-view-drop(
    :style="`width: ${_width}px; height: ${_height}px; top: ${top}px; left: ${left}px;`"
  )
</template>

<script lang="ts">
  import {SIZE_VIEW_TAB_HEIGHT} from '@/ts/layout';
  import Direction from '@/models/Direction';
  import {log} from '@/ts/util';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  import {fromEvent, Subscription} from 'rxjs';

  @Component
  export default class ViewDrop extends Vue {
    @Prop({type: Number, default: 0})
    private readonly width!: number;
    @Prop({type: Number, default: 0})
    private readonly height!: number;
    @Prop({type: String, default: 'all'})
    private readonly direction!: Direction;

    // event observable
    private subscriptionDragover!: Subscription;

    get _width(): number {
      let width = this.width;
      switch (this.direction) {
        case Direction.left:
        case Direction.right:
          width = this.width / 2;
          break;
      }
      return width;
    }

    get _height(): number {
      let height = this.height;
      switch (this.direction) {
        case Direction.top:
        case Direction.bottom:
          height = this.height / 2;
          break;
      }
      return height;
    }

    get top(): number {
      let top = SIZE_VIEW_TAB_HEIGHT;
      switch (this.direction) {
        case Direction.bottom:
          top = SIZE_VIEW_TAB_HEIGHT + this.height / 2;
          break;
      }
      return top;
    }

    get left(): number {
      let left = 0;
      switch (this.direction) {
        case Direction.right:
          left = this.width / 2;
          break;
      }
      return left;
    }

    // ==================== Event Handler ===================
    private onDragover(event: Event) {
      log.debug('ViewDrop onDragover');
      this.$emit('dragover', event as DragEvent);
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private mounted() {
      this.subscriptionDragover = fromEvent(this.$el, 'dragover').subscribe(this.onDragover);
    }

    private destroyed() {
      this.subscriptionDragover.unsubscribe();
    }

    // ==================== Life Cycle END ====================
  }
</script>

<style scoped lang="scss">
  .split-view-drop {
    position: absolute;
    z-index: 150;
    opacity: 0.5;
    background-color: rgb(83, 89, 93);
  }
</style>
