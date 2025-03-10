<template>
  <div class="state-icon">
    <img :src="'/states/' + stateDetails.state_type.icon" :alt="stateDetails.state_type.name" />
  </div>
</template>

<script setup>

const props = defineProps({
  state: {
    type: Number,
    required: true,
  },
});

const stateDetails = ref(null)

// State type composable
import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
const { fetchSingleState, StateData } = useWorkflowStateTypes();

// State instance composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, StateInstanceData } = useWorkflowStateInstances();

onMounted(async () => {
  try {
    // Get the state instance
    await fetchSingleStateInstance(props.state)
    if (!StateInstanceData.value) {
      throw new Error('Failed to fetch state instance')
    }

    // Get the state type
    await fetchSingleState(StateInstanceData.value[0].state_type)
    if (!StateData.value) {
      throw new Error('Failed to fetch state type')
    }

    stateDetails.value = {
      state_instance: StateInstanceData.value,
      state_type: StateData.value
    }
  } catch (error) {
    console.error('Error fetching state:', error.message)
    error.value = error.message
  }
})

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.state-icon {
  display: flex;
  flex-direction: row;
  padding: $spacing-xs;
}

</style>