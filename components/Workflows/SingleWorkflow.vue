<template>
  <div class="deliverables-workflow-preview">
    
    <pre>{{ WorkflowData }}
    {{ WorkflowError }}</pre>
    <!-- <Loading v-if="loading.global == true" /> -->
    <div>
      <div v-for="state in WorkflowData.states">
        <!-- <img :src="'/states/' + WorkflowData.state.icon" /> -->
        <div>{{ state.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useWorkflow } from '@/composables/useWorkflow';
import { defineProps, onMounted } from 'vue';

const loading = ref({
  global: true
});

const props = defineProps({
  workflow: Number
});

const { WorkflowData, WorkflowError, fetchProjectWorkflow } = useWorkflow();

onMounted(() => {
  fetchProjectWorkflow(props.workflow);
  loading.global = false;
});

</script>