<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="projectId && !loading" :to="'/project/' + projectId" class="button">
        <Icon name="fluent:arrow-left-16-regular" size="1.5rem" />
      </router-link>
      <ObjectOverview v-if="DeliverableData && !loading" :deliverable="DeliverableData" />
      <Assigned v-if="DeliverableData && !loading" :deliverable="DeliverableData" :user="user" />
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
      <Loading v-if="loading" type="small" />
      <section class="deliverables" v-if="!loading">
        <DocumentManager v-if="DeliverableData" :DeliverableData="DeliverableData" />
      </section>
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
import DocumentManager from '~/components/Deliverables/DocumentManager.vue';
import Assigned from '~/components/Deliverables/Assigned.vue';

// import TurnDownService from 'turndown';
// const turndownService = new TurnDownService();

const supabase = useSupabaseClient();
const user = supabase.auth.user();
const loading = ref(true);
// const projectId = ref(null);
const route = useRoute();
const deliverableId = route.params.id;
// const workflowStates = ref([]);
// const isFirstState = ref(false);
// const isLastState = ref(false);

// // This deliverable
// const deliverableId = route.params.id;
// const DeliverableData = ref(null);
// const DeliverableContentData = ref(null);
// const StateData = ref(null);
// const StateInstanceData = ref(null);

// // Previous deliverable
// const PreviousDeliverableId = ref(null);
// const PreviousDeliverableContentData = ref(null);
// const PreviousStateData = ref(null);
// const PreviousStateInstanceData = ref(null);

// // State manager
// const currentPositionInWorkflow = ref(null);
// const previousPositionInWorkflow = ref(null);
// const nextPositionInWorkflow = ref(null);
// const collapsed = ref(true);

// import useDeliverables from '~/composables/useDeliverables';
// const { fetchDeliverable, fetchSingleProjectDeliverableByState, fetchDeliverableState, DeliverableWorkflowStateData, deleteDeliverableModal, updateDeliverableWorkflowState, duplicateContentToNextState } = useDeliverables();

// import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
// const { fetchSingleStateInstance } = useWorkflowStateInstances();

// import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
// const { fetchSingleState } = useWorkflowStateTypes();

// import { useDeliverableStore } from '~/stores/deliverable';
// const deliverableStore = useDeliverableStore();

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

// function toggleStateManagerPanel() {
//   collapsed.value = !collapsed.value
// }

// function setPreviousDeliverableId(WorkflowStates, CurrentState) {
//   let PreviousState = WorkflowStates[WorkflowStates.indexOf(CurrentState) - 1];
  
//   if (isFirstState.value) {
//     return 0;
//   } else {
//     return PreviousState;
//   }
// }

// async function fetchWorkflowStates() {
//   try {
//     loading.value = true;
//     // 1. Get the current deliverable ID and set the previous state too
//     const deliverableId = route.params.id;

//     // 2. Get the project ID from the deliverable
//     const { data: deliverableData, error: deliverableError } = await supabase
//       .from('deliverables')
//       .select('project')
//       .eq('id', deliverableId)
//       .single();

//     if (deliverableError) throw deliverableError;

//     let id = deliverableData.project;

//     // 3. Get the workflow ID from the project
//     const { data: projectData, error: projectError } = await supabase
//       .from('projects')
//       .select('workflow')
//       .eq('id', id)
//       .single();

//     if (projectError) throw projectError;

//     const workflowId = projectData.workflow;

//     // 4. Get the workflow states instances array from the workflow
//     const { data: workflowData, error: workflowError } = await supabase
//       .from('workflows')
//       .select('states')
//       .eq('id', workflowId)
//       .single();

//     if (workflowError) throw workflowError;

//     workflowStates.value = workflowData.states;

//     if (workflowStates.value[0] === DeliverableWorkflowStateData.value) {
//       isFirstState.value = true;
//     }

//     if (workflowStates.value[workflowStates.value.length - 1] === DeliverableWorkflowStateData.value) {
//       isLastState.value = true;
//     }

//     PreviousDeliverableId.value = setPreviousDeliverableId(workflowStates.value, DeliverableWorkflowStateData.value);

//   } catch (error) {
//     console.error('Error fetching workflow states:', error);
//   } finally {
//     loading.value = false;
//   }
// }

async function refreshDeliverable() {
  loading.value = true;

  // await fetchDeliverableState(deliverableId);
  // await fetchSingleProjectDeliverableByState(deliverableId, DeliverableWorkflowStateData.value);
  // await fetchWorkflowStates();

  // This is the current deliverable
  // await fetchDeliverable(deliverableId);
  await getDeliverable(deliverableId);
  // projectId.value = DeliverableData.value.project;
  // DeliverableContentData.value = await fetchSingleProjectDeliverableByState(deliverableId, DeliverableWorkflowStateData.value);
  
  // StateInstanceData.value = await fetchSingleStateInstance(DeliverableWorkflowStateData.value);
  // StateData.value = await fetchSingleState(StateInstanceData.value[0].state_type);

  // This is the previous deliverable
  // PreviousStateInstanceData.value = await fetchSingleStateInstance(PreviousDeliverableId.value);
  // if (PreviousStateInstanceData.value[0] !== undefined) {
  //   PreviousStateData.value = await fetchSingleState(PreviousStateInstanceData.value[0].state_type);
  // }
  // PreviousDeliverableContentData.value = await fetchSingleProjectDeliverableByState(deliverableId, PreviousDeliverableId.value);
  
  // // Set the deliverable state in the store
  // deliverableStore.setDeliverableState(deliverableId, DeliverableWorkflowStateData.value);

  // setCurrentPositionInWorkflow();
  // setIcon();

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

  } catch (error) {
    console.error(error);
  }
});

