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
    private readonly vertical!: boolean;
    @Prop({type: Boolean, default: false})
    private readonly horizontal!: boolean;
    @Prop({type: Number, default: 0})
    private readonly top!: number;
    @Prop({type: Number, default: 0})
    private readonly left!: number;

    // event observable
    private mouseup$: Observable<Event> = fromEvent(window, 'mouseup');
    private mousemove$: Observable<Event> = fromEvent(window, 'mousemove');
    private subscriptionMouseup!: Subscription;
    private subscriptionMousemove!: Subscription;

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
      this.subscriptionMouseup = this.mouseup$.subscribe(this.onMouseup);
      this.subscriptionMousemove = this.mousemove$.subscribe(this.onMousemove);
    }

    private onMouseup() {
      this.subscriptionMouseup.unsubscribe();
      this.subscriptionMousemove.unsubscribe();
    }

    private onMousemove(event: Event) {
      event.preventDefault();
      this.$emit('mousemove', event as MouseEvent);
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
