<template lang="pug">
  v-app
    .vuerd-core
      Titlebar
      Activitybar
      .workspace(ref="workspace")
        Sidebar(:width="sidebarWidth")
        .main(ref="main" :style="{ left: `${sidebarWidth}px`, width: `${mainWidth}px` }")
          Editor
          EditorBottom(:height="editorBottomHeight")
          Sash(horizontal :top="editorBottomTop - 2"
            @mousemove="onMousemoveSash($event, 'horizontal')")
        Sash(vertical :left="sidebarWidth - 2"
          @mousemove="onMousemoveSash($event, 'vertical')")
</template>

<script lang="ts">
  import '@/plugins/rxjs';
  import '@/plugins/vuetify';

  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Titlebar from './Titlebar.vue';
  import Activitybar from './Activitybar.vue';
  import Sidebar from './Sidebar.vue';
  import Editor from './Editor.vue';
  import EditorBottom from './EditorBottom.vue';
  import Sash from './Sash.vue';

  import {fromEvent, Observable, Subscription} from 'rxjs';

  const SIZE_ACTIVITYBAR_WIDTH = 50;
  const SIZE_TITLEBAR_HEIGHT = 30;
  const SIZE_MAIN_WIDTH_MIN = 200;

  @Component({
    components: {
      Titlebar,
      Activitybar,
      Sidebar,
      Editor,
      EditorBottom,
      Sash,
    },
  })
  export default class VuerdCore extends Vue {
    private sidebarWidth: number = 200;
    private mainWidth: number = 1000;
    private editorBottomTop: number = 200;
    private editorBottomHeight: number = 200;

    // event observable
    private resize$: Observable<Event> = fromEvent(window, 'resize');
    private subscriptionResize!: Subscription;

    // event handler
    private onResize() {
      const main = this.$refs.main as HTMLElement;
      const workspace = this.$refs.workspace as HTMLElement;
      this.editorBottomTop = main.clientHeight - this.editorBottomHeight;
      this.mainWidth = workspace.clientWidth - this.sidebarWidth - SIZE_ACTIVITYBAR_WIDTH;
    }
    private onMousemoveSash(e: MouseEvent, type: string) {
      switch (type) {
        case 'vertical':
          const workspace = this.$refs.workspace as HTMLElement;
          const sidebarWidth = this.sidebarWidth + e.movementX;
          const mainWidth = workspace.clientWidth - sidebarWidth - SIZE_ACTIVITYBAR_WIDTH;
          const mouseX = e.clientX - SIZE_ACTIVITYBAR_WIDTH;
          if (0 < sidebarWidth && SIZE_MAIN_WIDTH_MIN < mainWidth) {
            // mouse 뱡향 분기 처리
            if (e.movementX < 0 && mouseX < sidebarWidth) {
              this.sidebarWidth = sidebarWidth;
              this.onResize();
            } else if (e.movementX > 0 && mouseX > sidebarWidth) {
              this.sidebarWidth = sidebarWidth;
              this.onResize();
            }
          }
          break;
        case 'horizontal':
          const main = this.$refs.main as HTMLElement;
          const editorBottomHeight = this.editorBottomHeight - e.movementY;
          const editorBottomTop = main.clientHeight - editorBottomHeight;
          const mouseY = e.clientY - SIZE_TITLEBAR_HEIGHT;
          if (0 < editorBottomTop && SIZE_TITLEBAR_HEIGHT < editorBottomHeight) {
            // mouse 뱡향 분기 처리
            if (e.movementY < 0 && mouseY < editorBottomTop) {
              this.editorBottomHeight = editorBottomHeight;
              this.onResize();
            } else if (e.movementY > 0 && mouseY > editorBottomTop) {
              this.editorBottomHeight = editorBottomHeight;
              this.onResize();
            }
          }
          break;
      }
    }

    private mounted() {
      this.onResize();
      this.subscriptionResize = this.resize$.subscribe(this.onResize);
    }
    private destroyed() {
      this.subscriptionResize.unsubscribe();
    }
  }
</script>

<style lang="scss">
  @import '../../scss/reset.scss';
  @import '../../scss/vuetify.scss';

  html {
    overflow-y: auto !important;
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
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
  }
</style>
