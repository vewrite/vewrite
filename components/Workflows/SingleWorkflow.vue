<template>
  <div class="workflow-preview">
    <Loading type="small" v-if="loading.workflow" />
    <!-- <pre v-if="WorkflowError">{{ WorkflowError }}</pre> -->
    <div class="project-state" v-if="!loading.workflow" v-for="state in WorkflowStates">
      <img :src="'/states/' + state.icon" />
      <div>{{ state.name }}</div>
    </div>
  </div>
</template>

<script setup>

import { useWorkflow } from '@/composables/useWorkflow';
import { defineProps, onMounted } from 'vue';

const loading = ref({
  workflow: true
});

const props = defineProps({
  workflow: Number
});

const { WorkflowData, WorkflowError, WorkflowStates, fetchProjectWorkflow, renderStateName, fetchWorkflowStates } = useWorkflow();

onMounted(async () => {
  try {
    await fetchProjectWorkflow(props.workflow);
    await fetchWorkflowStates(props.workflow);
  } catch (error) {
    console.error('Failed to fetch workflow data:', error);
  } finally {
    loading.value.workflow = false;
  }
});

</script>

<style lang="scss" scoped>

@import "/assets/variables.scss";

.workflow-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm;
  margin: $spacing-md;
  padding: $spacing-md;
  border-radius: $br-md;
  border: 1px solid rgba($black, 0.1);

  .project-state {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 54px;
      height: 54px;
    }
  }
}


</style>