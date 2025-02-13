<template>
  <section class="deliverable-comments"> 
    <Loading v-if="loading" type="small" />
    <div class="single-comment" v-if="Comments && Comments.length > 0 && !loading" v-for="comment in Comments" key="comment.id">
      <section class="quote">"{{ comment.quote }}"</section>
      <section class="content">
        <Avatar :uuid="comment.profile_id" size="small" />
        <div class="text-wrapper">
          <span class="text">{{ comment.text }}</span>
          <span class="small">{{ comment.created_at }}</span>
        </div>
      </section>
      <section class="actions">
        <button class="button" @click="handleDeleteComment(comment.id)">
          <Icon name="fluent:delete-24-filled" size="1.5rem" />
        </button>
        <!-- <button class="button">
          <Icon name="fluent:checkmark-24-filled" size="1.5rem" />
        </button> -->
      </section>
    </div>
    <div class="empty-state" v-else>
      <p>Select text to add your first comment.</p>
    </div>
  </section>
</template>

<script setup>

import { parseISO, format } from 'date-fns';

const props = defineProps(['deliverable']);
const loading = ref(true);
const supabase = useSupabaseClient();

import useComments from '~/composables/useComments';
const { fetchComments, deleteComment } = useComments();

const Comments = ref(null);

function formatCommentDate(date){
  let newDate = format(parseISO(date), 'MMM do, yyyy, hh:mm');
  return newDate;
}

async function handleDeleteComment(id) {
  try {
    await deleteComment(id);
    Comments.value = Comments.value.filter(comment => comment.id !== id);
  } catch (error) {
    console.error(error);
  }
}

async function handleCommentInserts(payload) {
  console.log('New comment:', payload.new);
  const newComment = { ...payload.new };
  Comments.value.push(newComment);
  for (let i = 0; i < Comments.value.length; i++) {
    Comments.value[i].created_at = formatCommentDate(Comments.value[i].created_at);
  }
}

onMounted(async () => {
  try {
    const subscription = supabase
      .channel('comments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, handleCommentInserts)
      .subscribe();

    onUnmounted(() => {
      supabase.removeChannel(subscription);
    });

    Comments.value = await fetchComments(props.deliverable.id);
    for (let i = 0; i < Comments.value.length; i++) {
      Comments.value[i].created_at = formatCommentDate(Comments.value[i].created_at);
    }

  } catch (error) {
    console.error('Failed to fetch comments:', error)
  } finally {
    loading.value = false
  }
  
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverable-comments {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-width: 300px;
  width: 100%;
  height: 100%;
  padding: $spacing-sm;
  background: rgba($black, 0.025);

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $spacing-sm;
    background: rgba($brand, 0.05);
    border-radius: $br-lg;

    p {
      color: rgba($black, 0.25);
      font-size: $font-size-xs;
      margin: 0;
    }
  }

  .single-comment {
    background: rgba($white, .8);
    border: $border;
    border-radius: $br-xl;
    margin: 0;
    position: relative;
    overflow: hidden;
    height: fit-content;
    transition: all 0.2s ease;

    &:hover {
      border: 1px solid rgba($brand, 0.35);
    }

    .quote {
      margin: $spacing-sm $spacing-sm 0;
      padding: $spacing-xs;
      background: rgba($brand, 0.05);
      border-radius: $br-lg;
      transition: background 0.2s ease;
      color: darken($brand, 25%);
    }

    .content {
      padding: $spacing-sm;
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: $spacing-xxxs;
      background: rgba($white, 0);

      .text-wrapper {
        display: flex;
        flex-direction: column;

        .small {
          margin-top: $spacing-xxs;
          font-size: $font-size-xxs;
          color: rgba($black, 0.25);
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: $spacing-xs;
      padding: 0 $spacing-sm;
      opacity: 0;
      overflow: hidden;
      transition: all 0.2s ease;
      position: absolute;
      bottom: $spacing-sm;
      right: $spacing-xxs;

      button {
        border: none;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
      }
    }

    &:hover {

      .quote {
        background: rgba($brand, 0.15);
      }
      .content {
        background: rgba($white, 1);
      }
      .actions {
        opacity: 1;
      }
    }

    p {
      margin: 0;
    }
  }
}

</style>