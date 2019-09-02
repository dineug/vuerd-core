<template lang="pug">
  .sidebar(
    :style="`width: ${width}px; background-color: ${theme.sidebar};`"
    @dragover="onDragover"
    @drop="onDrop"
  )
    Explorer(v-if="activeMenu && activeMenu.name === 'explorer'" :width="width")
    Plugin(v-else-if="activeMenu && activeMenu.name === 'plugin'")
</template>

<script lang="ts">
  import themeStore, {State as ThemeState} from '@/store/theme';
  import activityBarStore, {ActivityMenu} from '@/store/activityBar';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Explorer from './Sidebar/Explorer.vue';
  import Plugin from './Sidebar/Plugin.vue';

  @Component({
    components: {
      Explorer,
      Plugin,
    },
  })
  export default class Sidebar extends Vue {
    @Prop({type: Number, default: 200})
    private width!: number;

    get theme(): ThemeState {
      return themeStore.state;
    }

    get activeMenu(): ActivityMenu | null {
      return activityBarStore.state.activeMenu;
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

  }
</script>

<style scoped lang="scss">
  .sidebar {
    height: 100%;
    position: absolute;
  }
</style>
