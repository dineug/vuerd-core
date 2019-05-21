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
    background-color: $color-sidebar;
    top: 30px;
    bottom: 22px;
    left: 50px;
    position: absolute;
    height: 100%;
    width: 200px;
  }
</style>
