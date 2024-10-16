<template>
  <div class="state">
    <div v-if="stateDetails && stateDetails.state_type" class="details">
      <div class="icon">
        <img :src="'/states/' + stateDetails.state_type.icon" alt="State type icon" />
        <p class="state-type">{{ stateDetails.state_type.name }}</p>
      </div>
      <div class="text">
        <p class="instance-name" v-if="stateDetails.state_instance && stateDetails.state_instance.length > 0">
          {{ stateDetails.state_instance[0].instance_name }}
        </p>
        <p class="description">{{ stateDetails.state_type.description }}</p>
      </div>
    </div>
    <div v-else-if="error">
      <p>Error: {{ error }}</p>
    </div>
    <div v-else>
      <Loading type="small" />
    </div>
  </div>
</template>


<script setup>

import { ref, onMounted } from 'vue'
import Loading from '~/components/Loading.vue'

const props = defineProps(['state'])

const stateDetails = ref(null)
const error = ref(null)

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
  } catch (e) {
    console.error('Error fetching state:', e.message)
    error.value = e.message
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
      width: 68px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      border-radius: $br-md;
      overflow: hidden;
      background: $brand;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .state-type {
        text-transform: capitalize;
        padding: 2px $spacing-xxs $spacing-xxs $spacing-xxs;
        color: rgba($white, .5);
        background: $brand;
        font-size: $font-size-xxs;
        min-width: 100%;
        text-align: center;
        margin: -12px 0 0 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      gap: $spacing-xxs;

      .instance-name {
        font-weight: bold;
        color: $black;
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