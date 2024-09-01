<template>
  <div class="toolbar">
    <button @click="insertText('**bold**')">Bold</button>
    <button @click="insertText('*italic*')">Italic</button>
    <button @click="insertText('# Heading 1\n')">H1</button>
    <button @click="insertText('## Heading 2\n')">H2</button>
    <button @click="insertText('- List item\n')">List</button>
    <button @click="insertText('[Link text](http://example.com)')">Link</button>
  </div>
</template>

<script>
export default {
  props: {
    textareaRef: {
      type: Object,
      default: null
    }
  },
  methods: {
    insertText(text) {

      console.log("insertText called with: ", text)
      const textarea = this.textareaRef;
      console.log("textarea is: ", textarea)
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        textarea.value = before + text + after;
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
      }
    }
  }
};
</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.toolbar {
  display: flex;
  flex-direction: row;
  gap: -1px;
  margin: $spacing-sm 0 0 0;

  button {
    border: 1px solid transparent;
    padding: $spacing-xs;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }
}
</style>