<template lang="pug">
  .sidebar(:style="{ width: `${width}px` }")
    Title
    Content
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Title from './Sidebar/Title.vue';
  import Content from './Sidebar/Content.vue';

  @Component({
    components: {
      Title,
      Content,
    },
  })
  export default class Sidebar extends Vue {
    @Prop({type: Number, default: 200})
    private readonly width!: number;
  }
</script>

<style scoped lang="scss">
  .sidebar {
    height: 100%;
    position: absolute;
    background-color: $color-sidebar;
  }
</style>
