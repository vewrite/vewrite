<template>
  <AppPanel>
    <template v-slot:header>
      <div class="app-panel-header">Projects</div>
      <router-link to="/projects/create" class="button dark">Create a project</router-link>
    </template>
    <template v-slot:body>
      <ProjectsList />
    </template>
  </AppPanel>
</template>

<script>
import AppPanel from '~/components/AppPanel.vue';

export default {
  components: {
    AppPanel
  }
}
</script>

<style scoped>
/* Your styles here */
</style>