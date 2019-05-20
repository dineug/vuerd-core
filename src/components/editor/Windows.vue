<template lang="pug">
  .windows
    Activitybar
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Activitybar from './Activitybar.vue';

  @Component({
    components: {
      Activitybar,
    },
  })
  export default class Windows extends Vue {

  }
</script>

<style lang="scss">
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
