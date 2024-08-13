<template>
  <AppPanel>
    <template v-slot:header>
      <div class="app-panel-header">Workflows</div>
    </template>
    <template v-slot:body>
      <WorkflowsList />
    </template>
  </AppPanel>
</template>

<script>
import AppPanel from '~/components/AppPanel.vue';
import WorkflowsList from '~/components/Workflows/WorkflowsList.vue';

export default {
  components: {
    AppPanel
  }
}
</script>

<style scoped>
/* Your styles here */
</style>