// StateManager

// function getStatus(index) {
//   if (index === currentPositionInWorkflow.value) {
//     return 'current';
//   } else if (index < currentPositionInWorkflow.value) {
//     return 'complete';
//   } else {
//     return 'incomplete';
//   }
// }

// async function setIcon() {
//   loading.value = true;

//   try {
//     StateInstanceData.value = await fetchSingleStateInstance(DeliverableData.value.workflow_state);
//     if (!StateInstanceData.value) {
//       throw new Error('Failed to fetch state instance');
//     }

//     StateData.value = await fetchSingleState(StateInstanceData.value[0].state_type);
//     if (!StateData.value) {
//       throw new Error('Failed to fetch state type');
//     }

//     loading.value = false;
//   } catch (error) {
//     console.error('Error fetching state:', error.message);
//     error.value = error.message;
//   }
// }

// function setCurrentPositionInWorkflow() {
//   currentPositionInWorkflow.value = workflowStates.value.findIndex((state) => state == DeliverableData.value.workflow_state);
//   if (currentPositionInWorkflow.value === 0) {
//     previousPositionInWorkflow.value = 0;
//     isFirstState.value = true;
//   } else {
//     previousPositionInWorkflow.value = currentPositionInWorkflow.value - 1;
//     isFirstState.value = false;
//   }
//   if (currentPositionInWorkflow.value === workflowStates.value.length - 1) {
//     nextPositionInWorkflow.value = workflowStates.value.length;
//     isLastState.value = true;
//   } else {
//     nextPositionInWorkflow.value = currentPositionInWorkflow.value + 1;
//     isLastState.value = false;
//   }
// }

// I'm disabling this for now until I add the extra layer of complexity to the workflow
// async function setComplete(deliverableId, stateInstanceId) {
//   await setDeliverableContentStatus(deliverableId, workflowStates.value[currentPositionInWorkflow.value], 1);
//   await updateDeliverableWorkflowState(deliverableId, stateInstanceId);
//   await refreshDeliverable();
// }

// async function prevState() {
//   if (previousPositionInWorkflow.value === -1) {
//     return;
//   } else {
//     await handleStateChange(DeliverableData.value.id, workflowStates.value[previousPositionInWorkflow.value]);
//     await refreshDeliverable();
//   }
// }

// async function nextState() {
//   if (nextPositionInWorkflow.value === workflowStates.length) {
//     return;
//   } else {
//     await handleStateChange(DeliverableData.value.id, workflowStates.value[nextPositionInWorkflow.value]);
//     await refreshDeliverable();
//   }
// }

// async function handleStateChange(deliverableId, stateInstanceId) {
//   await updateDeliverableWorkflowState(deliverableId, stateInstanceId);
// }

// async function downloadFile(type) {
//   console.log('Downloading file in format:', type);
//   try {
//     const response = await $fetch(`/api/deliverable_content/export?id=${DeliverableContentData.value.id}&type=${type}`, {
//       responseType: 'blob',
//     });

//     if (!response) {
//       console.error('No response from server');
//       return;
//     }

//     if(type == 'html') {
//       const url = window.URL.createObjectURL(new Blob([response]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `vewrite-html-export-${DeliverableContentData.value.id}.html`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }

//     if(type == 'markdown'){
//       const markdown = await response.text();
//       const html = turndownService.turndown(markdown);
//       const url = window.URL.createObjectURL(new Blob([html], {type: 'text/html'}));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `vewrite-markdown-export-${DeliverableContentData.value.id}.md`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }

//   } catch (err) {
//     console.error('Error downloading file:', err);
//   }
// };

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
      font-size: $font-size-xs;
      color: $gray-dark;
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
      font-size: $font-size-xs;
      margin: 0;
    }
  }
}

.deliverables {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;

  .deliverable-blur {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($white, 0.0);
    z-index: 1;
    transition: all 0.3s ease;
    pointer-events: none;

    &.blurred {
      background-color: rgba($white, 0.5);
      pointer-events: all;
    }
  }

  .state-manager {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: $spacing-xs $spacing-sm;
    gap: $spacing-sm;
    z-index: 2;
    border-top: $border;

    .state-buttons {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: $spacing-xs;
    }

    .back {
      align-self: center;
      justify-self: start;
    }

    .state-panel-toggle {
      align-self: center;
      justify-self: flex-start;
      position: relative;

      .state-arrow {
        transform: rotate(180deg);
        transition: transform 0.3s ease;
      }

      &.open {
        .state-arrow {
          transform: rotate(0deg);
        }
      }
    }

    .complete {
      align-self: end;
      justify-self: end;
    }

    .next {
      align-self: center;
      justify-self: end;
      display: flex;
      flex-direction: row;
      gap: $spacing-xs;
      align-items: center;
      justify-content: center;
    }

    .state-manager-panel {
      display: none;
      position: absolute;
      bottom: 34px;
      left: 0;
      min-width: 280px;
      background-color: $white;
      border-radius: $br-lg;
      overflow: hidden;
      box-shadow: $big-shadow;
      transition: all 0.3s ease;

      &.open {
        display: block;
      }

      .state-manager-workflow {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
      }

      .single-workflow {
        display: flex;
        flex-direction: column;
        padding: $spacing-sm;
        gap: $spacing-xxxs;
      }
    }
  }
}

</style>