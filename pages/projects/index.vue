<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <div class="app-panel-header">Projects</div>
      <router-link to="/projects/create" class="button dark">Create a project</router-link>
    </template>
    <template v-slot:body>
      <ProjectsContent />
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