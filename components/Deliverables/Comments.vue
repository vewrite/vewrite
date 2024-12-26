<template>
  <section class="deliverable-comments"> 
    <!-- {{ deliverable.id }} -->
    <div class="single-comment" v-if="Comments && Comments.length > 0" v-for="comment in Comments" key="comment.id">
      <section class="quote">"{{ comment.quote }}"</section>
      <section class="content">
        <span class="text">{{ comment.text }}</span>
        <span class="small">{{ comment.created_at }}</span>
      </section>
      <section class="actions">
        <button class="button">
          <Icon name="fluent:delete-24-filled" size="1.5rem" />
        </button>
        <button class="button">
          <Icon name="fluent:checkmark-24-filled" size="1.5rem" />
        </button>
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

import useComments from '~/composables/useComments';
const { fetchComments } = useComments();

const Comments = ref(null);

function formatCommentDate(date){
  let newDate = format(parseISO(date), 'MMM do, yyyy, hh:mm');
  return newDate;
}

async function init() {
  console.log(props.deliverable.id);
  Comments.value = await fetchComments(props.deliverable.id);
  for (let i = 0; i < Comments.value.length; i++) {
    Comments.value[i].created_at = formatCommentDate(Comments.value[i].created_at);
  }
  console.log(Comments.value);
}

onMounted(init);

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverable-comments {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-width: 300px;
  width: 100%;
  // position: sticky;
  // top: 0;
  // overflow-y: auto;
  // scrollbar-width: thin;
  height: fit-content;

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    p {
      color: rgba($black, 0.25);
      font-size: $font-size-xs;
    }
  }

  .single-comment {
    background: rgba($brand, 0);
    border: $border;
    border-radius: $br-lg;
    margin: 0;
    position: relative;
    overflow: hidden;

    .quote {
      padding: $spacing-sm;
      background: rgba($brand, 0.05);
      border-bottom: $border;
      border-radius: $br-lg $br-lg 0 0;
      font-size: $font-size-xxs;
      transition: background 0.5s ease;
      color: $brand;
    }

    .content {
      padding: $spacing-sm;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      background: rgba($white, 0);

      .text {
        font-size: $font-size-xxs;
      }

      .small {
        font-size: $font-size-xxs;
        color: rgba($black, 0.5);
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: $spacing-xs;
      padding: 0 $spacing-sm;
      opacity: 0;
      overflow: hidden;
      transition: all 0.5s ease;
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