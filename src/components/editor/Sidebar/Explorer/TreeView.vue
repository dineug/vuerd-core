<template lang="pug">
  ul.tree-view
    li(
      v-for="node in trees"
      :key="node.id"
    )
      span.arrow(@click="onSelect($event, node, node.children !== undefined)")
        MDIcon(
          v-if="node.children"
          :size="16"
        ) {{node.open ? 'mdi-chevron-down' : 'mdi-chevron-right'}}
        .none-arrow(v-else)
      span.node(
        draggable="true"
        :style="folder && node.id === folder.id ? `color: ${theme.fontActive}; background-color: ${theme.active};` : ''"
        :data-id="node.id"
        :data-folder="node.children !== undefined"
        @mousedown="onMousedown"
        @dragstart="onDragstart($event, node)"
        @dragend="onDragend"
        @click="onSelect($event, node)"
        @dblclick="onOpenFile($event, node)"
      )
        span.icon
          Icon(v-if="node.children" folder :open="node.open")
          Icon(v-else :name="node.name")
        input.name(
          v-if="renameTree && node.id === renameTree.id"
          type="text"
          v-focus
          :style="`width: ${editWidth}px;`"
          :value="node.name"
          @input="onInputName($event, node)"
          @blur="onRenameEnd"
        )
        span.name(v-else) {{node.name}}
      transition(
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      )
        TreeView(
          v-if="node.open && node.children && node.children.length !== 0"
          :trees="node.children"
          :width="width"
          :depth="depth + 1"
          :data-id="node.id"
        )
</template>

<script lang="ts">
import { SIZE_TREE_HEIGHT, SIZE_SCROLLBAR } from '@/ts/layout'
import { log, getData, validFileName } from '@/ts/util'
import eventBus, { Bus } from '@/ts/EventBus'
import { findById, childrenCount } from '@/store/tree/treeHelper'
import treeStore, { Tree, Commit } from '@/store/tree'
import viewStore, { Commit as ViewCommit } from '@/store/view'
import themeStore, { State as ThemeState } from '@/store/theme'
import AnimationFrame from '@/ts/AnimationFrame'
import { Component, Prop, Vue } from 'vue-property-decorator'
import MDIcon from '@/components/editor/MDIcon.vue'
import Icon from '@/components/editor/Icon.vue'

import { fromEvent, Subscription } from 'rxjs'
import { throttleTime } from 'rxjs/operators'

interface DraggableObservable {
  subDragover: Subscription
  subDragleave: Subscription
}

interface OpenAnimation {
  opacity: number
  height: number
}

const PADDING_LEFT = 53 + SIZE_SCROLLBAR
const PADDING_DEPTH = 10

@Component({
  components: {
    MDIcon,
    Icon
  },
  directives: {
    focus: {
      inserted (el: HTMLElement) {
        el.focus()
      }
    }
  }
})
export default class TreeView extends Vue {
  @Prop({type: Array, default: () => []})
  private trees!: Tree[]
  @Prop({type: Number, default: 200})
  private width!: number
  @Prop({type: Number, default: 0})
  private depth!: number

  private draggableObservable: DraggableObservable[] = []
  private openAnimation: AnimationFrame<OpenAnimation> | null = null

  get folder (): Tree | null {
    return treeStore.state.folder
  }

  get renameTree (): Tree | null {
    return treeStore.state.renameTree
  }

  get editWidth (): number {
    return this.width - PADDING_LEFT - (this.depth * PADDING_DEPTH)
  }

  get theme (): ThemeState {
    return themeStore.state
  }

  private findNodeByElement (el: HTMLElement | null): HTMLElement | null {
    if (el === null) {
      return null
    } else if (el.localName === 'span' && el.className === 'node') {
      return el
    }
    return this.findNodeByElement(el.parentElement)
  }

  // ==================== Event Handler ===================
  private onInputName (event: Event, tree: Tree) {
    log.debug('TreeView onInputName')
    if (event.target) {
      const el = event.target as HTMLInputElement
      el.value = validFileName(el.value)
      tree.name = el.value
    }
  }

  private onRenameEnd () {
    log.debug('TreeView onRenameEnd')
    treeStore.commit(Commit.fileRenameEnd)
  }

  private onSelect (event: MouseEvent, tree: Tree) {
    log.debug('TreeView onSelect')
    if (tree.children && !event.ctrlKey && !event.shiftKey) {
      tree.open = !tree.open
    } else if (!tree.children) {
      viewStore.commit(ViewCommit.tabAddPreviewStart, tree)
    }
    treeStore.commit(Commit.fileSelectStart, {event, tree})
  }

  private onOpenFile (event: MouseEvent, tree: Tree) {
    log.debug('TreeView onOpenFile')
    if (!tree.children) {
      viewStore.commit(ViewCommit.tabAdd, tree)
    }
  }

