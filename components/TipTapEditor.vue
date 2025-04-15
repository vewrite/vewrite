<template>
  <Loading class="saving" v-if="saving" saving="saving" type="tiny" />
  
  <!-- Requirements -->
  <div v-if="props.type == 'requirements'" class="TipTapEditor requirements">
    <div class="TipTapTools" v-if="requirementsEditor">
      <section class="button-group">
        <button @click="requirementsEditor.chain().focus().toggleBold().run()" :disabled="!requirementsEditor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': requirementsEditor.isActive('bold') }" class="toolbar">
          <Icon name="fluent:text-bold-16-regular" size="1.15rem" />
        </button>
        <button @click="requirementsEditor.chain().focus().unsetAllMarks().run()" class="toolbar">
          <Icon name="fluent:clear-formatting-16-regular" size="1.15rem" /> 
        </button>
        <button @click="requirementsEditor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': requirementsEditor.isActive('bulletList') }" class="toolbar">
          <Icon name="fluent:text-bullet-list-16-regular" size="1.15rem" /> 
        </button>
        <button @click="requirementsEditor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': requirementsEditor.isActive('orderedList') }" class="toolbar">
          <Icon name="fluent:text-number-list-16-regular" size="1.15rem" /> 
        </button>

        <div class="vertical-divider"></div>

        <!-- Links -->
        <button @click="setLink(requirementsEditor)" class="toolbar" :class="{ 'is-active': requirementsEditor.isActive('link') }">
          <Icon name="fluent:link-16-regular" size="1.15rem" />
        </button>
        <button @click="requirementsEditor.chain().focus().unsetLink().run()" class="toolbar" :disabled="!requirementsEditor.isActive('link')">
          <Icon name="fluent:link-dismiss-16-regular" size="1.15rem" />
        </button>

        <div class="vertical-divider"></div>

        <!-- Image -->
        <button @click="openAddImageModal()" class="toolbar">
          <Icon name="fluent:image-16-regular" size="1.15rem" />
        </button>

      </section>
      <section class="button-group undo-redo">
        <button @click="requirementsEditor.chain().focus().undo().run()" :disabled="!requirementsEditor.can().chain().focus().undo().run()" class="toolbar">
          <Icon name="fluent:arrow-undo-16-regular" size="1.15rem" />
        </button>
        <button @click="requirementsEditor.chain().focus().redo().run()" :disabled="!requirementsEditor.can().chain().focus().redo().run()" class="toolbar">
          <Icon name="fluent:arrow-redo-16-regular" size="1.15rem" />
        </button>
      </section>
    </div>
    <TiptapEditorContent :editor="requirementsEditor"  ref="textareaRef" />
  </div>

  <!-- Outline -->
  <div v-if="props.type == 'outline'" class="TipTapEditor outline">
    <div class="TipTapTools" v-if="outlineEditor">
      <section class="button-group">
        <button @click="outlineEditor.chain().focus().toggleBold().run()" :disabled="!outlineEditor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': outlineEditor.isActive('bold') }" class="toolbar">
          <Icon name="fluent:text-bold-16-regular" size="1.15rem" />
        </button>
        <!-- <button @click="outlineEditor.chain().focus().toggleItalic().run()" :disabled="!outlineEditor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': outlineEditor.isActive('italic') }" class="toolbar">
          <Icon name="fluent-mdl2:italic" size="1rem" /> 
        </button> -->
        <!-- <button @click="outlineEditor.chain().focus().toggleStrike().run()" :disabled="!outlineEditor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': outlineEditor.isActive('strike') }" class="toolbar">
          <Icon name="fluent-mdl2:strikethrough" size="1rem" /> 
        </button> -->
        <button @click="outlineEditor.chain().focus().unsetAllMarks().run()" class="toolbar">
          <Icon name="fluent:clear-formatting-16-regular" size="1.15rem" /> 
        </button>
        <button @click="outlineEditor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': outlineEditor.isActive('bulletList') }" class="toolbar">
          <Icon name="fluent:text-bullet-list-16-regular" size="1.15rem" /> 
        </button>
        <button @click="outlineEditor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': outlineEditor.isActive('orderedList') }" class="toolbar">
          <Icon name="fluent:text-number-list-16-regular" size="1.15rem" /> 
        </button>

        <div class="vertical-divider"></div>

        <!-- Links -->
        <button @click="setLink(outlineEditor)" class="toolbar" :class="{ 'is-active': outlineEditor.isActive('link') }">
          <Icon name="fluent:link-16-regular" size="1.15rem" />
        </button>
        <button @click="outlineEditor.chain().focus().unsetLink().run()" class="toolbar" :disabled="!outlineEditor.isActive('link')">
          <Icon name="fluent:link-dismiss-16-regular" size="1.15rem" />
        </button>
      </section>
      
      <section class="button-group undo-redo">
        <button @click="outlineEditor.chain().focus().undo().run()" :disabled="!outlineEditor.can().chain().focus().undo().run()" class="toolbar">
          <Icon name="fluent:arrow-undo-16-regular" size="1.15rem" />
        </button>
        <button @click="outlineEditor.chain().focus().redo().run()" :disabled="!outlineEditor.can().chain().focus().redo().run()" class="toolbar">
          <Icon name="fluent:arrow-redo-16-regular" size="1.15rem" />
        </button>
      </section>
    </div>
    <TiptapEditorContent :editor="outlineEditor" ref="textareaRef" />
  </div>

  <!-- Research -->
  <div v-if="props.type == 'research'" class="TipTapEditor research">
    <div class="TipTapTools"  v-if="researchEditor">
      <section class="button-group">
        <button @click="researchEditor.chain().focus().toggleBold().run()" :disabled="!researchEditor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': researchEditor.isActive('bold') }" class="toolbar">
          <Icon name="fluent:text-bold-16-regular" size="1.15rem" />
        </button>
        <!-- <button @click="researchEditor.chain().focus().toggleItalic().run()" :disabled="!researchEditor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': researchEditor.isActive('italic') }" class="toolbar">
          <Icon name="fluent-mdl2:italic" size="1rem" /> 
        </button> -->
        <!-- <button @click="researchEditor.chain().focus().toggleStrike().run()" :disabled="!researchEditor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': researchEditor.isActive('strike') }" class="toolbar">
          <Icon name="fluent-mdl2:strikethrough" size="1rem" /> 
        </button> -->
        <button @click="researchEditor.chain().focus().unsetAllMarks().run()" class="toolbar">
          <Icon name="fluent:clear-formatting-16-regular" size="1.15rem" /> 
        </button>
        <button @click="researchEditor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': researchEditor.isActive('bulletList') }" class="toolbar">
          <Icon name="fluent:text-bullet-list-16-regular" size="1.15rem" /> 
        </button>
        <button @click="researchEditor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': researchEditor.isActive('orderedList') }" class="toolbar">
          <Icon name="fluent:text-number-list-16-regular" size="1.15rem" /> 
        </button>

        <div class="vertical-divider"></div>

        <!-- Links -->
        <button @click="setLink(researchEditor)" class="toolbar" :class="{ 'is-active': researchEditor.isActive('link') }">
          <Icon name="fluent:link-16-regular" size="1.15rem" />
        </button>
        <button @click="researchEditor.chain().focus().unsetLink().run()" class="toolbar" :disabled="!researchEditor.isActive('link')">
          <Icon name="fluent:link-dismiss-16-regular" size="1.15rem" />
        </button>

      </section>
      <section class="button-group undo-redo">
        <button @click="researchEditor.chain().focus().undo().run()" :disabled="!researchEditor.can().chain().focus().undo().run()" class="toolbar">
          <Icon name="fluent:arrow-undo-16-regular" size="1.15rem" />
        </button>
        <button @click="researchEditor.chain().focus().redo().run()" :disabled="!researchEditor.can().chain().focus().redo().run()" class="toolbar">
          <Icon name="fluent:arrow-redo-16-regular" size="1.15rem" />
        </button>
      </section>
    </div>
    <TiptapEditorContent :editor="researchEditor"  ref="textareaRef" />
  </div>

  <!-- Draft -->
  <div v-if="props.type == 'draft'" class="TipTapEditor draft">
    <div class="TipTapTools"  v-if="draftEditor">
      <section class="button-group">

        <Dropdown position="left" clear="true" typeselect="true" >
          <template v-slot:trigger>
            <!-- <span class="current-state"><Icon name="fluent:flow-20-regular" size="2rem" /></span> -->
             <div v-if="draftEditor.isActive('paragraph')">Paragraph <Icon name="fluent:chevron-down-16-regular" size="1.15rem" /></div>
             <div v-if="draftEditor.isActive('heading', { level: 1 })">Main title <Icon name="fluent:chevron-down-16-regular" size="1.15rem" /></div>
             <div v-if="draftEditor.isActive('heading', { level: 2 })">Section <Icon name="fluent:chevron-down-16-regular" size="1.15rem" /></div>
             <div v-if="draftEditor.isActive('heading', { level: 3 })">Sub-section <Icon name="fluent:chevron-down-16-regular" size="1.15rem" /></div>
          </template>
          <template v-slot:menu>
            <div @click="draftEditor.chain().focus().setParagraph().run()" :class="{ 'active': draftEditor.isActive('paragraph') }" class="dropdown-item toolbar">
              Paragraph
            </div>
            <div @click="draftEditor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'active': draftEditor.isActive('heading', { level: 1 }) }" class="dropdown-item toolbar">
              Main title (h1)
            </div>
            <div @click="draftEditor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'active': draftEditor.isActive('heading', { level: 2 }) }" class="dropdown-item toolbar">
              Section (h2)
            </div>
            <div @click="draftEditor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'active': draftEditor.isActive('heading', { level: 3 }) }" class="dropdown-item toolbar">
              Sub-section (h3)
            </div>
          </template>
        </Dropdown>

        <div class="vertical-divider"></div>

        <button @click="draftEditor.chain().focus().unsetAllMarks().run()" class="toolbar">
          <Icon name="fluent:clear-formatting-16-regular" size="1.15rem" /> 
        </button>

        <div class="vertical-divider"></div>

        <button @click="draftEditor.chain().focus().toggleBold().run()" :disabled="!draftEditor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': draftEditor.isActive('bold') }" class="toolbar">
          <Icon name="fluent:text-bold-16-regular" size="1.15rem" />
        </button>
        <button @click="draftEditor.chain().focus().toggleItalic().run()" :disabled="!draftEditor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': draftEditor.isActive('italic') }" class="toolbar">
          <Icon name="fluent-mdl2:italic" size="1rem" /> 
        </button>
        <!-- <button @click="draftEditor.chain().focus().toggleStrike().run()" :disabled="!draftEditor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': draftEditor.isActive('strike') }" class="toolbar">
          <Icon name="fluent-mdl2:strikethrough" size="1rem" /> 
        </button> -->
        <button @click="draftEditor.chain().focus().toggleCode().run()" :disabled="!draftEditor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': draftEditor.isActive('code') }" class="toolbar">
          <Icon name="fluent:code-16-regular" size="1.15rem" /> 
        </button>
        <button @click="draftEditor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': draftEditor.isActive('bulletList') }" class="toolbar">
          <Icon name="fluent:text-bullet-list-16-regular" size="1.15rem" /> 
        </button>
        <button @click="draftEditor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': draftEditor.isActive('orderedList') }" class="toolbar">
          <Icon name="fluent:text-number-list-16-regular" size="1.15rem" /> 
        </button>
        <button @click="draftEditor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': draftEditor.isActive('codeBlock') }" class="toolbar">
          <Icon name="fluent:code-block-16-regular" size="1.15rem" />
        </button>
        <button @click="draftEditor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': draftEditor.isActive('blockquote') }" class="toolbar">
          <Icon name="fluent:text-quote-16-filled" size="1.15rem" />
        </button>
        <button @click="draftEditor.chain().focus().setHorizontalRule().run()" class="toolbar">
          <Icon name="codicon:horizontal-rule" size="1.15rem" />
        </button>
        <button @click="draftEditor.chain().focus().setHardBreak().run()" class="toolbar">
          <Icon name="fluent:document-page-break-24-regular" size="1.15rem" />
        </button>

        <div class="vertical-divider"></div>

        <!-- Links -->
        <button @click="setLink(draftEditor)" class="toolbar" :class="{ 'is-active': draftEditor.isActive('link') }">
          <Icon name="fluent:link-16-regular" size="1.15rem" />
        </button>
        <button @click="draftEditor.chain().focus().unsetLink().run()" class="toolbar" :disabled="!draftEditor.isActive('link')">
          <Icon name="fluent:link-dismiss-16-regular" size="1.15rem" />
        </button>
      </section>
        
      <section class="button-group undo-redo">
        <div class="character-count" @click="toggleCount">
          <span class="chars" v-if="!showChar">{{ characterCount }} chars</span>
          <span class="words" v-if="showChar">{{ wordCount }} words</span>
        </div>
        <button @click="draftEditor.chain().focus().undo().run()" :disabled="!draftEditor.can().chain().focus().undo().run()" class="toolbar">
          <Icon name="fluent:arrow-undo-16-regular" size="1.15rem" />
        </button>
        <button @click="draftEditor.chain().focus().redo().run()" :disabled="!draftEditor.can().chain().focus().redo().run()" class="toolbar">
          <Icon name="fluent:arrow-redo-16-regular" size="1.15rem" />
        </button>
      </section>
    </div>
    <TiptapEditorContent :editor="draftEditor"  ref="textareaRef" />
  </div>

  <!-- Outline Review -->
  <div class="TipTapReview max-width xl review" v-if="type == 'outlinereview'">
    <div class="TipTapTools" v-if="outlineEditor">
      <section class="button-group">
        <button @click="outlineEditor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': outlineEditor.isActive('highlight') }">
          <Icon name="fluent:highlight-16-regular" size="1.15rem" />
        </button>
        <button @click="outlineEditor.chain().focus().toggleStrike().run()" :class="{ 'is-active': outlineEditor.isActive('strike') }">
          <Icon name="fluent-mdl2:strikethrough" size="1rem" /> 
        </button>
      </section>
      <section class="button-group undo-redo">
        <button @click="outlineEditor.chain().focus().undo().run()" :disabled="!outlineEditor.can().chain().focus().undo().run()" class="toolbar">
          <Icon name="fluent:arrow-undo-16-regular" size="1.15rem" />
        </button>
        <button @click="outlineEditor.chain().focus().redo().run()" :disabled="!outlineEditor.can().chain().focus().redo().run()" class="toolbar">
          <Icon name="fluent:arrow-redo-16-regular" size="1.15rem" />
        </button>
        <div class="character-count">
          {{ characterCount }} chars
        </div>
      </section>
    </div>
    <TiptapEditorContent :editor="outlineEditor"  ref="textareaRef"  @mouseup="handleTextSelection" />
    <div v-if="showCommentInput" class="floating-comment" :style="{ top: `${commentPosition.top}px`, left: `${commentPosition.left}px` }">
      <span class="quote" v-html="selectedText"></span>
      <textarea v-model="commentText" placeholder="Add a comment" @keyup="handleCommentText"></textarea>
      <button @click="handleAddComment('outlinereview')">Add Comment</button>
    </div>
  </div>

  <!-- Draft Review -->
  <div class="TipTapReview max-width xl review" v-if="type == 'draftreview'">
    <div class="TipTapTools" v-if="draftEditor">
      <section class="button-group">
        <button @click="draftEditor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': draftEditor.isActive('highlight') }">
          <Icon name="fluent:highlight-16-regular" size="1.15rem" />
        </button>
        <button @click="draftEditor.chain().focus().toggleStrike().run()" :class="{ 'is-active': draftEditor.isActive('strike') }">
          <Icon name="fluent-mdl2:strikethrough" size="1rem" /> 
        </button>
      </section>
      <section class="button-group undo-redo">
        <button @click="draftEditor.chain().focus().undo().run()" :disabled="!draftEditor.can().chain().focus().undo().run()" class="toolbar">
          <Icon name="fluent:arrow-undo-16-regular" size="1.15rem" />
        </button>
        <button @click="draftEditor.chain().focus().redo().run()" :disabled="!draftEditor.can().chain().focus().redo().run()" class="toolbar">
          <Icon name="fluent:arrow-redo-16-regular" size="1.15rem" />
        </button>
        <div class="character-count">
          {{ characterCount }} chars
        </div>
      </section>
    </div>
    <TiptapEditorContent :editor="draftEditor"  ref="textareaRef"  @mouseup="handleTextSelection" />
    <div v-if="showCommentInput" class="floating-comment" :style="{ top: `${commentPosition.top}px`, left: `${commentPosition.left}px` }">
      <span class="quote" v-html="selectedText"></span>
      <textarea v-model="commentText" placeholder="Add a comment" @keyup="handleCommentText"></textarea>
      <button @click="handleAddComment('draftreview')">Add Comment</button>
    </div>
  </div>

