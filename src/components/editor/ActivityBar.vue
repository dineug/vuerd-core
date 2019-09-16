<template lang="pug">
  .activitybar(:style="`background-color: ${theme.activityBar};`")
    .content
      ActionsContainer
</template>

<script lang="ts">
  import themeStore, {State as ThemeState} from '@/store/theme';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import ActionsContainer from './ActivityBar/ActionsContainer.vue';

  @Component({
    components: {
      ActionsContainer,
    },
  })
  export default class ActivityBar extends Vue {
    get theme(): ThemeState {
      return themeStore.state;
    }
  }
</script>

<style scoped lang="scss">
  .activitybar {
    width: $size-activitybar-width;
    height: 100%;
    position: absolute;

    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
</style>
