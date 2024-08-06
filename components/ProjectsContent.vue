<template>
  <main id="ProjectsContent">
    <div class="empty-state" v-if="projects.length === 0">
      <img src="/images/projects-empty-state.svg" alt="No projects found" />
      <h3>You haven’t created a project yet</h3>
      <p>That’s ok, It’s easy and we’ll do it together</p>
      <button class="button primary">Create a project</button>
    </div>
    <div class="projects-list" v-else>
      <router-link :to="'/project/' + project.id" class="project-card" v-for="project in projects" :key="project.id">
        <h3>{{ project.id }}</h3>
        <h3>{{ project.name }}</h3>
        <p>{{ project.stakeholders }}</p>
      </router-link>
    </div>
  </main>
</template>

<script setup>

import { onMounted } from 'vue'
import { ref } from 'vue'

const projects = ref([]);

// Fetch projects
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)

async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('created_by', user.value.id)

  console.log(data)

  if (error) {
    console.error('Error fetching projects:', error.message)
    return
  }

  projects.value = data
  loading.value = false
}

onMounted(() => {
  fetchProjects()
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#ProjectsContent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  padding: $spacing-md;

  .empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

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

  .projects-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: $spacing-md;

    .project-card {
      padding: $spacing-md;
      background-color: $white;
      border-radius: $br-md;
      border: 1px solid rgba($black, 0.1);
      transition: border 0.18s ease;
      text-decoration: none;

      &:hover {
        border: 1px solid rgba($purple, 1);
      }

      h3 {
        font-size: $font-size-lg;
        font-family: $font-family-secondary;
        font-weight: 500;
        margin: 0 0 $spacing-sm;
      }

      p {
        font-size: $font-size-sm;
        font-weight: 400;
        color: $gray-dark;
      }
    }
  }
}

</style>