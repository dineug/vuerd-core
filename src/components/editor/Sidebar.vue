<template lang="pug">
  .sidebar(
    :style="{ width: `${width}px` }"
    @dragover="onDragover"
    @drop="onDrop"
  )
    Explorer(:width="width")
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Explorer from './Sidebar/Explorer.vue';

  @Component({
    components: {
      Explorer,
    },
  })
  export default class Sidebar extends Vue {
    @Prop({type: Number, default: 200})
    private width!: number;

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
    background-color: $color-sidebar;
  }
</style>
