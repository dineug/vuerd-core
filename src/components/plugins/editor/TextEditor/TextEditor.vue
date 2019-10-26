<template lang="pug">
  textarea.text-editor(
    :style="`color: ${color.font}; background-color: ${color.editor};`"
    :value="value"
    @change="onChange"
    @input="onInput"
    spellcheck="false"
  )
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { Color } from "@/types";

@Component
export default class TextEditor extends Vue {
  @Prop({ type: String, default: "" })
  private value!: string;
  @Prop({ type: Object, default: () => ({}) })
  private color!: Color;
  @Prop({ type: Boolean, default: false })
  private focus!: boolean;

  @Watch("focus")
  private watchFocus(focus: boolean) {
    const textarea = this.$el as HTMLTextAreaElement;
    if (focus) {
      textarea.focus();
    } else {
      textarea.blur();
    }
  }

  private onChange(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    // this.$emit("change", textarea.value);
  }

  private onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.$emit("input", textarea.value);
  }
}
</script>

<style scoped lang="scss">
.text-editor {
  width: 100%;
  height: 100%;

  padding: 0;
  border: none;
  resize: none;
  outline: none;
}
</style>
