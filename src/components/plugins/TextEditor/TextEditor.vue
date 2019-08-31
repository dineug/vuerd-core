<template lang="pug">
  textarea.text-editor(
    :value="value"
    @change="onChange"
    @input="onInput"
    spellcheck="false"
  )
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class TextEditor extends Vue {
    private value: string = '';

    private onChange(event: Event) {
      const textarea = event.target as HTMLTextAreaElement;
      this.$emit('change', textarea.value);
    }

    private onInput(event: Event) {
      const textarea = event.target as HTMLTextAreaElement;
      this.$emit('input', textarea.value);
    }

  }
</script>

<style scoped lang="scss">
  .text-editor {
    width: 100%;
    height: 100%;

    border: none;
    resize: none;
    outline: none;

    color: #cccccc;
    background-color: #282c34;
  }
</style>
