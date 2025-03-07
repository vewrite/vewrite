<template>
  <!-- {{ workflowStates }} -->
  <Dropdown position="left" :vertical="true" v-if="DeliverableData">
    <template v-slot:trigger>
      <span class="current-state">{{ CurrentState }}</span>
      <span class="workflow-state">Workflow State</span>
    </template>
    <template v-slot:menu>
      <div class="dropdown-item" v-for="role in RolesData" :key="role.id" @click="setRole(user, team, role.id, role.name)" :class="role.id === RoleData.id ? 'active' : ''">
        {{ role.name }}
      </div>
    </template>
  </Dropdown>
</template>

<script setup>

const props = defineProps(['DeliverableData', 'CurrentState']);

/*

1. Get the project
2. Get the workflow for that project
3. Get the stateinstances for that workflow
4. Get the state type for each state instance
5. Get the current state for the deliverable
6. Show which state the deliverable is in

*/

import { ref, onMounted } from 'vue';

import useWorkflow from '~/composables/useWorkflow';
const { fetchProjectWorkflow, fetchStates } = useWorkflow();

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchStateInstances } = useWorkflowStateInstances();

const projectWorkflow = ref(null);
const workflowStates = ref(null);
const workflowStateInstances = ref({});

async function getStateInstance(instanceId) {
  
}

onMounted(async () => {
  try {
    projectWorkflow.value = await fetchProjectWorkflow(props.DeliverableData.project);
    workflowStates.value = await fetchStates(projectWorkflow.value);

    
  } catch (error) {
    console.error(error);
  }
});

</script>

<style lang="scss">

@use 'assets/variables' as *;

.current-state {
  font-weight: bold;
}

.workflow-state {
  opacity: 0.5;
}

</style>