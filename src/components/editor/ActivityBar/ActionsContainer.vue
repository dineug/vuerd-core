<template lang="pug">
  ul.actions-container
    li(
      v-for="menu in menus"
      :key="menu.id"
      :style="activeMenu && menu.id === activeMenu.id ? `color: ${theme.fontActive};` : ''"
      :title="menu.name"
      @click="menu.execute"
    )
      MDIcon(:color="activeMenu && menu.id === activeMenu.id ? theme.fontActive : theme.font") {{menu.icon}}
</template>

<script lang="ts">
import themeStore, { State as ThemeState } from "@/store/theme";
import activityBarStore, { ActivityMenu } from "@/store/activityBar";
import { Component, Vue } from "vue-property-decorator";
import MDIcon from "@/components/editor/MDIcon.vue";

@Component({
  components: {
    MDIcon
  }
})
export default class ActionsContainer extends Vue {
  get menus(): ActivityMenu[] {
    return activityBarStore.state.menus;
  }

  get activeMenu(): ActivityMenu | null {
    return activityBarStore.state.activeMenu;
  }

  get theme(): ThemeState {
    return themeStore.state;
  }
}
</script>

<style scoped lang="scss">
.actions-container {
  text-align: center;
  padding: 0;
  cursor: pointer;

  li {
    padding: 10px 0;
  }
}

ul,
ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
