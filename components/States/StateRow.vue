<template>
  <div class="state-row" v-if="stateDetails" :class="status">
    <div class="state-location" :class="status">
      <Icon :name="'fluent:checkmark-16-filled'" size="1rem" :class="status" v-if="status == 'complete'" />
      <Icon :name="'radix-icons:dot-filled'" size="1rem" :class="status" v-if="status == 'current'" />
    </div>
    <div class="state-icon" :class="status">
       <Icon :name="stateDetails.state_type.icon" size="2rem" />
    </div>
    <div class="state-details" >
      <p>{{ stateDetails.state_type.name }}</p>
      <!-- <p><small>{{ stateDetails.state_instance[0].instance_name }}</small></p> -->
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  deliverableId: {
    type: Number,
    required: true,
  },
  state: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: false,
  }
})

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

    StateData.value = await fetchSingleState(StateInstanceData.value[0].state_type)
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

.state-row {
  display: flex;
  flex-direction: row;
  gap: $spacing-xs;
  align-items: center;
  padding: $spacing-xxxs $spacing-xs;
  cursor: pointer;
  background: rgba($brand, 0.05);
  border-radius: $br-lg;

  &.incomplete {
    color: rgba($black, 0.5);
    background: $white;
    cursor: not-allowed;
  }

  .state-location {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: $white;
    border: $border;

    &.complete {
      background-color: $mint;
      border-color: $mint;
      color: $white;
    }
  }

  .state-icon {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $br-xl;

    // &.complete {
    //   color: $mint;
    // }

    // &.current {
    //   background-color: $brand;
    //   color: $white;
    // }
  }

  .state-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    p {
      margin: 0;
      text-transform: capitalize;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: $font-size-xs;

      small {
        color: rgba($black, 0.5);
        text-transform: none;
      }
    }
  }
}

</style>