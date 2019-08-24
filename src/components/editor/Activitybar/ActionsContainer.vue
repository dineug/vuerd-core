<template lang="pug">
  ul.actions-container
    li
      MDIcon mdi-file-multiple
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import MDIcon from '@/components/editor/MDIcon.vue';

  @Component({
    components: {
      MDIcon,
    },
  })
  export default class ActionsContainer extends Vue {
  }
</script>

<style scoped lang="scss">
  .actions-container {
    text-align: center;
    padding: 0;
    cursor: pointer;

    li {
      padding: 5px 0;
    }
  }
</style>
