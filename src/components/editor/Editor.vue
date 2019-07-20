<template lang="pug">
  .editor(:style="{ width: `${width}px`, height: `${height}px` }")
    ViewContainer(:container="container")
</template>

<script lang="ts">
  import View from '@/models/View';
  import viewStore from '@/store/view';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
  import ViewContainer from './Editor/ViewContainer.vue';

  @Component({
    components: {
      ViewContainer,
    },
  })
  export default class Editor extends Vue {
    @Prop({type: Number, default: 2000})
    private readonly width!: number;
    @Prop({type: Number, default: 1000})
    private readonly height!: number;

    get container(): View {
      return viewStore.getters.container;
    }

    @Watch('width')
    private watchWidth() {
      this.container.width = this.width;
      viewStore.commit('resetWidth', {id: this.container.id});
    }

    @Watch('height')
    private watchHeight() {
      this.container.height = this.height;
      viewStore.commit('resetHeight', {id: this.container.id});
    }

  }
</script>

<style scoped lang="scss">
  .editor {
    position: absolute;
    overflow: hidden;
    background-color: $color-editor;
  }
</style>
