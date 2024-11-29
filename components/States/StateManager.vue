<template>
  <div class="state-manager-toggle"  v-if="StateInstanceData">
    <StateButton v-if="currentPositionInWorkflow == 0" type="disabledPrev" />
    <StateButton v-if="currentPositionInWorkflow > 0" :deliverableId="deliverable.id" :state="states[previousPositionInWorkflow]" type="moveToPrev" />
    <div class="state-icon">
      <Loading v-if="loading" type="small" class="loading-icon" />
      <Icon v-else :name="stateDetails.state_type.icon" size="2rem" @click="toggleStateManagerPanel" />
    </div>
    <StateButton v-if="currentPositionInWorkflow < states.length - 1" :deliverableId="deliverable.id" :state="states[nextPositionInWorkflow]" type="moveToNext" />
    <StateButton v-if="currentPositionInWorkflow >= states.length - 1" type="disabledNext" />
  </div>
  <section class="state-manager-panel" v-if="props.states.length > 0" :class="collapsed ? 'collapsed' : ''">
    <section class="state-manager-wrapper">
      <Loading v-if="loading" type="small" />
      <div v-else class="state-manager-workflow">
        <!-- TODO - REMOVED until I can figure out how to make it work without 100% height in the parent
        <div class="workflow-progress">
          <div class="progress-bar">
            <div class="progress" :style="{ height: (currentPositionInWorkflow + 1) / states.length * 100 + '%' }"></div>
          </div>
        </div> -->
        <section class="single-workflow">
          <StateRow
            v-for="(state, index) in states"
            :key="state"
            :deliverableId="deliverable.id"
            :state="state"
            :status="getStatus(index)"
          />
        </section>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import StateButton from '~/components/States/StateButton.vue';
import StateRow from '~/components/States/StateRow.vue';

const props = defineProps(['deliverable', 'states']);

// console.log(props.deliverable)

const currentPositionInWorkflow = ref(null);
const previousPositionInWorkflow = ref(null);
const nextPositionInWorkflow = ref(null);

const loading = ref(true);

const collapsed = ref(false)

function toggleStateManagerPanel() {
  collapsed.value = !collapsed.value
}

import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
const { fetchSingleState, StateData } = useWorkflowStateTypes();

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, StateInstanceData } = useWorkflowStateInstances();

const stateDetails = ref(null);

watch(() => props.states, () => {
  loading.value = true;
  currentPositionInWorkflow.value = props.states.findIndex((state) => state == props.deliverable.workflow_state);
  
  if (currentPositionInWorkflow.value == 0) {
    previousPositionInWorkflow.value = 0;
  } else {
    previousPositionInWorkflow.value = currentPositionInWorkflow.value - 1;
  }
  
  if (currentPositionInWorkflow.value == props.states.length - 1) {
    nextPositionInWorkflow.value = props.states.length;
  } else {
    nextPositionInWorkflow.value = currentPositionInWorkflow.value + 1;
  }
  
  loading.value = false;
});



function getStatus(index) {
  if (index === currentPositionInWorkflow.value) {
    return 'current';
  } else if (index < currentPositionInWorkflow.value) {
    return 'complete';
  } else {
    return '';
  }
}

async function setIcon(){
  loading.value = true;
  try {
    await fetchSingleStateInstance(props.deliverable.workflow_state)
    if (!StateInstanceData.value) {
      throw new Error('Failed to fetch state instance')
    }

    await fetchSingleState(StateInstanceData.value[0].state_type)
    if (!StateData.value) {
      throw new Error('Failed to fetch state type')
    }

    stateDetails.value = {
      state_instance: StateInstanceData.value,
      state_type: StateData.value
    }

    loading.value = false;

  } catch (error) {
    console.error('Error fetching state:', error.message)
    error.value = error.message
  }
}

onMounted(async () => {
  setIcon()
})

watch(() => currentPositionInWorkflow.value, () => {
  setIcon()
})

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.state-manager-toggle {
  position: fixed;
  bottom: $spacing-md;
  right: $spacing-md;
  z-index: 1000;
  background-color: rgba($white, 0.6);
  backdrop-filter: blur(8px);
  border-radius: $br-md;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $big-shadow;
  flex-direction: row;
  gap: $spacing-xs;
  padding: $spacing-xxs $spacing-sm;
  
  .state-icon {
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .loading-icon {
      width: 28px;
      height: 28px;
    }
  }
  .iconify {
    background-color: $brand;
    color: $white;
  }
}

.state-manager-panel {
  display: flex;
  flex-direction: row;
  width: 340px;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  align-items: flex-start;
  bottom: 7rem;
  right: $spacing-md;
  background-color: rgba($white, 0.6);
  backdrop-filter: blur(8px);
  transition: all 0.46s ease-in-out;
  border-radius: $br-md;
  box-shadow: $big-shadow;

  &.collapsed {
    right: -100%;

    .state-manager-wrapper {

      .state-manager-buttons {
        overflow: hidden;
      }

      .state-manager-workflow {
        overflow: hidden;
      }
    }
  }

  .state-manager-wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    width: 100%;
    padding: $spacing-sm;
    height: 100%;
    justify-content: center;

    .state-manager-buttons {
      height: auto;
      transition: width, padding 0.3s ease;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: $spacing-sm;
      width: 100%;
      gap: $spacing-xs;
    }

    .state-manager-workflow {
      display: flex;
      flex-direction: row;
      gap: $spacing-xs;
      padding: $spacing-sm;
      position: relative;
      height: auto;

      .workflow-progress {
        width: 12px;
        height: calc(100% + 20px);
        margin-top: -10px;
        border: $border;
        border-radius: $br-md;
        padding: 2px;

        .progress-bar {
          width: 100%;
          height: 100%;
          background-color: $white;
          border-radius: $br-md;
          overflow: hidden;

          .progress {
            width: 100%;
            background: linear-gradient(to bottom, $mint, $mint 80%, $brand 100%);
            border-radius: $br-md;
            transition: height 0.3s ease;
          }
        }
      }

      .single-workflow {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;
        width: 100%;
      }
    }
  }
}

</style>