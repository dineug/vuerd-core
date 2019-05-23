<template lang="pug">
  v-app
    .windows
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
  export default class Windows extends Vue {

  }
</script>

<style lang="scss">
  @import '../../scss/reset';
  @import '../../scss/vuetify';

  html {
    overflow-y: auto !important;
  }

  .windows {
    height: 100%;
    position: relative;
    overflow: hidden;
    color: $color-font;

    .workspace {
      height: 100%;
      position: relative;
      left: 50px;
      overflow: hidden;
    }

    .main {
      height: 100%;
      position: relative;

      left: 200px;
    }
  }
</style>
