<template lang="pug">
  .vuerd-core
    Titlebar
    Activitybar
    .workspace(ref="workspace")
      Sidebar(:width="sidebarWidth")
      .main(ref="main" :style="{ left: `${sidebarWidth}px`, width: `${mainWidth}px` }")
        Editor(
          :width="mainWidth"
          :height="editorHeight"
          :sidebarWidth="sidebarWidth"
        )
        EditorBottom(:height="editorBottomHeight")
          Sash(horizontal @mousemove="onMousemoveSash($event, 'horizontal')")
        Sash(vertical @mousemove="onMousemoveSash($event, 'vertical')")
    Statusbar
</template>

<script lang="ts">
  import '@/plugins/vuetify';
  import 'velocity-animate/velocity.min.js';

  import * as layout from '@/ts/layout';
  import {addSpanText, removeSpanText} from '@/ts/util';
  import {minVertical, minHorizontal} from '@/ts/recursionView';
  import viewStore from '@/store/view';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Titlebar from './Titlebar.vue';
  import Activitybar from './Activitybar.vue';
  import Sidebar from './Sidebar.vue';
  import Editor from './Editor.vue';
  import EditorBottom from './EditorBottom.vue';
  import Sash from './Sash.vue';
  import Statusbar from './Statusbar.vue';

  import {fromEvent, Observable, Subscription} from 'rxjs';

  enum Horizon {
    horizontal = 'horizontal',
    vertical = 'vertical',
  }

  interface ResizeMovement {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  @Component({
    components: {
      Titlebar,
      Activitybar,
      Sidebar,
      Editor,
      EditorBottom,
      Sash,
      Statusbar,
    },
  })
  export default class VuerdCore extends Vue {
    private sidebarWidth: number = 200;
    private mainWidth: number = 2000;
    private editorHeight: number = 1000;
    private editorBottomHeight: number = 200;

    private resizeMovement: ResizeMovement = {
      x: 0, y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };

    private resize$: Observable<Event> = fromEvent(window, 'resize');
    private subResize!: Subscription;
    private subResizeMovement!: Subscription;

    // ==================== Event Handler ===================
    private onResizeMovement() {
      this.resizeMovement.x = window.innerWidth - this.resizeMovement.width;
      this.resizeMovement.y = window.innerHeight - this.resizeMovement.height;
      this.resizeMovement.width = window.innerWidth;
      this.resizeMovement.height = window.innerHeight;
      // editorBottomHeight
      const padding = layout.SIZE_TITLEBAR_HEIGHT + layout.SIZE_STATUSBAR_HEIGHT;
      const editorBottomHeightMin = this.editorBottomHeight + padding + layout.SIZE_EDITOR_BOTTOM_TOP_MIN;
      if (window.innerHeight < editorBottomHeightMin
        && padding + layout.SIZE_SASH < this.editorBottomHeight) {
        this.editorBottomHeight += this.resizeMovement.y;
      }
      if (this.editorBottomHeight < padding + layout.SIZE_SASH) {
        this.editorBottomHeight = padding + layout.SIZE_SASH;
      }
    }

    private onResize() {
      const main = this.$refs.main as HTMLElement;
      const workspace = this.$refs.workspace as HTMLElement;
      this.editorHeight = main.clientHeight - this.editorBottomHeight;
      this.mainWidth = workspace.clientWidth - this.sidebarWidth - layout.SIZE_ACTIVITYBAR_WIDTH;
    }

    private onMousemoveSash(e: MouseEvent, horizon: Horizon) {
      switch (horizon) {
        case Horizon.vertical:
          let sizeMainWidthMin = layout.SIZE_MAIN_WIDTH_MIN;
          const minWidth = minVertical(viewStore.state.container);
          if (sizeMainWidthMin < minWidth) {
            sizeMainWidthMin = minWidth;
          }

          const workspace = this.$refs.workspace as HTMLElement;
          const sidebarWidth = this.sidebarWidth + e.movementX;
          const mainWidth = workspace.clientWidth - sidebarWidth - layout.SIZE_ACTIVITYBAR_WIDTH;
          const mouseX = e.x - layout.SIZE_ACTIVITYBAR_WIDTH;
          if (0 < sidebarWidth && sizeMainWidthMin < mainWidth) {
            // mouse 뱡향 분기 처리
            if (mouseX < 0) {
              this.sidebarWidth = 0;
            } else if (mouseX > workspace.clientWidth) {
              this.sidebarWidth = workspace.clientWidth - sizeMainWidthMin - layout.SIZE_ACTIVITYBAR_WIDTH;
            } else if (e.movementX < 0 && mouseX < sidebarWidth) {
              this.sidebarWidth = sidebarWidth;
            } else if (e.movementX > 0 && mouseX > sidebarWidth) {
              this.sidebarWidth = sidebarWidth;
            }
            this.onResize();
          }
          break;
        case Horizon.horizontal:
          let sizeEditorBottomTopMin = layout.SIZE_EDITOR_BOTTOM_TOP_MIN;
          const minHeight = minHorizontal(viewStore.state.container);
          if (sizeEditorBottomTopMin < minHeight) {
            sizeEditorBottomTopMin = minHeight;
          }

          const main = this.$refs.main as HTMLElement;
          const editorBottomHeight = this.editorBottomHeight - e.movementY;
          const editorHeight = main.clientHeight - editorBottomHeight;
          const padding = layout.SIZE_TITLEBAR_HEIGHT + layout.SIZE_STATUSBAR_HEIGHT;
          const mouseY = e.y - padding;
          if (sizeEditorBottomTopMin < editorHeight
            && padding + layout.SIZE_SASH < editorBottomHeight) {
            // mouse 뱡향 분기 처리
            if (mouseY < 0) {
              this.editorBottomHeight = main.clientHeight - sizeEditorBottomTopMin;
            } else if (mouseY + padding > main.clientHeight) {
              this.editorBottomHeight = padding + layout.SIZE_SASH;
            } else if (e.movementY < 0 && mouseY < editorHeight) {
              this.editorBottomHeight = editorBottomHeight;
            } else if (e.movementY > 0 && mouseY > editorHeight) {
              this.editorBottomHeight = editorBottomHeight;
            }
            this.onResize();
          }
          break;
      }
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private mounted() {
      this.subResizeMovement = this.resize$.subscribe(this.onResizeMovement);
      this.subResize = this.resize$.subscribe(this.onResize);
      window.dispatchEvent(new Event('resize'));
      addSpanText();
    }

    private destroyed() {
      this.subResize.unsubscribe();
      this.subResizeMovement.unsubscribe();
      removeSpanText();
    }

    // ==================== Life Cycle END ====================
  }
</script>

<style lang="scss">
  @import '../../scss/reset.scss';

  html {
    overflow-y: auto !important;
  }

  /* firefox */
  .scrollbar {
    scrollbar-color: $color-scrollbar-thumb $color-opacity;
    scrollbar-width: thin;
  }
  /* width */
  ::-webkit-scrollbar {
    width: $size-scrollbar;
    height: $size-scrollbar;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: $color-opacity;
  }

  ::-webkit-scrollbar-corner {
    background: $color-opacity;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: $color-scrollbar-thumb;
  }

  /* Handle : hover*/
  ::-webkit-scrollbar-thumb:hover {
    background: $color-sash;
  }

  .vuerd-core {
    height: 100vh;
    position: relative;
    overflow: hidden;
    color: $color-font;
    min-width: $size-min-width;

    .workspace {
      height: 100%;
      position: relative;
      left: $size-activitybar-width;
      overflow: hidden;
    }

    .main {
      height: 100%;
      position: relative;
      overflow: hidden;
    }
  }
</style>
