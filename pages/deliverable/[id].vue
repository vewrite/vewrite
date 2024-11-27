<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="deliverable && !loading" :to="'/project/' + projectId" class="button">
        <Icon name="fluent:chevron-left-16-regular" size="1rem" />
        Back
      </router-link>
      <div class="app-panel-header-buttons">
        <Dropdown>
          <template v-slot:trigger>
            <svg width="2" height="10" viewBox="0 0 2 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1ZM2 5C2 5.55228 1.55228 6 1 6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4C1.55228 4 2 4.44772 2 5ZM1 10C1.55228 10 2 9.55229 2 9C2 8.44771 1.55228 8 1 8C0.447715 8 0 8.44771 0 9C0 9.55229 0.447715 10 1 10Z" fill="black"/>
            </svg>
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
          <input class="object-title-input" v-model="deliverable.title" @input="updateDeliverableTitle(deliverable.id, $event.target.value)" />
          <input class="object-title-description" v-model="deliverable.description" @input="updateDeliverableDescription(deliverable.id, $event.target.value)" />
        </div>
      </aside>
      <section class="deliverable-manager">
        <div class="deliverable-editor" v-if="DeliverableData && !loading">
           <TipTapEditor v-if="DeliverableData.content.type == 'markdown'" :deliverable="DeliverableData" />
           <span v-if="DeliverableData.content.type == 'link'" >{{ DeliverableData.content.content }}</span>
        </div>
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

// useDeliverable composable
import useDeliverables from '~/composables/useDeliverables';
const { fetchSingleProjectDeliverableByState, deleteDeliverableModal, updateDeliverableTitle, updateDeliverableDescription, DeliverableData, DeliverableError } = useDeliverables();

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
    console.log(data);

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
    console.log(workflowData.states);

    workflowStates.value = workflowData.states;
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
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeSubscription(subscription);
    });

    await getCurrentState(deliverableId);
    await getDeliverable(deliverableId);
    await fetchSingleProjectDeliverableByState(deliverableId, CurrentState.value);
    await fetchWorkflowStates();

  } catch (error) {
    console.error(error);
  }
});

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