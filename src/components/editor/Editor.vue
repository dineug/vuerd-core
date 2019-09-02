<template lang="pug">
  .editor(
    :style="`width: ${width}px; height: ${height}px; background-color: ${theme.editor};`"
    @dragover="onDragover"
    @drop="onDrop"
  )
    ViewContainer(:container="container")
</template>

<script lang="ts">
  import {SIZE_TITLEBAR_HEIGHT, SIZE_ACTIVITYBAR_WIDTH} from '@/ts/layout';
  import themeStore, {State as ThemeState} from '@/store/theme';
  import viewStore, {View} from '@/store/view';
  import {resetSize, resetWidthRatio, resetHeightRatio} from '@/store/view/viewHandler';
  import {log, eventBus} from '@/ts/util';
  import EventBus from '@/models/EventBus';
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

    private dragover$: Observable<DragEvent> = fromEvent<DragEvent>(window, 'dragover');
    private subDragover: Subscription | null = null;

    get container(): View {
      return viewStore.state.container;
    }

    get theme(): ThemeState {
      return themeStore.state;
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
      this.subDragover = this.dragover$.pipe(throttleTime(100)).subscribe(this.onDragoverTrack);
    }

    private onEditorDragend() {
      log.debug('Editor onEditorDragend');
      if (this.subDragover) {
        this.subDragover.unsubscribe();
      }
    }

    private onDragoverTrack(event: MouseEvent) {
      log.debug('Editor onDragoverTrack');
      const x = event.x - this.sidebarWidth - SIZE_ACTIVITYBAR_WIDTH;
      const y = event.y - SIZE_TITLEBAR_HEIGHT;
      if (x < 0 || y < 0 || x > this.width || y > this.height) {
        eventBus.$emit(EventBus.ViewView.dropViewEnd);
      }
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private created() {
      this.container.width = this.width;
      this.container.height = this.height;
      resetSize(this.container);
      eventBus.$on(EventBus.Editor.dragstart, this.onEditorDragstart);
      eventBus.$on(EventBus.Editor.dragend, this.onEditorDragend);
    }

    private destroyed() {
      eventBus.$off(EventBus.Editor.dragstart, this.onEditorDragstart);
      eventBus.$off(EventBus.Editor.dragend, this.onEditorDragend);
    }

    // ==================== Life Cycle END ====================
  }
</script>

<style scoped lang="scss">
  .editor {
    position: absolute;
    overflow: hidden;
  }
</style>