  private onMousedown () {
    log.debug('TreeView onMousedown')
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
    }
  }

  private onDragstart (event: DragEvent, tree: Tree) {
    log.debug('TreeView onDragstart')
    treeStore.commit(Commit.folderDraggableStart, tree)
    eventBus.$emit(Bus.TreeView.draggableStart)
    // firefox
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', tree.id)
    }
  }

  private onDragend () {
    log.debug('TreeView onDragend')
    treeStore.commit(Commit.folderMove)
    treeStore.commit(Commit.folderActiveEnd)
    treeStore.commit(Commit.folderDraggableEnd)
    eventBus.$emit(Bus.TreeView.draggableEnd)
  }

  private onDraggableStart () {
    log.debug('TreeView onDraggableStart')
    const targets: ChildNode[] = []
    const ul = this.$el as HTMLElement
    ul.childNodes.forEach((child: ChildNode) => targets.push(child.childNodes[1]))
    log.debug(`trees:${this.trees.length}, el:${targets.length}`)
    targets.forEach((child: ChildNode) => {
      const el = child as HTMLElement
      if (el.dataset.folder === 'true') {
        this.draggableObservable.push({
          subDragover: fromEvent<DragEvent>(el, 'dragover').pipe(
            throttleTime(100)
          ).subscribe(this.onDragoverFolder),
          subDragleave: fromEvent<DragEvent>(el, 'dragleave').subscribe(this.onDragleaveFolder)
        })
      }
    })
  }

  private onDraggableEnd () {
    log.debug('TreeView onDraggableEnd')
    this.draggableObservable.forEach((draggable: DraggableObservable) => {
      draggable.subDragover.unsubscribe()
      draggable.subDragleave.unsubscribe()
    })
    this.draggableObservable = []
  }

  private onDragoverFolder (event: DragEvent) {
    log.debug('TreeView onDragoverFolder')
    const target = this.findNodeByElement(event.target as HTMLElement)
    if (target && target.dataset.id) {
      const tree = getData(this.trees, target.dataset.id)
      if (tree) {
        treeStore.commit(Commit.folderActiveStart, tree)
        this.$forceUpdate()
      }
    }
  }

  private onDragleaveFolder () {
    log.debug('TreeView onDragleaveFolder')
    treeStore.commit(Commit.folderActiveEnd)
  }

  private onBeforeEnter (el: HTMLElement) {
    el.style.opacity = '0'
    el.style.height = '0'
  }

  private onEnter (el: HTMLElement, done: () => void) {
    if (el.dataset.id) {
      const tree = findById(treeStore.state.container, el.dataset.id)
      if (tree) {
        if (this.openAnimation) {
          this.openAnimation.stop()
        }
        this.openAnimation = new AnimationFrame(
          {
            opacity: 0,
            height: 0
          },
          {
            opacity: 1,
            height: childrenCount(tree) * SIZE_TREE_HEIGHT
          }, 200).update((value: OpenAnimation) => {
          el.style.opacity = `${value.opacity}`
          el.style.height = `${value.height}px`
        }).complete(() => {
          done()
          el.removeAttribute('style')
        }).start()
      }
    }
  }

  private onLeave (el: HTMLElement, done: () => void) {
    if (this.openAnimation) {
      this.openAnimation.stop()
    }
    this.openAnimation = new AnimationFrame(
      {
        opacity: 1,
        height: el.clientHeight
      },
      {
        opacity: 0,
        height: 0
      }, 200).update((value: OpenAnimation) => {
      el.style.opacity = `${value.opacity}`
      el.style.height = `${value.height}px`
    }).complete(done).start()
  }

  // ==================== Event Handler END ===================

  // ==================== Life Cycle ====================
  private created () {
    eventBus.$on(Bus.TreeView.draggableStart, this.onDraggableStart)
    eventBus.$on(Bus.TreeView.draggableEnd, this.onDraggableEnd)
  }

  private destroyed () {
    eventBus.$off(Bus.TreeView.draggableStart, this.onDraggableStart)
    eventBus.$off(Bus.TreeView.draggableEnd, this.onDraggableEnd)
  }

  // ==================== Life Cycle END ====================
}
</script>

<style scoped lang="scss">
  .tree-view {
    padding-left: 0;
    position: relative;
    z-index: 200;
    height: 100%;

    li {
      padding-left: 10px;
      white-space: nowrap;
      overflow: hidden;

      .arrow {
        cursor: pointer;

        .none-arrow {
          display: inline-block;
          width: 15px;
          height: 15px;
        }
      }

      .node {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        height: $size-tree-height;

        .icon {
          padding-right: 4px;
          height: $size-tree-height;
        }

        .name {
          font-size: $size-font + 2;
        }
      }
    }
  }

  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
