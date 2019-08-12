<template lang="pug">
  .split-view-drop
</template>

<script lang="ts">
  import {SIZE_VIEW_TAB_HEIGHT} from '@/ts/layout';
  import Direction from '@/models/Direction';
  import {log} from '@/ts/util';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  import {fromEvent, Subscription} from 'rxjs';
  import {throttleTime} from 'rxjs/operators';

  @Component
  export default class ViewDrop extends Vue {
    @Prop({type: Number, default: 0})
    private width!: number;
    @Prop({type: Number, default: 0})
    private height!: number;
    @Prop({type: String, default: 'all'})
    private direction!: Direction;

    private subDragover!: Subscription;

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

      window.Velocity(
        this.$el,
        {
          width,
          height,
          top,
          left,
        },
        {duration: 100},
      );
    }

    // ==================== Event Handler ===================
    private onDragover(event: Event) {
      log.debug('ViewDrop onDragover');
      this.$emit('dragover', event as DragEvent);
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private mounted() {
      this.subDragover = fromEvent(this.$el, 'dragover').pipe(
        throttleTime(200),
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
    position: absolute;
    z-index: 150;
    opacity: 0.1;
    background-color: $color-drop;
  }
</style>
