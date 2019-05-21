<template lang="pug">
  .windows
    Activitybar
    Sidebar
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Activitybar from './Activitybar.vue';
  import Sidebar from './Sidebar.vue';

  @Component({
    components: {
      Activitybar,
      Sidebar,
    },
  })
  export default class Windows extends Vue {

  }
</script>

<style lang="scss">
  @import '../../scss/reset';
  @import '../../scss/vuetify';

  .windows {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: relative;
    height: 100%;
    overflow: hidden;
    color: $color-font;
  }
</style>
