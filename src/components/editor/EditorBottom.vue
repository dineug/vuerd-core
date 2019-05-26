<template lang="pug">
  .editor-bottom(:style="{ height: `${height}px` }")
    slot
    Title
</template>

<script lang="ts">
  import {log} from '@/ts/util';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Title from './EditorBottom/Title.vue';

  @Component({
    components: {
      Title,
    },
  })
  export default class EditorBottom extends Vue {
    @Prop({type: Number, default: 200})
    private readonly height!: number;
  }
</script>

<style scoped lang="scss">
  .editor-bottom {
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: $color-editor;
  }
</style>
