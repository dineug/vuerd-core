<template lang="pug">
  div
    VuerdCore(v-if="load")
</template>

<script lang="ts">
import { componentInstance } from "@/plugins/vuerd-core";
import { Component, Watch, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
  private load: boolean = true;

  private onLoad() {
    this.load = false;
    this.$nextTick(() => {
      this.load = true;
    });
  }

  private created() {
    componentInstance.app = this;
  }
}
</script>
