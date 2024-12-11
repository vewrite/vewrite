<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="projectId && !loading" :to="'/project/' + projectId" class="button">
        <Icon name="fluent:arrow-left-16-regular" size="1.5rem" />
      </router-link>
      <ObjectOverview v-if="DeliverableData && !loading" :deliverable="DeliverableData" />
      <div class="app-panel-header-buttons" v-if="DeliverableData && !loading">
        <Dropdown>
          <template v-slot:trigger>
            <Icon name="uis:ellipsis-v" size="1.15rem" />
          </template>
          <template v-slot:menu>
            <div class="dropdown-item" @click="deleteDeliverableModal()">Delete deliverable</div>
          </template>
        </Dropdown>
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <!-- <div class="deliverable-wrapper max-width sm">
        <section class="deliverable-tabs" v-if="StateData && PreviousStateData && PreviousDeliverableId != 0" :class="ActiveTab == 'current' ? 'right' : 'left'" @click="handleTabChange">
          <div class="deliverable-tab" :class="ActiveTab == 'previous' ? 'active' : ''">
            <p>{{ PreviousStateData.name }}</p>
          </div>
          <div class="deliverable-tab" :class="ActiveTab == 'current' ? 'active' : ''">
            <p>{{ StateData.name }}</p>
          </div>
        </section>
      </div> -->
      <!-- 
        I want to replace all of this with something simpler and more efficient that shows:
        - A list of all states in the workflow
        - Highlighting the current state 
        - Clickable selection of a state to view the deliverable at that state

      -->

      <section class="deliverables">
        <DeliverableManager :DeliverableData="DeliverableContentData" :StateData="StateData" />
        <section class="state-manager">
          <!-- {{ workflowStates }} -->
          <!-- {{ DeliverableData }} -->
          <!-- {{ currentPositionInWorkflow }}
          {{ previousPositionInWorkflow }}
          {{ nextPositionInWorkflow }} -->
          <div class="state-manager-workflow" v-if="DeliverableData && workflowStates">
            <button class="button primary large">Move to Outline</button>
            <section class="single-workflow">
              <StateRow
                v-for="(state, index) in workflowStates"
                :key="state"
                :deliverableId="DeliverableData.id"
                :state="state"
                :status="getStatus(index)"
                @click="console.log('Clicked state', state)"
              />
              <!-- <div v-for="(state, index) in workflowStates">
                {{ state }}
                {{ getStatus(index) }}
              </div> -->
            </section>
          </div>
        </section>
      </section>
      <!-- <section class="deliverables" v-if="DeliverableContentData && 
                                          StateData && PreviousStateData && 
                                          !loading
      ">
        <DeliverableManager v-if="ActiveTab == 'previous' && PreviousDeliverableContentData" :DeliverableData="PreviousDeliverableContentData" :StateData="PreviousStateData" :editable="false" />
        <DeliverableManager v-if="ActiveTab == 'current'" :DeliverableData="DeliverableContentData" :StateData="StateData" />
      </section>
      <StateManager v-if="DeliverableData && workflowStates" :deliverable="DeliverableData" :states="workflowStates" /> -->
    </template>
  </AppPanel>
</template>

<script setup>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';
import StateManager from '~/components/States/StateManager.vue';
import DeliverableManager from '~/components/Deliverables/DeliverableManager.vue';
import StateRow from '~/components/States/StateRow.vue';

const supabase = useSupabaseClient();
const loading = ref(true);
const projectId = ref(null);
const route = useRoute();
const workflowStates = ref([]);
const isFirstState = ref(false);
const isLastState = ref(false);

// This deliverable
const deliverableId = route.params.id;
const DeliverableData = ref(null);
const DeliverableContentData = ref(null);
const StateData = ref(null);
const StateInstanceData = ref(null);

// Previous deliverable
const PreviousDeliverableId = ref(null);
const PreviousDeliverableContentData = ref(null);
const PreviousStateData = ref(null);
const PreviousStateInstanceData = ref(null);

// State manager
const currentPositionInWorkflow = ref(null);
const previousPositionInWorkflow = ref(null);
const nextPositionInWorkflow = ref(null);

