<template lang="pug">
  .editor(:style="{ width: `${width}px`, height: `${height}px` }")
    SplitViewContainer(:container="container" :width="width" :height="height")
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
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

    private container: any = {
      vertical: true,
      horizontal: false,
      view: [
        {
          vertical: false,
          horizontal: true,
          view: [
            {
              vertical: true,
              horizontal: false,
              view: [],
            },
            {
              vertical: true,
              horizontal: false,
              view: [
                {
                  vertical: true,
                  horizontal: false,
                  view: [],
                },
                {
                  vertical: false,
                  horizontal: true,
                  view: [],
                },
                {
                  vertical: true,
                  horizontal: false,
                  view: [],
                },
              ],
            },
            {
              vertical: true,
              horizontal: false,
              view: [],
            },
          ],
        },
        {
          vertical: false,
          horizontal: true,
          view: [],
        },
      ],
    };
  }
</script>

<style scoped lang="scss">
  .editor {
    position: absolute;
    overflow: hidden;
    background-color: $color-editor;
  }
</style>
