<template lang="pug">
  .sash(
    :class="{ vertical: vertical, horizontal: horizontal }"
    :style="{ top: `${centerTop}px`, left: `${centerLeft}px`}"
    @mousedown="onMousedown"
  )
</template>

<script lang="ts">
  import {SIZE_SASH} from '@/ts/layout';
  import {Component, Prop, Vue} from 'vue-property-decorator';

  import {fromEvent, Observable, Subscription} from 'rxjs';

  @Component
  export default class Sash extends Vue {
    @Prop({type: Boolean, default: false})
    private vertical!: boolean;
    @Prop({type: Boolean, default: false})
    private horizontal!: boolean;
    @Prop({type: Number, default: 0})
    private top!: number;
    @Prop({type: Number, default: 0})
    private left!: number;

    private mouseup$: Observable<MouseEvent> = fromEvent<MouseEvent>(window, 'mouseup');
    private mousemove$: Observable<MouseEvent> = fromEvent<MouseEvent>(window, 'mousemove');
    private subMouseup!: Subscription;
    private subMousemove!: Subscription;

    get centerTop() {
      return this.top === 0 && !this.horizontal
        ? this.top
        : this.top - (SIZE_SASH / 2);
    }

    get centerLeft() {
      return this.left === 0 && !this.vertical
        ? this.left
        : this.left - (SIZE_SASH / 2);
    }

    // ==================== Event Handler ===================
    private onMousedown() {
      this.subMouseup = this.mouseup$.subscribe(this.onMouseup);
      this.subMousemove = this.mousemove$.subscribe(this.onMousemove);
    }

    private onMouseup() {
      this.subMouseup.unsubscribe();
      this.subMousemove.unsubscribe();
    }

    private onMousemove(event: MouseEvent) {
      event.preventDefault();
      this.$emit('mousemove', event);
    }
    // ==================== Event Handler END ===================
  }
</script>

<style scoped lang="scss">
  .sash {
    position: absolute;
    z-index: 1000;

    &.vertical {
      width: $size-sash;
      height: 100%;
      cursor: ew-resize;
    }

    &.horizontal {
      width: 100%;
      height: $size-sash;
      cursor: ns-resize;
    }
  }
</style>
