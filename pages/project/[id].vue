<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/projects/" class="button dark">Back</router-link>
      <div class="app-panel-header">Project name will go here</div>
      <router-link :to="`/project/${projectId}/edit`" class="button dark">Edit project</router-link>
    </template>
    <template v-slot:body>

    </template>
  </AppPanel>
</template>

<script setup>
import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';
import ProjectsContent from '~/components/ProjectsContent.vue';

// Get the route object
const route = useRoute();

// Extract the project ID from the route parameters
const projectId = route.params.id;
</script>

<style scoped>
/* Your styles here */
</style>