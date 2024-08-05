<template>
  <main id="ProjectsContent">
    <div class="empty-state" v-if="!projects">
      <img src="/images/projects-empty-state.svg" alt="No projects found" />
      <h3>You haven’t created a project yet</h3>
      <p>That’s ok, It’s easy and we’ll do it together</p>
      <button class="button primary">Create a project</button>
    </div>
    <div class="projects-list" v-else>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const projects = ref(null)

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#ProjectsContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: $spacing-md;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 200px;
    }

    h3 {
      font-size: $font-size-lg;
      font-family: $font-family-secondary;
      font-weight: 500;
      margin: $spacing-md 0 0;
    }

    p {
      font-size: $font-size-sm;
      font-weight: 400;
      margin: $spacing-sm 0 $spacing-md;
      color: $gray-dark;
    }

    .button {
      width: 200px;
    }
  }
}

</style>