</template>

<script setup>

import useDeliverables from '~/composables/useDeliverables';
import TiptapStarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link'
import Dropcursor from '@tiptap/extension-dropcursor';
import FileHandler from '@tiptap-pro/extension-file-handler'
import Image from '@tiptap/extension-image';

import useComments from '~/composables/useComments';
const { addComment } = useComments();

const user = useSupabaseUser();

const showCommentInput = ref(false);
const commentText = ref('');
const selectedText = ref('');
const commentPosition = ref({ top: 0, left: 0 });

const { saveDeliverableContent } = useDeliverables();
const saving = ref(false);
const textareaRef = ref(null);
const showChar = ref(true);

const props = defineProps({
  deliverable: {
    type: Object,
    default: null,
  },
  type: {
    type: String,
    default: 'draft',
  },
  review: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const deliverable = ref(props.deliverable);

const comment = {
  quote: '',
  text: '',
  profile_id: user.value.id,
  deliverable_content_id: deliverable.value.id,
  created_at: new Date().toISOString(),
  details: {
    'type': '',
    'status': 'active'
  }
};

const requirementsEditor = useEditor({
  content: deliverable.value.content.requirements,
  extensions: [
                TiptapStarterKit, 
                Link, 
                Highlight, 
                Image.configure({
                  inline: true,
                  allowBase64: true, 
                }),
                Dropcursor,
                FileHandler.configure({
                  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
                  onDrop: (requirementsEditor, files, pos) => {
                    files.forEach(file => {
                      const fileReader = new FileReader()

                      fileReader.readAsDataURL(file)
                      fileReader.onload = () => {
                        requirementsEditor.chain().focus().insertContent({
                          type: 'image',
                          attrs: {
                            src: fileReader.result,
                          },
                        }).run();
                      }
                    })
                  },
                  onPaste: (requirementsEditor, files) => {
                    files.forEach(file => {
                      const fileReader = new FileReader()

                      fileReader.readAsDataURL(file)
                      fileReader.onload = () => {
                        requirementsEditor.chain().focus().insertContent({
                          type: 'image',
                          attrs: {
                            src: fileReader.result,
                          },
                        }).run();
                      }
                    })
                  },
                }),
              ],
});

const outlineEditor = useEditor({
  content: deliverable.value.content.outline,
  extensions: [
                TiptapStarterKit, 
                Link, 
                Highlight, 
                Image, 
                Dropcursor
              ],
});

const researchEditor = useEditor({
  content: deliverable.value.content.research,
  extensions: [
                TiptapStarterKit, 
                Link, 
                Highlight, 
                Image, 
                Dropcursor
              ],
});

const draftEditor = useEditor({
  content: deliverable.value.content.draft,
  extensions: [
                TiptapStarterKit, 
                Link, 
                Highlight, 
                Image, 
                Dropcursor
              ],
});

const handleTextSelection = () => {
  const currentMouseX = event.clientX;
  const currentMouseY = event.clientY;
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    selectedText.value = selection.toString();
    commentPosition.value = {
      top: currentMouseY,
      left: currentMouseX + 20,
    };
    showCommentInput.value = true;
    comment.quote = selectedText.value;
  } else {
    showCommentInput.value = false;
  }
};

const setLink = (editor) => {
  const previousUrl = editor.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  // cancelled
  if (url === null) {
    return
  }

  // empty
  if (url === '') {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run()

    return
  }

  // update link
  editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: url })
    .run()
}

