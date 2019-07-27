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
    private readonly width!: number;
    @Prop({type: Number, default: 0})
    private readonly height!: number;
    @Prop({type: String, default: 'all'})
    private readonly direction!: Direction;

    // event observable
    private subscriptionDragover!: Subscription;

    @Watch('direction')
    private watchDirection(val: Direction) {
      log.debug('ViewDrop watchDirection');
      let width = this.width;
      switch (val) {
        case Direction.left:
        case Direction.right:
          width = this.width / 2;
          break;
      }

      let height = this.height;
      switch (val) {
        case Direction.top:
        case Direction.bottom:
          height = this.height / 2;
          break;
      }

      let top = SIZE_VIEW_TAB_HEIGHT;
      if (val === Direction.bottom) {
        top = SIZE_VIEW_TAB_HEIGHT + this.height / 2;
      }

      let left = 0;
      if (val === Direction.right) {
        left = this.width / 2;
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
      this.subscriptionDragover = fromEvent(this.$el, 'dragover').pipe(
        throttleTime(200)
      ).subscribe(this.onDragover);
      this.watchDirection(this.direction);
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
