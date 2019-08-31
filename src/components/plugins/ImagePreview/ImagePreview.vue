<template lang="pug">
  .image-preview
    img(v-if="value.indexOf('http') !== -1" :src="value")
    .svg(v-else-if="scope === 'svg'" v-html="value")
    img(v-else :src="value")
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class ImagePreview extends Vue {
    @Prop({type: String, default: ''})
    private value!: string;
    @Prop({type: String, default: ''})
    private scope!: string;
  }
</script>

<style scoped lang="scss">
  .image-preview {

  }
</style>
