<template lang="pug">
  .editor(
    :style="{ width: `${width}px`, height: `${height}px` }"
    @dragover="onDragover"
    @drop="onDrop"
  )
    ViewContainer(:container="container")
</template>

<script lang="ts">
  import {SIZE_TITLEBAR_HEIGHT, SIZE_ACTIVITYBAR_WIDTH} from '@/ts/layout';
  import viewStore, {View} from '@/store/view';
  import {resetSize, resetWidthRatio, resetHeightRatio} from '@/ts/recursionView';
  import {log, eventBus} from '@/ts/util';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
  import ViewContainer from './Editor/ViewContainer.vue';

  import {fromEvent, Observable, Subscription} from 'rxjs';
  import {throttleTime} from 'rxjs/operators';

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
    @Prop({type: Number, default: 200})
    private sidebarWidth!: number;

    private drag$: Observable<DragEvent> = fromEvent<DragEvent>(window, 'drag');
    private subDrag!: Subscription;

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

    // ==================== Event Handler ===================
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

    private onEditorDragstart() {
      log.debug('Editor onEditorDragstart');
      this.subDrag = this.drag$.pipe(throttleTime(100)).subscribe(this.onDrag);
    }

    private onEditorDragend() {
      log.debug('Editor onEditorDragend');
      this.subDrag.unsubscribe();
    }

    private onDrag(event: DragEvent) {
      log.debug('Editor onDrag');
      const x = event.x - this.sidebarWidth - SIZE_ACTIVITYBAR_WIDTH;
      const y = event.y - SIZE_TITLEBAR_HEIGHT;
      if (x < 0 || y < 0 || x > this.width || y > this.height) {
        eventBus.$emit('view-view-drop-view-end');
      }
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private created() {
      this.container.width = this.width;
      this.container.height = this.height;
      resetSize(this.container);
      eventBus.$on('editor-dragstart', this.onEditorDragstart);
      eventBus.$on('editor-dragend', this.onEditorDragend);
    }

    private destroyed() {
      eventBus.$off('editor-dragstart', this.onEditorDragstart);
      eventBus.$off('editor-dragend', this.onEditorDragend);
    }

    // ==================== Life Cycle END ====================
  }
</script>

<style scoped lang="scss">
  .editor {
    position: absolute;
    overflow: hidden;
    background-color: $color-editor;
  }
</style>
