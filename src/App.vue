<template lang="pug">
  v-app
    Windows
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Windows from '@/components/editor/Windows.vue';

  @Component({
    components: {
      Windows,
    },
  })
  export default class App extends Vue {}
</script>
