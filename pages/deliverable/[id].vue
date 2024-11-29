<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="deliverable && !loading" :to="'/project/' + projectId" class="button">
        <Icon name="fluent:arrow-left-16-regular" size="1.5rem" />
      </router-link>
      <div class="app-panel-header-buttons">
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
      <!-- <pre v-if="DeliverableData">{{ DeliverableData }}</pre>
      <pre v-if="deliverable">{{ deliverable }}</pre> -->
      <Loading v-if="loading" />
      <aside class="object-overview" v-if="deliverable && !loading">
        <div class="object-summary">
          <input class="object-title-input" v-model="deliverable.title" @input="updateDeliverable" />
          <input class="object-title-description" v-model="deliverable.description" @input="updateDeliverable" />
        </div>
      </aside>
      <pre v-if="StateInstanceData && StateType">
        - Current state: {{ CurrentState }}
        - All states: {{ workflowStates }}
        <!-- <p>State instance is: {{ StateInstanceData }}</p> -->
        - State type is: {{ StateType.name }}
        - Is first state: {{ isFirstState }}
        - Is last state: {{ isLastState }}
      </pre>
      <section class="deliverable-manager">
        <div v-if="DeliverableData && !loading">
          <!-- New state -->
          <!-- - Only show the requirement that the client define the expectations of the deliverable -->
        </div>
        <!-- <div class="deliverable-editor" v-if="DeliverableData && !loading">
           <TipTapEditor v-if="DeliverableData.content.type == 'markdown'" :deliverable="DeliverableData" />
           <span v-if="DeliverableData.content.type == 'link'" >{{ DeliverableData.content.content }}</span>
        </div> -->
        <StateManager v-if="deliverable && workflowStates" :deliverable="deliverable" :states="workflowStates" />
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
import StateManager from '~/components/States/StateManager.vue';

const supabase = useSupabaseClient();
const loading = ref(true);
const projectId = ref(null);
const route = useRoute();
const deliverableId = route.params.id;
const deliverable = ref(null);
const workflowStates = ref([]);
const CurrentState = ref(null);
const StateType = ref(null);
const isFirstState = ref(false);
const isLastState = ref(false);

// useDeliverable composable
import useDeliverables from '~/composables/useDeliverables';
const { saveDeliverable, fetchSingleProjectDeliverableByState, deleteDeliverableModal, DeliverableData, DeliverableError } = useDeliverables();

// useWorkflowStateInstances composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, StateInstanceData } = useWorkflowStateInstances();

// useWorkflowStateTypes composable
import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
const { fetchSingleState, StateData } = useWorkflowStateTypes();

async function getCurrentState(deliverableId) {
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', deliverableId)
      .single();

    if (error) throw error;

    CurrentState.value = data.workflow_state;

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

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

    deliverable.value = data;

    projectId.value = data.project;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}


async function fetchWorkflowStates() {
  try {
    // 1. Get the current deliverable ID
    const deliverableId = route.params.id;

    // 2. Get the project ID from the deliverable
    const { data: deliverableData, error: deliverableError } = await supabase
      .from('deliverables')
      .select('project')
      .eq('id', deliverableId)
      .single();

    if (deliverableError) throw deliverableError;

    const projectId = deliverableData.project;

    // 3. Get the workflow ID from the project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('workflow')
      .eq('id', projectId)
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

    if (workflowStates.value[0] === CurrentState.value) {
      isFirstState.value = true;
    }

    if (workflowStates.value[workflowStates.value.length - 1] === CurrentState.value) {
      isLastState.value = true;
    }

  } catch (error) {
    console.error('Error fetching workflow states:', error);
  } finally {
    loading.value = false;
  }
}

// Fetch the deliverable data when the component is mounted
onMounted(async () => {
  try {
    const subscription = supabase
      .from('deliverables')
      .on('UPDATE', payload => {
        console.log('Deliverable updated:', payload.new);
        getCurrentState(deliverableId);
        getDeliverable(deliverableId);
        fetchSingleProjectDeliverableByState(deliverableId, CurrentState.value);
        fetchWorkflowStates();
        fetchSingleStateInstance(CurrentState.value);
        StateType.value = fetchSingleState(StateInstanceData.value[0].state_type);
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeSubscription(subscription);
    });

    await getCurrentState(deliverableId);
    await getDeliverable(deliverableId);
    await fetchSingleProjectDeliverableByState(deliverableId, CurrentState.value);
    await fetchWorkflowStates();
    await fetchSingleStateInstance(CurrentState.value);
    StateType.value = await fetchSingleState(StateInstanceData.value[0].state_type);

  } catch (error) {
    console.error(error);
  }
});

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedSaveDeliverable = debounce(() => saveDeliverable(deliverable.value), 1000);

function updateDeliverable() {
  debouncedSaveDeliverable();
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

.deliverable-manager {
  display: flex;
  flex-direction: row;
  height: 100%;
  background-color: $white;

  .deliverable-editor {
    width: 100%;
    height: 100%;
    padding: 0;
    background-color: rgba($white, 0.025);

  }
}


</style>