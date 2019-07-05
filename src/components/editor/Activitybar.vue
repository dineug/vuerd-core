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
    width: $size-activitybar-width;
    height: 100%;
    position: absolute;
    background-color: $color-activity;

    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
</style>
