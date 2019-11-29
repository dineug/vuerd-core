<template lang="pug">
  .vuerd-core(:style="`color: ${theme.font};`")
    TitleBar
    ActivityBar
    .workspace(ref="workspace")
      Sidebar(:width="sidebarWidth")
      .main(ref="main" :style="{ left: `${sidebarWidth}px`, width: `${mainWidth}px` }")
        Editor(
          :width="mainWidth"
          :height="editorHeight"
          :sidebarWidth="sidebarWidth"
        )
        //EditorBottom(:height="editorBottomHeight")
          Sash(horizontal @mousemove="onMousemoveSash($event, 'horizontal')")
        Sash(
          v-if="activeMenu !== null"
          vertical
          @mousemove="onMousemoveSash($event, 'vertical')"
          @mouseup="onMouseupSash"
        )
    Statusbar
    ToastBar
</template>

<script lang="ts">
import * as layout from "@/ts/layout";
import { log } from "@/ts/util";
import eventBus, { Bus } from "@/ts/EventBus";
import { minVertical, minHorizontal } from "@/store/view/viewHelper";
import viewStore from "@/store/view";
import treeStore, { Commit } from "@/store/tree";
import themeStore, { State as ThemeState } from "@/store/theme";
import activityBarStore, {
  ActivityMenu,
  Commit as ActivityBarCommit
} from "@/store/activityBar";
import pluginManagement from "@/plugin/PluginManagement";
import Key from "@/models/Key";
import { treeEditAllEnd, treeEdits } from "@/store/tree/treeHelper";
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import TitleBar from "./TitleBar.vue";
import ActivityBar from "./ActivityBar.vue";
import Sidebar from "./Sidebar.vue";
import Editor from "./Editor.vue";
import EditorBottom from "./EditorBottom.vue";
import Sash from "./Sash.vue";
import Statusbar from "./Statusbar.vue";
import ToastBar from "./ToastBar.vue";

import { fromEvent, Observable, Subscription } from "rxjs";

enum Horizon {
  horizontal = "horizontal",
  vertical = "vertical"
}

interface ResizeMovement {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  components: {
    TitleBar,
    ActivityBar,
    Sidebar,
    Editor,
    EditorBottom,
    Sash,
    Statusbar,
    ToastBar
  }
})
export default class VuerdCore extends Vue {
  @Prop({ type: String, default: "VSCode" })
  private themeName!: string;
  @Prop({ type: String, default: "VSCodeIcons" })
  private iconName!: string;
  @Prop({ type: String, default: "" })
  private remoteName!: string;

  private sidebarWidth: number = 200;
  private sidebarWidthOld: number = 200;
  private mainWidth: number = 2000;
  private editorHeight: number = 1000;
  private editorBottomHeight: number = 0;

  private resizeMovement: ResizeMovement = {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight
  };

  private resize$: Observable<Event> = fromEvent(window, "resize");
  private keydown$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(
    window,
    "keydown"
  );
  private subResize!: Subscription;
  private subResizeMovement!: Subscription;
  private subKeydown!: Subscription;

  get theme(): ThemeState {
    return themeStore.state;
  }

  get activeMenu(): ActivityMenu | null {
    return activityBarStore.state.activeMenu;
  }

  @Watch("themeName")
  private watchThemeName(value: string) {
    pluginManagement.themeLoad(value);
  }

  @Watch("iconName")
  private watchIconName(value: string) {
    pluginManagement.iconLoad(value);
  }

  @Watch("remoteName")
  private watchRemoteName(value: string) {
    pluginManagement.remoteLoad(value);
  }

  // ==================== Event Handler ===================
  private onResizeMovement() {
    this.resizeMovement.x = window.innerWidth - this.resizeMovement.width;
    this.resizeMovement.y = window.innerHeight - this.resizeMovement.height;
    this.resizeMovement.width = window.innerWidth;
    this.resizeMovement.height = window.innerHeight;
    // editorBottomHeight
    const padding = layout.SIZE_TITLEBAR_HEIGHT + layout.SIZE_STATUSBAR_HEIGHT;
    const editorBottomHeightMin =
      this.editorBottomHeight + padding + layout.SIZE_EDITOR_BOTTOM_TOP_MIN;
    if (
      window.innerHeight < editorBottomHeightMin &&
      padding < this.editorBottomHeight
    ) {
      this.editorBottomHeight += this.resizeMovement.y;
    }
    if (this.editorBottomHeight < padding) {
      this.editorBottomHeight = padding;
    }
  }

