<template lang="pug">
  .editor(:style="{ width: `${width}px`, height: `${height}px` }")
    SplitViewContainer(:container="container")
</template>

<script lang="ts">
  import View from '@/model/View';
  import store from '@/store/splitView';
  import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
  import SplitViewContainer from './Editor/SplitViewContainer.vue';

  @Component({
    components: {
      SplitViewContainer,
    },
  })
  export default class Editor extends Vue {
    @Prop({type: Number, default: 2000})
    private readonly width!: number;
    @Prop({type: Number, default: 1000})
    private readonly height!: number;

    get container(): View {
      return store.getters.container;
    }

    @Watch('width')
    private watchWidth() {
      this.container.width = this.width;
      store.dispatch({
        type: 'resetWidth',
        id: this.container.id,
      });
    }

    @Watch('height')
    private watchHeight() {
      this.container.height = this.height;
      store.dispatch({
        type: 'resetHeight',
        id: this.container.id,
      });
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
