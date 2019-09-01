<template lang="pug">
  ul.actions-container
    li(
      v-for="menu in menus"
      :key="menu.id"
      :class="{active: activeMenu && menu.id === activeMenu.id}"
      :title="menu.name"
      @click="menu.execute"
    )
      MDIcon {{menu.icon}}
</template>

<script lang="ts">
  import activitybarStore, {ActivityMenu} from '@/store/activitybar';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import MDIcon from '@/components/editor/MDIcon.vue';

  @Component({
    components: {
      MDIcon,
    },
  })
  export default class ActionsContainer extends Vue {

    get menus(): ActivityMenu[] {
      return activitybarStore.state.menus;
    }

    get activeMenu(): ActivityMenu | null {
      return activitybarStore.state.activeMenu;
    }

  }
</script>

<style scoped lang="scss">
  .actions-container {
    text-align: center;
    padding: 0;
    cursor: pointer;

    li {
      padding: 5px 0;

      &.active {
        color: white;
      }
    }
  }

  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
