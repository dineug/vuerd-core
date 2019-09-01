<template lang="pug">
  .split-view-drop
    .split-view-dragover(ref="dragover")
    .split-view-drop-ghost(ref="ghost")
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

      const el = this.$refs.ghost as HTMLElement;
      window.Velocity(
        el,
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
    private onDragover(event: DragEvent) {
      log.debug('ViewDrop onDragover');
      this.$emit('dragover', event);
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private mounted() {
      const el = this.$refs.dragover as HTMLElement;
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

    .split-view-dragover {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 9000;
      opacity: 0;
    }

    .split-view-drop-ghost {
      position: absolute;
      z-index: 8000;
      opacity: 0.3;
      background-color: $color-drop;
    }
  }
</style>
