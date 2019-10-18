<template lang="pug">
  .editor-bottom(:style="`height: ${height}px; background-color: ${theme.editor};`")
    slot
    Title
</template>

<script lang="ts">
import themeStore, { State as ThemeState } from '@/store/theme'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Title from './EditorBottom/Title.vue'

@Component({
  components: {
    Title
  }
})
export default class EditorBottom extends Vue {
  @Prop({type: Number, default: 200})
  private height!: number

  get theme (): ThemeState {
    return themeStore.state
  }
}
</script>

<style scoped lang="scss">
  .editor-bottom {
    width: 100%;
    position: absolute;
    bottom: 0;
  }
</style>
