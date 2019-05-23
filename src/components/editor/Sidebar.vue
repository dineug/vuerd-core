<template lang="pug">
  .sidebar
    Title
    Content
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Title from './Sidebar/Title.vue';
  import Content from './Sidebar/Content.vue';

  @Component({
    components: {
      Title,
      Content,
    },
  })
  export default class Sidebar extends Vue {
  }
</script>

<style scoped lang="scss">
  .sidebar {
    height: 100%;
    position: absolute;
    background-color: $color-sidebar;

    width: 200px;
  }
</style>
