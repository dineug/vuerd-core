<template lang="pug">
  ul.actions-container
    li
      v-icon(color="grey lighten-1" medium) insert_drive_file
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class ActionsContainer extends Vue {
  }
</script>

<style scoped lang="scss">
  .actions-container {
    text-align: center;
    list-style-type: none;
    padding: 0;
    cursor: pointer;

    li {
      padding: 5px 0;
    }
  }
</style>