const characterCount = computed(() => {
  return draftEditor.value ? draftEditor.value.getHTML().replace(/<[^>]*>?/gm, '').length : 0;
});

const wordCount = computed(() => {
  return draftEditor.value ? draftEditor.value.getHTML().replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
});

const toggleCount = () => {
  showChar.value = !showChar.value;
};

const handleCommentText = (event) => {
  comment.text = event.target.value;
};

const handleAddComment = (contentType) => { 
  if (selectedText.value && commentText.value) {
    // Generate a unique ID for the comment
    const commentId = `comment-${Date.now()}`;

    if(contentType == 'draftreview') {
       let content = deliverable.value.content.draft;
       let newContent = content.replace(selectedText.value, `<span class="highlighted" data-comment-id="${commentId}">${selectedText.value}<span class="comment">${commentText.value}</span></span>`);
       deliverable.value.content.draft = newContent;
       comment.details.type = 'draft-review';
    }

    if(contentType == 'outlinereview') {
       let content = deliverable.value.content.outline;
       let newContent = content.replace(selectedText.value, `<span class="highlighted" data-comment-id="${commentId}">${selectedText.value}<span class="comment">${commentText.value}</span></span>`);
       deliverable.value.content.outline = newContent;
       comment.details.type = 'outline-review';
    }
    
    commentText.value = '';
    showCommentInput.value = false;

    addComment(comment);

    // Log the comment ID and selected text for debugging
    console.log(`Comment ID: ${commentId}`);
    console.log(`Selected Text: ${selectedText.value}`);
  }
};

