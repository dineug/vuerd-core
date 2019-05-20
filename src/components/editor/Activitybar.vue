<template lang="pug">
  .activitybar
    .content
      ActionsContainer
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import ActionsContainer from './Activitybar/ActionsContainer.vue';

  @Component({
    components: {
      ActionsContainer,
    },
  })
  export default class Activitybar extends Vue {

  }
</script>

<style scoped lang="scss">
  .activitybar {
    background-color: $color-activity;
    top: 30px;
    bottom: 0;
    left: 0;
    position: absolute;
    height: 100%;

    .content {
      width: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
</style>
