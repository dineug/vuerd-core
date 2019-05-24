<template lang="pug">
  .sash(:class="{ vertical: vertical, horizontal: horizontal }"
    :style="{ top: `${top}px`, left: `${left}px`}"
    @mousedown="onMousedown")
</template>

<script lang="ts">
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

    // event handler
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
      const e = event as MouseEvent;
      this.$emit('mousemove', e);
    }
  }
</script>

<style scoped lang="scss">
  .sash {
    position: absolute;
    z-index: 35;

    &.vertical {
      width: 4px;
      height: 100%;
      cursor: ew-resize;
    }

    &.horizontal {
      width: 100%;
      height: 4px;
      cursor: ns-resize;
    }
  }
</style>
