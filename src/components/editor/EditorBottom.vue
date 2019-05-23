<template lang="pug">
  .editor-bottom
    Title
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Title from './EditorBottom/Title.vue';

  @Component({
    components: {
      Title,
    },
  })
  export default class EditorBottom extends Vue {
  }
</script>

<style scoped lang="scss">
  .editor-bottom {
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: $color-editor;

    height: 200px;
  }
</style>
