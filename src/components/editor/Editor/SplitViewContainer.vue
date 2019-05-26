<template lang="pug">
  .split-view-container(:style="{ width: `${width}px`, height: `${height}px` }"
    :class="{ vertical: container.vertical, horizontal: container.horizontal }")

    .split-view-view(v-for="(node, i) in container.view"
      :style="{ width: `${viewWidth}px`, height: `${viewHeight}px` }"
      :class="{ vertical: container.vertical && i !== 0, horizontal: container.horizontal && i !== 0 }")
      Sash(v-if="i !== 0" :vertical="container.vertical" :horizontal="container.horizontal"
        @mousemove="onMousemoveSash")
      SplitViewContainer(v-if="node.view && node.view.length"
        :container="node" :width="viewWidth" :height="viewHeight")
      div(v-else) test
</template>

<script lang="ts">
  import {log} from '@/ts/util';
  import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
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

    @Watch('width')
    private watchWidth() {
      this.viewWidth = this.container.vertical
        ? this.width / this.container.view.length
        : this.width;
    }
    @Watch('height')
    private watchHeight() {
      this.viewHeight = this.container.horizontal
        ? this.height / this.container.view.length
        : this.height;
    }

    private onMousemoveSash(e: MouseEvent) {
      log.debug(e.movementX, e.movementY);
    }

    private created() {
      this.watchWidth();
      this.watchHeight();
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

      &.vertical {
        border-left: solid 1px $color-editorBottom-top;
      }

      &.horizontal {
        border-top: solid 1px $color-editorBottom-top;
      }
    }
  }
</style>
