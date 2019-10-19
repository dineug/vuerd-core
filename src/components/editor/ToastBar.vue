<template lang="pug">
  transition-group.toast-bar(name="toast" tag="ul")
    li.toast-bar-container(:style="toastStyle" v-for="toastBar in toastBars" :key="toastBar.id")
      .toast-bar-header
        span.close(@click="onClose(toastBar)")
          MDIcon(:size="12") mdi-close
      .toast-bar-body(v-html="toastBar.message")
</template>

<script lang="ts">
import eventBus, { Bus } from "@/ts/EventBus";
import themeStore, { State as ThemeState } from "@/store/theme";
import ToastBarImpl, { ToastBar as ToastBarModel } from "@/models/ToastBar";
import { Component, Vue } from "vue-property-decorator";
import MDIcon from "./MDIcon.vue";

@Component({
  components: {
    MDIcon
  }
})
export default class ToastBar extends Vue {
  private toastBars: ToastBarImpl[] = [];

  get theme(): ThemeState {
    return themeStore.state;
  }

  get toastStyle(): string {
    return `
        background-color: ${this.theme.sidebar};
      `;
  }

  private onStart(toastBar: ToastBarModel) {
    const toastBarModel = new ToastBarImpl(toastBar);
    this.toastBars.push(toastBarModel);
    if (toastBarModel.millisecond !== 0) {
      setTimeout(() => {
        const index = this.toastBars.indexOf(toastBarModel);
        if (index !== -1) {
          this.toastBars.splice(index, 1);
        }
      }, toastBarModel.millisecond);
    }
  }

  private onClose(toastBar: ToastBarImpl) {
    const index = this.toastBars.indexOf(toastBar);
    if (index !== -1) {
      this.toastBars.splice(index, 1);
    }
  }

  private created() {
    eventBus.$on(Bus.ToastBar.start, this.onStart);
  }

  private destroyed() {
    eventBus.$off(Bus.ToastBar.start, this.onStart);
  }
}
</script>

<style scoped lang="scss">
.toast-bar {
  position: fixed;
  z-index: 9999999;
  right: 50px;
  bottom: 50px;
  display: flex;
  flex-direction: column;

  .toast-bar-container {
    padding: 8px 16px 16px 16px;
    margin-top: 20px;
    width: 200px;
    box-shadow: 0 0 6px 0 black;

    .toast-bar-header {
      display: flex;
      flex-direction: row-reverse;

      .close {
        cursor: pointer;
      }
    }

    .toast-bar-body {
    }
  }
}

/* animation */
.toast-move {
  transition: transform 0.3s;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter,
.toast-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

ul,
ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
