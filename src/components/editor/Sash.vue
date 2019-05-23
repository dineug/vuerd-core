<template lang="pug">
  .sash(:class="{ vertical: vertical, horizontal: horizontal }"
    :style="{ top: `${top}px`, left: `${left}px`}")
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

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
