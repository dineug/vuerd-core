<template lang="pug">
  .split-view-container(:style="{ width: `${container.width}px`, height: `${container.height}px` }"
    :class="{ vertical: container.vertical, horizontal: container.horizontal }")

    .split-view-view(v-for="(node, i) in container.views"
      :style="{ width: `${node.width}px`, height: `${node.height}px` }"
      :class="{ vertical: container.vertical && i !== 0, horizontal: container.horizontal && i !== 0 }")
      Sash(v-if="i !== 0" :vertical="container.vertical" :horizontal="container.horizontal"
        @mousemove="onMousemoveSash($event, i)")
      SplitViewContainer(v-if="node.views && node.views.length"
        :container="node")
      .split-view-main(v-else) test
</template>

<script lang="ts">
  import {log} from '@/ts/util';
  import store from '@/store/splitView';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Sash from '..//Sash.vue';

  @Component({
    components: {
      Sash,
    },
  })
  export default class SplitViewContainer extends Vue {
    @Prop({type: Object, default: {}})
    private readonly container: any;

    // event handler
    private onMousemoveSash(e: MouseEvent, i: number) {
      if (this.container.vertical) {
        this.container.views[i - 1].width += e.movementX;
        this.container.views[i].width -= e.movementX;
        store.dispatch('resetWidth', {id: this.container.views[i - 1].id});
        store.dispatch('resetWidth', {id: this.container.views[i].id});
      } else if (this.container.horizontal) {
        this.container.views[i - 1].height += e.movementY;
        this.container.views[i].height -= e.movementY;
        store.dispatch('resetHeight', {id: this.container.views[i - 1].id});
        store.dispatch('resetHeight', {id: this.container.views[i].id});
      }
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

      .split-view-main {
        height: 100%;
        overflow: auto;
      }

      &.vertical {
        border-left: solid 1px $color-editorBottom-top;
      }

      &.horizontal {
        border-top: solid 1px $color-editorBottom-top;
      }
    }
  }
</style>
