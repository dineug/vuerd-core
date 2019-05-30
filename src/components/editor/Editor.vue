<template lang="pug">
  .editor(:style="{ width: `${width}px`, height: `${height}px` }")
    SplitViewContainer(:container="container")
</template>

<script lang="ts">
  import {log} from '@/ts/util';
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

    @Watch('width')
    private watchWidth() {
      store.commit('setWidth', {
        id: this.container.id,
        width: this.width,
      });
      store.dispatch('resetWidth', {id: this.container.id});
    }

    @Watch('height')
    private watchHeight() {
      store.commit('setHeight', {
        id: this.container.id,
        height: this.height,
      });
      store.dispatch('resetHeight', {id: this.container.id});
    }

    get container() {
      return store.getters.container;
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
