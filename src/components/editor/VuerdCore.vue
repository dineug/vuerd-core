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
          Sash(horizontal :top="editorBottomTop - 2")
        Sash(vertical :left="sidebarWidth - 2")
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

  import {fromEvent, Observable} from 'rxjs';
  import {debounceTime} from 'rxjs/operators';

  const SIZE_ACTIVITYBAR_WIDTH = 50;

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

    // window resize event observable create
    private resize$: Observable<Event> = fromEvent(window, 'resize').pipe(
      debounceTime(10),
    );

    // window resize event
    private onResize() {
      const main = this.$refs.main as HTMLElement;
      const workspace = this.$refs.workspace as HTMLElement;
      this.editorBottomTop = main.clientHeight - this.editorBottomHeight;
      this.mainWidth = workspace.clientWidth - this.sidebarWidth - SIZE_ACTIVITYBAR_WIDTH;
    }

    private mounted() {
      this.onResize();
      this.resize$.subscribe(this.onResize);
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
    }
  }
</style>
