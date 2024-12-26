<template>
  <section class="deliverable-comments"> 
    <!-- {{ deliverable.id }} -->
    <div class="single-comment" v-if="Comments && Comments.length > 0" v-for="comment in Comments" key="comment.id">
      <section class="quote">{{ comment.quote }}</section>
      <section class="content">
        <span class="text">{{ comment.text }}</span>
        <span class="small">{{ comment.created_at }}</span>
      </section>
    </div>
    <div class="empty-state" v-else>
      <p>Select text to add your first comment.</p>
    </div>
  </section>
</template>

<script setup>

const props = defineProps(['deliverable']);

import useComments from '~/composables/useComments';
const { fetchComments, CommentsData } = useComments();

const Comments = ref(null);

async function init() {
  console.log(props.deliverable.id);
  Comments.value = await fetchComments(props.deliverable.id);
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
    border-radius: $br-md;
    margin: 0;

    .quote {
      padding: $spacing-sm;
      background: rgba($brand, 0.1);
      border-bottom: $border;
      border-radius: $br-md $br-md 0 0;
      font-size: $font-size-xs;
    }

    .content {
      padding: $spacing-sm;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      .text {
        font-size: $font-size-xs;
      }

      .small {
        font-size: $font-size-xxs;
        color: rgba($black, 0.5);
      }
    }

    p {
      margin: 0;
    }
  }
}

</style>