import useDeliverables from '~/composables/useDeliverables';
const { fetchSingleProjectDeliverableByState, fetchDeliverableState, DeliverableWorkflowStateData, deleteDeliverableModal } = useDeliverables();

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance } = useWorkflowStateInstances();

import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
const { fetchSingleState } = useWorkflowStateTypes();

import { useDeliverableStore } from '~/stores/deliverable';
const deliverableStore = useDeliverableStore();

async function getDeliverable(id) {
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if(data.description === null) {
      data.description = 'No description provided';
    }

    return data;

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

// function handleTabChange() {
//   if (ActiveTab.value === 'current') {
//     ActiveTab.value = 'previous';
//   } else {
//     ActiveTab.value = 'current';
//   }
// }

function setPreviousDeliverableId(WorkflowStates, CurrentState) {
  let PreviousState = WorkflowStates[WorkflowStates.indexOf(CurrentState) - 1];
  
  if (isFirstState.value) {
    return 0;
  } else {
    return PreviousState;
  }
}

async function fetchWorkflowStates() {
  try {
    loading.value = true;
    // 1. Get the current deliverable ID and set the previous state too
    const deliverableId = route.params.id;

    // 2. Get the project ID from the deliverable
    const { data: deliverableData, error: deliverableError } = await supabase
      .from('deliverables')
      .select('project')
      .eq('id', deliverableId)
      .single();

    if (deliverableError) throw deliverableError;

    let id = deliverableData.project;

    // 3. Get the workflow ID from the project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('workflow')
      .eq('id', id)
      .single();

    if (projectError) throw projectError;

    const workflowId = projectData.workflow;

    // 4. Get the workflow states instances array from the workflow
    const { data: workflowData, error: workflowError } = await supabase
      .from('workflows')
      .select('states')
      .eq('id', workflowId)
      .single();

    if (workflowError) throw workflowError;

    workflowStates.value = workflowData.states;

    if (workflowStates.value[0] === DeliverableWorkflowStateData.value) {
      isFirstState.value = true;
    }

    if (workflowStates.value[workflowStates.value.length - 1] === DeliverableWorkflowStateData.value) {
      isLastState.value = true;
    }

    PreviousDeliverableId.value = setPreviousDeliverableId(workflowStates.value, DeliverableWorkflowStateData.value);

  } catch (error) {
    console.error('Error fetching workflow states:', error);
  } finally {
    loading.value = false;
  }
}

watch(
  () => deliverableStore.stateInstanceId,
  async (newState) => {
    if (newState) {
      console.log('State instance ID changed [id].vue', deliverableStore.stateInstanceId);
      refreshDeliverable();
    }
  }
);

let numRefreshes = 0;

async function refreshDeliverable() {
  loading.value = true;

  await fetchDeliverableState(deliverableId);
  await fetchSingleProjectDeliverableByState(deliverableId, DeliverableWorkflowStateData.value);
  await fetchWorkflowStates();

  // This is the current deliverable
  DeliverableData.value = await getDeliverable(deliverableId);
  projectId.value = DeliverableData.value.project;
  DeliverableContentData.value = await fetchSingleProjectDeliverableByState(deliverableId, DeliverableWorkflowStateData.value);
  StateInstanceData.value = await fetchSingleStateInstance(DeliverableWorkflowStateData.value);
  StateData.value = await fetchSingleState(StateInstanceData.value[0].state_type);

  // This is the previous deliverable
  PreviousStateInstanceData.value = await fetchSingleStateInstance(PreviousDeliverableId.value);
  if (PreviousStateInstanceData.value[0] !== undefined) {
    PreviousStateData.value = await fetchSingleState(PreviousStateInstanceData.value[0].state_type);
  }
  PreviousDeliverableContentData.value = await fetchSingleProjectDeliverableByState(deliverableId, PreviousDeliverableId.value);
  
  // Set the deliverable state in the store
  console.log('Setting deliverable state in store in refreshDeliverable()', deliverableId, DeliverableWorkflowStateData.value);
  deliverableStore.setDeliverableState(deliverableId, DeliverableWorkflowStateData.value);

  setCurrentPositionInWorkflow();

  loading.value = false;
}

onMounted(async () => {
  try {
    const subscription = supabase
      .from('deliverables')
      .on('UPDATE', payload => {
        loading.value = true;
        refreshDeliverable();
        loading.value = false;
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeSubscription(subscription);
    });

    refreshDeliverable();
    setIcon();

  } catch (error) {
    console.error(error);
  }
});

// StateManager

function getStatus(index) {
  if (index === currentPositionInWorkflow.value) {
    return 'current';
  } else if (index < currentPositionInWorkflow.value) {
    return 'complete';
  } else {
    return 'incomplete';
  }
}

async function setIcon() {
  loading.value = true;

  try {
    StateInstanceData.value = await fetchSingleStateInstance(DeliverableData.value.workflow_state);
    if (!StateInstanceData.value) {
      throw new Error('Failed to fetch state instance');
    }

    StateData.value = await fetchSingleState(StateInstanceData.value[0].state_type);
    if (!StateData.value) {
      throw new Error('Failed to fetch state type');
    }

    stateDetails.value = {
      state_instance: StateInstanceData.value,
      state_type: StateData.value,
    };

    loading.value = false;
  } catch (error) {
    console.error('Error fetching state:', error.message);
    error.value = error.message;
  }
}

function setCurrentPositionInWorkflow() {
  console.log(DeliverableData.value.workflow_state);
  
  currentPositionInWorkflow.value = workflowStates.value.findIndex((state) => state == DeliverableData.value.workflow_state);
  console.log('Current position in workflow:', currentPositionInWorkflow.value);

  if (currentPositionInWorkflow.value === 0) {
    previousPositionInWorkflow.value = 0;
  } else {
    previousPositionInWorkflow.value = currentPositionInWorkflow.value - 1;
  }

  if (currentPositionInWorkflow.value === workflowStates.value.length - 1) {
    nextPositionInWorkflow.value = workflowStates.value.length;
  } else {
    nextPositionInWorkflow.value = currentPositionInWorkflow.value + 1;
  }
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverable-overview {
  width: calc(100%);
  padding: $spacing-md;
  border-radius: $br-md;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-md;
  height: 140px;

  .deliverable-summary {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 50%;

    .deliverable-title-input {
      font-family: $font-family-secondary;
      font-size: $font-size-lg;
      font-weight: 500;
      margin: 0 -0.85rem;
      background-color: transparent;
      width: 100%;
      padding: $spacing-xs;

      &:focus,
      &:active {
        border: 1px solid $brand;
        background: $white;
      }
    }

    .deliverable-title-description {
      font-family: $font-family-main;
      font-size: $font-size-sm;
      color: $gray-dark;
      font-weight: 400;
      margin: -10px -0.85rem 0 -0.85rem;
      background-color: transparent;
      width: 100%;
      padding: $spacing-xs;

      &:focus,
      &:active {
        border: 1px solid $brand;
        background: $white;
        color: $black;
      }
    }

    p {
      font-size: $font-size-sm;
      font-weight: 400;
      margin: 0;
    }
  }
}

.deliverables {
  display: grid;
  grid-template-columns: 1fr 280px;
  height: 100%;

  .state-manager {
    padding: $spacing-sm 0;
    margin: 0 $spacing-sm $spacing-sm 0;
    height: auto;

    .state-manager-workflow {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    .single-workflow {
      display: flex;
      flex-direction: column;
      border: $border;
      border-radius: $br-lg;
      overflow: hidden;
    }
  }
}

// .deliverable-manager {
//   display: flex;
//   flex-direction: column;
//   height: calc(100% - 60px - 80px);
//   background-color: $white;

//   @media (max-width: 600px) {
//     height: calc(100% - 110px - 80px);
//   }

//   .toggle-information {
//     position: absolute;
//     bottom: $spacing-sm;
//     left: $spacing-sm;
//     z-index: 1;
//     background-color: rgba($white, 0.15);
//     backdrop-filter: blur(10px);
//     border-radius: $br-lg;
//     box-shadow: $big-shadow;
//     padding: $spacing-xs;
//     color: $brand;
//   }

//   .deliverable-instruction {
//     padding: $spacing-md;
//     font-size: $font-size-sm;
//     background-color: rgba($white, 0.15);
//     backdrop-filter: blur(10px);
//     border-radius: $br-lg;
//     display: flex;
//     flex-direction: row;
//     justify-content: flex-end;
//     align-items: center;
//     align-self: center;
//     gap: $spacing-xs;
//     max-width: 400px;
//     width: calc(100% - 2 * $spacing-sm);
//     position: absolute;
//     bottom: $spacing-sm;
//     left: $spacing-sm;
//     box-shadow: $big-shadow;
//     z-index: 1;

//     .deliverable-instruction-content {
//       display: flex;
//       flex-direction: row;
//       justify-content: space-between;
//       align-items: flex-end;
//       gap: $spacing-md;

//       section {
//         display: flex;
//         flex-direction: column;
//         gap: $spacing-xxs;
//       }

//       h4 {
//         font-size: $font-size-sm;
//         font-weight: bold;
//         margin: 0;
//       }

//       p {
//         font-size: $font-size-sm;
//         font-weight: 400;
//         margin: 0;
//         opacity: 0.5;

//         &.instruction-information {
//           font-size: $font-size-sm;
//           font-weight: 500;
//           text-transform: uppercase;
//           opacity: 1;
//           color: $brand;
//           border-radius: $br-md;
//         }
//       }
//     }
//   }

//   .deliverable-editor {
//     width: 100%;
//     height: calc(100%);
//     padding: 0;
//     background-color: rgba($white, 0.025);

//     .external-link {
//       width: calc(100% - 2 * $spacing-sm);
//       height: calc(100% - $spacing-sm);
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       align-items: center;
//       border-radius: $br-lg;
//       margin: $spacing-sm $spacing-sm 0 ;
//       background: rgba($brand, 0.05);
//       box-shadow: inset 0 0 120px 120px white;

//       .instruction-set {
//         width: calc(100% - 2 * $spacing-sm);
//         max-width: 600px;
//         background: $white;
//         border-radius: $br-lg;
//         padding: $spacing-md;
//         margin: $spacing-sm;
//         display: flex;
//         flex-direction: column;
//         gap: $spacing-xxs;
//         box-shadow: $big-shadow;

//         p {
//           margin: 0;
//         }

//         .instruction-information {
//           color: $brand;
//           text-transform: capitalize;
//         }
//       }

//       .link-set {
//         display: flex;
//         gap: $spacing-xs;
//         flex-direction: column;
//         margin-top: $spacing-sm;

//         .link-content {
//           display: flex;
//           flex-direction: row;
//           gap: $spacing-xs;
//           width: 100%;

//           @media (max-width: 600px) {
//             flex-direction: column;
//           }
          
//           .form-input {
//             margin: 0;
//           }

//           input {
//             width: 100%;
//           }
//         }
//       }

//       .link-value {
//         align-self: center;
//         width: auto;
//         padding: $spacing-xs;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         white-space: nowrap;
//         margin: 0;
//       }
//     }

//     .external-link-warning {
//       max-width: 600px;
//     }
//   }
// }

// .deliverable-wrapper {
//   margin: $spacing-sm auto;
// }

// .deliverable-tabs {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   margin: 0 $spacing-sm;
//   background: rgba($brand, 0.05);
//   padding: $spacing-xxs;
//   border-radius: $br-xl;
//   position: relative;

//   &:after {
//     content: '';
//     position: absolute;
//     bottom: $spacing-xxs;
//     top: $spacing-xxs;
//     width: calc(50% - 2 * $spacing-xxs);
//     background: rgba($brand, 0.1);
//     border-radius: $br-lg;
//     transition: all .3s ease;
//     mix-blend-mode: multiply;
//     pointer-events: none;
//   }

//   &.left {
//     &:after {
//       left: $spacing-xxs;
//     }
//   }

//   &.right {
//     &:after {
//       left: calc(50% + $spacing-xxs);
//     }
//   }

//   .deliverable-tab {
//     padding: $spacing-xxxs $spacing-xs;
//     border-radius: $br-lg;
//     background: transparent;
//     cursor: pointer;
//     width: 50%;
//     text-align: center;
//     margin-bottom: -1px;
//     font-weight: bold;
//     font-size: $font-size-xs;
//     color: $black;
//     text-transform: capitalize;

//     p {
//       margin: 0;

//       small {
//         color: rgba($black, 0.5);
//         font-size: $font-size-xs;
//       }
//     }

//     &.active {
//       color: $brand;
//     }
//   }
// }

</style>