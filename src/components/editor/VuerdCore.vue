<template lang="pug">
  v-app
    .vuerd-core
      Titlebar
      Activitybar
      .workspace
        Sidebar
        .main
          Editor
          EditorBottom
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Titlebar from './Titlebar.vue';
  import Activitybar from './Activitybar.vue';
  import Sidebar from './Sidebar.vue';
  import Editor from './Editor.vue';
  import EditorBottom from './EditorBottom.vue';

  @Component({
    components: {
      Titlebar,
      Activitybar,
      Sidebar,
      Editor,
      EditorBottom,
    },
  })
  export default class VuerdCore extends Vue {

  }
</script>

<style lang="scss">
  @import '../../scss/reset.scss';
  @import '../../scss/vuetify.scss';

  html {
    overflow-y: auto !important;
  }

  .vuerd-core {
    height: 100%;
    position: relative;
    overflow: hidden;
    color: $color-font;

    .workspace {
      height: 100%;
      position: relative;
      left: $size-activitybar-width;
      overflow: hidden;
    }

    .main {
      height: 100%;
      position: relative;

      left: 200px;
      width: 1000px;
    }
  }
</style>
