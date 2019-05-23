<template lang="pug">
  VuerdCore
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import VuerdCore from '@/components/editor/VuerdCore.vue';

  @Component({
    components: {
      VuerdCore,
    },
  })
  export default class App extends Vue {
  }
</script>
