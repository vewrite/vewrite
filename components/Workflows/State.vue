<template>
  <div class="state">
    {{ props.state }}
    <div v-if="stateDetails" class="details">
      <div class="icon">
        <img :src="'/states/' + stateDetails.icon" alt="State type icon" />
      </div>
      <div class="text">
        <p class="name">{{ stateDetails.name }}</p>
        <p class="description">{{ stateDetails.description }}</p>
      </div>
    </div>
    <div v-else>
      <Loading type="small" />
    </div>
    <!-- <div class="icon">{{ stateDetails(props.state).icon }}</div> -->
    <!-- {{ stateDetails(props.state).name }} -->
  </div>
</template>

<script setup>

import { ref } from 'vue'

const props = defineProps(['state'])

// TODO: instead of the default state types, this should pull the state instances

// State composable
import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
const { fetchSingleState, StateData } = useWorkflowStateTypes();

// State instance composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const {  } = useWorkflowStateInstances();

const stateDetails = ref(null);

onMounted( async () => {
  try {
    const state = await fetchSingleState(props.state);
    stateDetails.value = StateData.value;
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