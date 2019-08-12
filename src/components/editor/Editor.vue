<template lang="pug">
  .editor(
    :style="{ width: `${width}px`, height: `${height}px` }"
    @dragover="onDragover"
    @drop="onDrop"
  )
    ViewContainer(:container="container")
</template>

<script lang="ts">
  import viewStore, {View} from '@/store/view';
  import {resetSize, resetWidthRatio, resetHeightRatio} from '@/ts/recursionView';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
  import ViewContainer from './Editor/ViewContainer.vue';

  @Component({
    components: {
      ViewContainer,
    },
  })
  export default class Editor extends Vue {
    @Prop({type: Number, default: 2000})
    private width!: number;
    @Prop({type: Number, default: 1000})
    private height!: number;

    get container(): View {
      return viewStore.state.container;
    }

    @Watch('width')
    private watchWidth(width: number) {
      this.container.width = width;
      resetWidthRatio(this.container);
    }

    @Watch('height')
    private watchHeight(height: number) {
      this.container.height = height;
      resetHeightRatio(this.container);
    }

    private onDragover(event: DragEvent) {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    }

    // firefox
    private onDrop(event: DragEvent) {
      event.preventDefault();
    }

    private created() {
      this.container.width = this.width;
      this.container.height = this.height;
      resetSize(this.container);
    }

  }
</script>

<style scoped lang="scss">
  .editor {
    position: absolute;
    overflow: hidden;
    background-color: $color-editor;
  }
</style>
