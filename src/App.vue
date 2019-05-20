<template lang="pug">
  v-app
    v-btn(color="success") Success
    // hello-world(msg="Welcome to Your Vue.js + TypeScript App")
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  // import HelloWorld from './components/HelloWorld.vue';

  @Component({
    components: {
      // HelloWorld,
    },
  })
  export default class App extends Vue {}
</script>

<style lang="scss">

</style>
