<template>
  <Loading class="saving" v-if="saving" saving="saving" type="small" />
  
  <!-- Writing -->
  <div id="TipTapEditor" v-if="editable && !review">
    <div id="TipTapTools" class="max-width xl" v-if="editor">
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
      <section class="button-group undo-redo">
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

  <!-- Review -->
  <div id="TipTapReview" class="max-width xl review" v-if="editable && review">
    <!-- <section :class="['content']" v-html="deliverable.content.content" @mouseup="handleTextSelection"></section> -->
    <div id="TipTapTools" class="max-width xl" v-if="editor">
      <section class="button-group">
        <button @click="editor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('highlight') }">
          <Icon name="fluent:highlight-16-regular" size="1.5rem" />
        </button>
        <!-- Strikethrough -->
        <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
          <Icon name="fluent-mdl2:strikethrough" size="1rem" /> 
        </button>
      </section>
      <section class="button-group undo-redo">
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()" class="toolbar">
          <Icon name="fluent:arrow-undo-16-regular" size="1.5rem" />
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()" class="toolbar">
          <Icon name="fluent:arrow-redo-16-regular" size="1.5rem" />
        </button>
      </section>
    </div>
    <TiptapEditorContent @input="updateDeliverable" :editor="editor" class="max-width xl" ref="textareaRef"  @mouseup="handleTextSelection" />
    <div v-if="showCommentInput" class="floating-comment" :style="{ top: `${commentPosition.top}px`, left: `${commentPosition.left}px` }">
      <span v-html="selectedText"></span>
      <textarea v-model="commentText" placeholder="Add a comment"></textarea>
      <button @click="addComment">Add Comment</button>
    </div>
  </div>

  <!-- Not editable -->
  <div class="max-width xl not-editable" v-if="!editable">
    <section :class="['content']" v-html="deliverable.content.content"></section>
    <div v-if="showCommentInput" class="floating-comment" :style="{ top: `${commentPosition.top}px` }">
      <span v-html="selectedText"></span>
      <textarea v-model="commentText" placeholder="Add a comment"></textarea>
      <button @click="addComment">Add Comment</button>
    </div>
  </div>
</template>

<script setup>

import useDeliverables from '~/composables/useDeliverables';
import TiptapStarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';

const { saveDeliverableContent } = useDeliverables();
const saving = ref(false);
const textareaRef = ref(null);

const props = defineProps({
  deliverable: {
    type: Object,
    default: null,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  review: {
    type: Boolean,
    default: false,
  },
});

const deliverable = ref(props.deliverable);
const showCommentInput = ref(false);
const commentText = ref('');
const selectedText = ref('');
const commentPosition = ref({ top: 0, left: 0 });
const hasComments = ref(true);

const editor = useEditor({
  content: deliverable.value.content.content,
  extensions: [TiptapStarterKit,
    Highlight.configure({
      multicolors: true,
      HTMLAttributes: {
        class: 'highlighted',
      },
    }),
  ],
});

const handleTextSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    selectedText.value = selection.toString();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    // console.log(selectedText);
    // console.log(range);
    commentPosition.value = {
      top: rect.bottom + 6,
      left: rect.right,
    };
    showCommentInput.value = true;
  } else {
    showCommentInput.value = false;
  }
};

const addComment = () => {
  if (selectedText.value && commentText.value) {
    // Generate a unique ID for the comment
    const commentId = `comment-${Date.now()}`;

    // Append the comment to the highlighted text with a unique ID
    const content = deliverable.value.content.content;
    const newContent = content.replace(selectedText.value, `<span class="highlighted" data-comment-id="${commentId}">${selectedText.value}<span class="comment">${commentText.value}</span></span>`);
    deliverable.value.content.content = newContent;
    commentText.value = '';
    showCommentInput.value = false;

    // Log the comment ID and selected text for debugging
    console.log(`Comment ID: ${commentId}`);
    console.log(`Selected Text: ${selectedText.value}`);
  }
};

const tiptapDeliverable = ref({
  ...deliverable.value, 
  content: {
    type: 'markdown',
    content: ''
  }
});

watch(() => props.deliverable, (newDeliverable) => {
  deliverable.value = newDeliverable;
  tiptapDeliverable.value = {
    ...newDeliverable,
    content: {
      type: 'markdown',
      content: newDeliverable.content.content
    }
  };
  if (editor.value) {
    editor.value.commands.setContent(newDeliverable.content.content);
  }
}, { immediate: true });

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

const debouncedSaveDeliverableContent = debounce(() => saveDeliverableContent(tiptapDeliverable.value), 250);

function updateDeliverable() {
  saving.value = true;
  debouncedSaveDeliverableContent();
  saving.value = false;
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.floating-comment {
  position: fixed;
  background: white;
  box-shadow: $big-shadow;
  padding: $spacing-sm;
  border-radius: $br-xl;
  z-index: 1000;
  max-width: 300px;
  right: $spacing-sm * 3;
}

.highlighted {
  background-color: yellow;
  position: relative;
}

.comment {
  display: none;
  position: absolute;
  top: 100%;
  background: white;
  border: 1px solid #ccc;
  padding: 5px;
  z-index: 1000;
}

  .highlighted:hover .comment {
    display: block;
  }

#TipTapEditor,
#TipTapReview {
  width: 100%;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;

  // div {

  //   &:nth-child(2) {
  //     width: 100%;
  //     height: calc(100% - 72px);
  //     overflow-y: auto;
  //   }
  // }
}

#TipTapTools {
  display: flex;
  flex-wrap: nowrap;
  gap: $spacing-sm;
  margin: 0 0 $spacing-sm 0;
  align-items: center;
  justify-content: space-between;
  background: rgba($white, 0.85);
  backdrop-filter: blur(6px);
  padding: $spacing-xs;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
  overflow-x: auto;
  overflow-y: hidden;
  border-left: $border;
  border-right: $border;
  border-bottom: $border;
  border-radius: 0 0 $br-lg $br-lg;

  @media (max-width: 1180px) {
    gap: $spacing-xxs;
    overflow-x: auto;
    overflow-y: hidden;
    padding: $spacing-xxs $spacing-sm;
    align-items: center;
    justify-content: flex-start;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }

  .button-group {
    display: flex;
    gap: $spacing-xxxs;
    
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

.not-editable {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: $white;
  color: $black-light;

  .content {
    padding: $spacing-sm;
    border-radius: $br-lg;
    white-space: pre-wrap;
    word-wrap: break-word;
    height: 100%;

    &.with-comments {
      margin-right: 300px;
    }
  }

  @media (max-width: 960px) {
      padding: $spacing-md;
  }

  @media (max-width: 600px) {
      padding: $spacing-md 0;
  }
  
  .notification {
    margin-bottom: $spacing-md;
  }
}

</style>