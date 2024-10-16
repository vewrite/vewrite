<template>
  <div class="state">
    <!-- {{ props.state }} -->
    <div v-if="stateDetails" class="details">
      <div class="icon">
        <img :src="'/states/' + stateDetails.state_type.icon" alt="State type icon" />
      </div>
      <div class="text">
        <p class="name">{{ stateDetails.state_type.name }}</p>
        <p class="description">{{ stateDetails.state_type.description }}</p>
      </div>
    </div>
    <div v-else>
      <Loading type="small" />
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'

const props = defineProps(['state'])

/*
1. Each state first needs to go and get the state instance
2. Then it needs to go and get the state type
*/

// State type composable
import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
const { fetchSingleState, StateData } = useWorkflowStateTypes();

// State instance composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, StateInstanceData } = useWorkflowStateInstances();

const stateDetails = ref({
  state_instance: {},
  state_type: {}
});

onMounted( async () => {
  try {

    // Get the state instance and put it in the stateDetails object
    await fetchSingleStateInstance(props.state);
    stateDetails.value.state_instance = StateInstanceData.value;

    // Get the state type and put it in the stateDetails object
    // console.log(stateDetails.value.state_instance[0].state_type);
    await fetchSingleState(stateDetails.value.state_instance[0].state_type);
    stateDetails.value.state_type = StateData.value;
    
  } catch (error) {
    console.error('Error fetching state:', error.message);
  }
})




</script>

<style lang="scss" scoped>

@import "./assets/variables.scss";

.state {
  padding: $spacing-sm;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: $spacing-sm;
  border-radius: $br-md;
  min-width: 180px;

  .details {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: $spacing-sm;

    .icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: $brand;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    .text {
      display: flex;
      flex-direction: column;
      gap: $spacing-xxs;

      .name {
        text-transform: capitalize;
        font-weight: bold;
        margin: 0;
      }

      .description {
        font-size: $font-size-sm;
        color: $gray-dark;
        margin: 0;
      }
    }
  }
}

</style>