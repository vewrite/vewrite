<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <button class="button primary" @click="createWorkflowModal()">Create Workflow</button> 
    </template>
    <template v-slot:body>
      <WorkflowsList />
    </template>
  </AppPanel>
</template>

<script setup>

// Workflow composable
import useWorkflow from '~/composables/useWorkflow';
const { createWorkflowModal } = useWorkflow();

</script>

<style scoped>
/* Your styles here */
</style>