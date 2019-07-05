<template lang="pug">
  v-app
    .vuerd-core
      Titlebar
      Activitybar
      .workspace(ref="workspace")
        Sidebar(:width="sidebarWidth")
        .main(ref="main" :style="{ left: `${sidebarWidth}px`, width: `${mainWidth}px` }")
          Editor(:width="mainWidth" :height="editorHeight")
          EditorBottom(:height="editorBottomHeight")
            Sash(horizontal @mousemove="onMousemoveSash($event, 'horizontal')")
          Sash(vertical @mousemove="onMousemoveSash($event, 'vertical')")
      Statusbar
</template>

<script lang="ts">
  import '@/plugins/rxjs';
  import '@/plugins/vuetify';

  import * as layout from '@/ts/layout';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Titlebar from './Titlebar.vue';
  import Activitybar from './Activitybar.vue';
  import Sidebar from './Sidebar.vue';
  import Editor from './Editor.vue';
  import EditorBottom from './EditorBottom.vue';
  import Sash from './Sash.vue';
  import Statusbar from './Statusbar.vue';

  import {fromEvent, Observable, Subscription} from 'rxjs';

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

    private resizeMovement: any = {
      x: 0, y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // event observable
    private resize$: Observable<Event> = fromEvent(window, 'resize');
    private subscriptionResize!: Subscription;
    private subscriptionResizeMovement!: Subscription;

    // event handler
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

    private onMousemoveSash(e: MouseEvent, type: string) {
      switch (type) {
        case 'vertical':
          const workspace = this.$refs.workspace as HTMLElement;
          const sidebarWidth = this.sidebarWidth + e.movementX;
          const mainWidth = workspace.clientWidth - sidebarWidth - layout.SIZE_ACTIVITYBAR_WIDTH;
          const mouseX = e.clientX - layout.SIZE_ACTIVITYBAR_WIDTH;
          if (0 < sidebarWidth && layout.SIZE_MAIN_WIDTH_MIN < mainWidth) {
            // mouse 뱡향 분기 처리
            if (mouseX < 0) {
              this.sidebarWidth = 0;
            } else if (mouseX > workspace.clientWidth) {
              this.sidebarWidth = workspace.clientWidth - layout.SIZE_MAIN_WIDTH_MIN - layout.SIZE_ACTIVITYBAR_WIDTH;
            } else if (e.movementX < 0 && mouseX < sidebarWidth) {
              this.sidebarWidth = sidebarWidth;
            } else if (e.movementX > 0 && mouseX > sidebarWidth) {
              this.sidebarWidth = sidebarWidth;
            }
            this.onResize();
          }
          break;
        case 'horizontal':
          const main = this.$refs.main as HTMLElement;
          const editorBottomHeight = this.editorBottomHeight - e.movementY;
          const editorHeight = main.clientHeight - editorBottomHeight;
          const padding = layout.SIZE_TITLEBAR_HEIGHT + layout.SIZE_STATUSBAR_HEIGHT;
          const mouseY = e.clientY - padding;
          if (layout.SIZE_EDITOR_BOTTOM_TOP_MIN < editorHeight
            && padding + layout.SIZE_SASH < editorBottomHeight) {
            // mouse 뱡향 분기 처리
            if (mouseY < 0) {
              this.editorBottomHeight = main.clientHeight - layout.SIZE_EDITOR_BOTTOM_TOP_MIN;
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

    private mounted() {
      this.subscriptionResizeMovement = this.resize$.subscribe(this.onResizeMovement);
      this.subscriptionResize = this.resize$.subscribe(this.onResize);
      window.dispatchEvent(new Event('resize'));
    }

    private destroyed() {
      this.subscriptionResize.unsubscribe();
      this.subscriptionResizeMovement.unsubscribe();
    }
  }
</script>

<style lang="scss">
  @import '../../scss/reset.scss';
  @import '../../scss/vuetify.scss';

  html {
    overflow-y: auto !important;
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
    background: $color-editorBottom-top;
  }

  .vuerd-core {
    height: 100%;
    position: relative;
    overflow: hidden;
    color: $color-font;

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
