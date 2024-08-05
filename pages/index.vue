<template>
  <AppPanel>
    <template v-slot:header>
      <div class="app-panel-header">Projects</div>
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