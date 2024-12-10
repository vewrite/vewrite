<template>
  <div class="state-image" v-if="stateDetails">
    <!-- <img :src="StateImageType" :alt="props.state" /> -->
     <Icon :name="stateDetails.state_type.icon" size="3rem" />
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'

const props = defineProps(['state'])

const stateDetails = ref(null)
const StateData = ref(null)
const StateInstanceData = ref(null)

import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
const { fetchSingleState } = useWorkflowStateTypes();

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance } = useWorkflowStateInstances();

onMounted(async () => {
  try {
    StateInstanceData.value = await fetchSingleStateInstance(props.state)
    if (!StateInstanceData.value) {
      throw new Error('Failed to fetch state instance')
    }

    StateData.value = await fetchSingleState(props.state)
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

watch(() => props.state, async () => {
  try {
    StateInstanceData.value = await fetchSingleStateInstance(props.state)
    if (!StateInstanceData.value) {
      throw new Error('Failed to fetch state instance')
    }

    StateData.value = await fetchSingleState(props.state)
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

.state-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>