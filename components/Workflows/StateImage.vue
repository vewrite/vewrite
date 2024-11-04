<template>
  <div class="state-image">
    <img :src="StateImageType" :alt="props.state" />
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import Loading from '~/components/Loading.vue'

const props = defineProps(['state'])

const StateImageType = ref(null)

// Import the state type composable
import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
const { fetchSingleState, StateData } = useWorkflowStateTypes();

onMounted(async () => {
  try {
    await fetchSingleState(props.state)
    if (!StateData.value) {
      throw new Error('Failed to fetch state type')
    }

    StateImageType.value = `/states/${StateData.value.icon}`
  } catch (error) {
    console.error('Failed to fetch state type:', error)
  }
})

watch(() => props.state, async (newState) => {
  try {
    await fetchSingleState(newState)
    if (!StateData.value) {
      throw new Error('Failed to fetch state type')
    }

    StateImageType.value = `/states/${StateData.value.icon}`
  } catch (error) {
    console.error('Failed to fetch state type:', error)
  }
})

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.state-image {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $brand;

  img {
    width: 50px;
    height: 50px;
  }
}

</style>