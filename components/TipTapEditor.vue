<template>
  <div id="TipTapEditor">
    <div id="TipTapTools" v-if="editor">
      <section class="button-group">
        <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="toolbar">
          <Icon name="fluent-mdl2:bold" size="1rem" /> 
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="toolbar">
          <Icon name="fluent-mdl2:italic" size="1rem" /> 
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" class="toolbar">
          <Icon name="fluent-mdl2:strikethrough" size="1rem" /> 
        </button>
        <button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }" class="toolbar">
          <Icon name="fluent:code-16-regular" size="1.5rem" /> 
        </button>
        <button @click="editor.chain().focus().unsetAllMarks().run()" class="toolbar">
          <Icon name="fluent:clear-formatting-16-regular" size="1.5rem" /> 
        </button>
      </section>
      <section class="button-group">
        <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }" class="toolbar">
          P
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" class="toolbar">
          h1
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="toolbar">
          h2
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" class="toolbar">
          h3
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }" class="toolbar">
          h4
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }" class="toolbar">
          h5
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }" class="toolbar">
          h6
        </button>
      </section>
      <section class="button-group">
        <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="toolbar">
          <Icon name="fluent:text-bullet-list-16-regular" size="1.5rem" /> 
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" class="toolbar">
          <Icon name="fluent:text-number-list-16-regular" size="1.5rem" /> 
        </button>
      </section>
      <section class="button-group">
        <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }" class="toolbar">
          <Icon name="fluent:code-block-16-regular" size="1.5rem" />
        </button>
        <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" class="toolbar">
          <Icon name="fluent:text-quote-16-filled" size="1.5rem" />
        </button>
        <button @click="editor.chain().focus().setHorizontalRule().run()" class="toolbar">
          <Icon name="codicon:horizontal-rule" size="1.5rem" />
        </button>
        <button @click="editor.chain().focus().setHardBreak().run()" class="toolbar">
          <Icon name="fluent:document-page-break-24-regular" size="1.5rem" />
        </button>
      </section>
      <section class="button-group">
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()" class="toolbar">
          <Icon name="fluent:arrow-undo-16-regular" size="1.5rem" />
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()" class="toolbar">
          <Icon name="fluent:arrow-redo-16-regular" size="1.5rem" />
        </button>
      </section>
    </div>
    <TiptapEditorContent @input="updateDeliverable" :editor="editor" class="max-width xl" ref="textareaRef" />
  </div>
</template>

<script setup>

import useDeliverables from '~/composables/useDeliverables';
const { saveDeliverableContent, deleteDeliverableModal, updateDeliverableTitle, updateDeliverableDescription } = useDeliverables();

const supabase = useSupabaseClient();
const loading = ref(true);
const textareaRef = ref(null);

const props = defineProps({
  deliverable: {
    type: Object,
    default: null,
  },
});

const deliverable = ref(props.deliverable);

const editor = useEditor({
  content: deliverable.value.content.content, // this is what should be pulling from 
  extensions: [TiptapStarterKit],
});

const tiptapDeliverable = ref({
  ...deliverable.value, 
  content: {
    type: 'markdown',
    content: ''
  }
});

console.log('tiptapDeliverable', tiptapDeliverable);

watch(editor, (newEditor) => {
  if (newEditor) {
    newEditor.on('update', () => {
      tiptapDeliverable.value.content.content = newEditor.getHTML();
    });
  }
});

onBeforeUnmount(() => {
  unref(editor).destroy();
});

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedSaveDeliverableContent = debounce(() => saveDeliverableContent(tiptapDeliverable.value), 1000);

function updateDeliverable() {
  debouncedSaveDeliverableContent();
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#TipTapEditor {
  display: flex;
  flex-direction: column;
  width: calc(100% - 2 * $spacing-sm);
  height: calc(100% - $spacing-sm);
  margin: $spacing-sm $spacing-sm 0;
  border: $border;
  border-radius: $br-lg;
  overflow: hidden;

  div {

    &:nth-child(2) {
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
  }

  #TipTapTools {
    display: flex;
    flex-wrap: nowrap;
    gap: $spacing-sm;
    margin: 0;
    align-items: center;
    justify-content: center;
    background: rgba($brand, 0.05);
    border-radius: $br-md;

    @media (max-width: 1180px) {
      gap: $spacing-xxs;
      overflow-x: auto;
      overflow-y: hidden;
      padding: $spacing-xs $spacing-sm;
      align-items: center;
      justify-content: flex-start;
    }

    .button-group {
      display: flex;
      gap: $spacing-xxxs;
      padding: $spacing-xxxs;
      border-radius: $br-md;
      border-right: $border;
      padding-right: $spacing-sm;
      min-height: 35px;
      
      @media (max-width: 1180px) {
        padding-right: $spacing-xxs;
      }

      &:last-child {
        border-right: none;
      }
    }

    button {
      cursor: pointer;
      
      @media (max-width: 1480px) {
        padding: $spacing-xxs $spacing-xxs;
        min-width: 28px;
      }

      &.is-active {
        background-color: $brand;
        color: $white;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }
}

</style>