<template>
  <Dropdown position="center" v-if="DeliverableData">
    <template v-slot:trigger>
      <span class="current-state">{{ CurrentState }} <Icon name="fluent:chevron-down-16-regular" size="1.5rem" /></span>
    </template>
    <template v-slot:menu>
      <div class="state-instance" v-for="state in workflowStateInstances">
        <span :class="['dot', CurrentState == state[0].instance_name ? 'current' : '']"></span>
        <span>{{ state[0].instance_name }}</span>
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
// import StateIcon from '~/components/States/StateIcon.vue';

import useWorkflow from '~/composables/useWorkflow';
const { fetchProjectWorkflow, fetchStates } = useWorkflow();

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance } = useWorkflowStateInstances();

const projectWorkflow = ref(null);
const workflowStates = ref(null);
const workflowStateInstances = ref({});

async function getStateInstance(instanceId) {
  let stateInstance = await fetchSingleStateInstance(instanceId);
  return stateInstance; 
}

onMounted(async () => {
  try {
    projectWorkflow.value = await fetchProjectWorkflow(props.DeliverableData.project);
    workflowStates.value = await fetchStates(projectWorkflow.value);

    for(const instanceId of workflowStates.value) {
      workflowStateInstances.value[instanceId] = await getStateInstance(instanceId);
    }
  } catch (error) {
    console.error(error);
  }
});

</script>

<style lang="scss">

@use 'assets/variables' as *;

.current-state {
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: $spacing-xs;

  span {
    font-weight: normal;
  }
}

.workflow-state {
  opacity: 0.5;
}

.state-instance {
  padding: $spacing-xxs $spacing-sm;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: $spacing-sm;

  &:first-child {
    padding-top: $spacing-sm;
  }

  &:last-child {
    padding-bottom: $spacing-sm;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba($brand, 0.1);


    &.current {
      background-color: $brand;
      outline: 1px solid $brand;
      outline-offset: 4px;
    }
  }
}

</style>