const tiptapDeliverable = ref({
  ...deliverable.value
});

watch(() => props.deliverable, (newDeliverable) => {
  deliverable.value = newDeliverable;
  tiptapDeliverable.value = {
    ...newDeliverable
  };
  if (requirementsEditor.value) {
    requirementsEditor.value.commands.setContent(newDeliverable.content.requirements);
  }
  if (outlineEditor.value) {
    outlineEditor.value.commands.setContent(newDeliverable.content.outline);
  }
  if (researchEditor.value) {
    researchEditor.value.commands.setContent(newDeliverable.content.research);
  }
  if (draftEditor.value) {
    draftEditor.value.commands.setContent(newDeliverable.content.draft);
  }
}, { immediate: true });

function debounce(func, wait) {
  let timeout;
  
  const debouncedFunction = (...args) => {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  // Add cleanup method
  debouncedFunction.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debouncedFunction;
}

const debouncedSaveDeliverableContent = debounce(async () => {
  try {
    saving.value = true;
    console.log('Saving content:', tiptapDeliverable.value);
    await saveDeliverableContent(tiptapDeliverable.value);
  } catch (error) {
    console.error('Error saving content:', error);
  } finally {
    saving.value = false;
  }
}, 250);

watch(draftEditor, (draftEditor) => {
  if (draftEditor) {
    draftEditor.on('update', () => {
      tiptapDeliverable.value.content.draft = draftEditor.getHTML();
      debouncedSaveDeliverableContent();
    });
  }
});

watch(outlineEditor, (outlineEditor) => {
  if (outlineEditor) {
    outlineEditor.on('update', () => {
      tiptapDeliverable.value.content.outline = outlineEditor.getHTML();
      debouncedSaveDeliverableContent();
    });
  }
});

watch(researchEditor, (researchEditor) => {
  if (researchEditor) {
    researchEditor.on('update', () => {
      tiptapDeliverable.value.content.research = researchEditor.getHTML();
      debouncedSaveDeliverableContent();
    });
  }
});

watch(requirementsEditor, (requirementsEditor) => {
  if (requirementsEditor) {
    requirementsEditor.on('update', () => {
      tiptapDeliverable.value.content.requirements = requirementsEditor.getHTML();
      debouncedSaveDeliverableContent();
    });
  }
});

onBeforeUnmount(() => {
  debouncedSaveDeliverableContent.cancel();
  unref(draftEditor)?.destroy();
  unref(requirementsEditor)?.destroy();
  unref(outlineEditor)?.destroy();
  unref(researchEditor)?.destroy();
});


</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.floating-comment {
  position: fixed;
  background: rgba($white, 0.8);
  backdrop-filter: blur(6px);
  box-shadow: $big-shadow;
  border-radius: $br-lg;
  z-index: 1000;
  max-width: 400px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .quote {
    background: rgba($brand, 0.1);
    padding: $spacing-sm;
  }

  textarea {
    padding: $spacing-sm;
    border: none;
    border-top: $border;
    border-bottom: $border;
    background: transparent;
    border-radius: 0;
    margin: 0;
  }

  button {
    margin: $spacing-sm;
  }
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

.TipTapEditor,
.TipTapReview {
  width: 100%;
  background: $white;
  height: calc(100% - $spacing-sm);
  border-radius: $br-lg;

  &:hover .TipTapTools {
    background: rgba($white, .5);
  }
  
}

.requirements {
  display: flex;
  flex-direction: column;
}

.outline {
  display: flex;
  flex-direction: column;
}

.research {
  display: flex;
  flex-direction: column;
}

.draft {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
}

.TipTapTools {
  display: flex;
  flex-wrap: nowrap;
  gap: $spacing-xxxs;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(6px);
  padding: $spacing-xxxs 0;
  position: sticky;
  top: 0;
  margin: 0;
  z-index: 10;
  flex-wrap: wrap;
  transition: opacity 0.3s ease;
  transition: all 0.2s ease;
  background: rgba($white, .25);

  .character-count {
    font-size: $font-size-xxs;
    color: rgba($black, 0.5);
    align-self: center;
    padding: 0 $spacing-xxs;
    text-wrap: nowrap;
    cursor: pointer;
    -webkit-touch-callout: none;
    -webkit-user-select: none; 
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;

    &:hover {
      color: $brand;
    }
  }

  .button-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: $spacing-xxxs;

    .vertical-divider {
      width: 1px;
      height: 24px;
      background-color: rgba($black, 0.2);
      margin: 0 $spacing-sm;
    }
  }

  button {
    cursor: pointer;
    padding: $spacing-xxs $spacing-xxs;
    min-width: 28px;

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