  private onResize() {
    log.debug("VuerdCore onResize");
    const main = this.$refs.main as HTMLElement;
    const workspace = this.$refs.workspace as HTMLElement;
    this.editorHeight = main.clientHeight - this.editorBottomHeight;
    this.mainWidth =
      workspace.clientWidth - this.sidebarWidth - layout.SIZE_ACTIVITYBAR_WIDTH;
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
        const mainWidth =
          workspace.clientWidth - sidebarWidth - layout.SIZE_ACTIVITYBAR_WIDTH;
        const mouseX = e.x - layout.SIZE_ACTIVITYBAR_WIDTH;
        if (sidebarWidth > 0 && sizeMainWidthMin < mainWidth) {
          if (mouseX < 0) {
            this.sidebarWidthOld = this.sidebarWidth = 0;
          } else if (mouseX > workspace.clientWidth) {
            this.sidebarWidth =
              workspace.clientWidth -
              sizeMainWidthMin -
              layout.SIZE_ACTIVITYBAR_WIDTH;
          } else if (e.movementX < 0 && mouseX < sidebarWidth) {
            this.sidebarWidthOld = this.sidebarWidth = sidebarWidth;
          } else if (e.movementX > 0 && mouseX > sidebarWidth) {
            this.sidebarWidthOld = this.sidebarWidth = sidebarWidth;
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
        const padding =
          layout.SIZE_TITLEBAR_HEIGHT + layout.SIZE_STATUSBAR_HEIGHT;
        const mouseY = e.y - padding;
        if (
          sizeEditorBottomTopMin < editorHeight &&
          padding < editorBottomHeight
        ) {
          if (mouseY < 0) {
            this.editorBottomHeight =
              main.clientHeight - sizeEditorBottomTopMin;
          } else if (mouseY + padding > main.clientHeight) {
            this.editorBottomHeight = padding;
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

  private onMouseupSash() {
    log.debug("VuerdCore onMouseupSash");
    if (this.sidebarWidth === 0) {
      activityBarStore.commit(ActivityBarCommit.close);
    }
  }

  private onSidebarStart() {
    log.debug("VuerdCore onSidebarStart");
    this.sidebarWidth = this.sidebarWidthOld;
    if (this.sidebarWidth < 50) {
      this.sidebarWidth = 200;
    }
    this.onResize();
  }

  private onSidebarEnd() {
    log.debug("VuerdCore onSidebarEnd");
    this.sidebarWidthOld = this.sidebarWidth;
    this.sidebarWidth = 0;
    this.onResize();
  }

  private onChangeTheme() {
    log.debug("VuerdCore onChangeTheme");
    this.$emit("changeTheme", pluginManagement.theme.name);
  }

  private onChangeIcon() {
    log.debug("VuerdCore onChangeIcon");
    this.$emit("changeIcon", pluginManagement.icon.name);
  }

  private onChangeRemote() {
    log.debug("VuerdCore onChangeRemote");
    this.$emit("changeRemote", pluginManagement.remote.name);
  }

  private onKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.code === Key.KeyS) {
      // Ctrl + S
      event.preventDefault();
      pluginManagement.remote
        .save(treeEdits(treeStore.state.container))
        .then(() => {
          treeEditAllEnd(treeStore.state.container);
        })
        .catch(err => {
          log.error(err);
          eventBus.$emit(Bus.ToastBar.start, {
            message: err.toString()
          });
        });
    }
  }

  // ==================== Event Handler END ===================

  // ==================== Life Cycle ====================
  private created() {
    eventBus.$on(Bus.VuerdCore.sidebarStart, this.onSidebarStart);
    eventBus.$on(Bus.VuerdCore.sidebarEnd, this.onSidebarEnd);
    eventBus.$on(Bus.VuerdCore.changeTheme, this.onChangeTheme);
    eventBus.$on(Bus.VuerdCore.changeIcon, this.onChangeIcon);
    eventBus.$on(Bus.VuerdCore.changeRemote, this.onChangeRemote);

    pluginManagement.themeLoad(this.themeName);
    pluginManagement.iconLoad(this.iconName);
    pluginManagement.remoteLoad(this.remoteName);

    this.subKeydown = this.keydown$.subscribe(this.onKeydown);
  }

  private mounted() {
    treeStore.commit(Commit.folderInit);

    this.subResizeMovement = this.resize$.subscribe(this.onResizeMovement);
    this.subResize = this.resize$.subscribe(this.onResize);
    window.dispatchEvent(new Event("resize"));
  }

  private destroyed() {
    this.subResize.unsubscribe();
    this.subResizeMovement.unsubscribe();
    this.subKeydown.unsubscribe();
    eventBus.destroyed();
  }

  // ==================== Life Cycle END ====================
}
</script>

<style lang="scss">
@import "../../scss/NotoSans.scss";

.vuerd-core {
  height: 100vh;
  position: relative;
  overflow: hidden;
  min-width: $size-min-width;
  font-family: "Noto Sans", sans-serif;

  .workspace {
    height: 100%;
    position: relative;
    left: $size-activity-bar-width;
    overflow: hidden;
  }

  .main {
    height: 100%;
    position: relative;
    overflow: hidden;
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
    background: $color-scrollbar-thumb-active;
  }

  /* firefox */
  .scrollbar {
    scrollbar-color: $color-scrollbar-thumb $color-opacity;
    scrollbar-width: thin;
  }
}

body {
  margin: 0;
}
</style>
