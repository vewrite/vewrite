<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="deliverable && !loading" :to="'/project/' + projectId" class="button">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.35356 1.35355C5.54882 1.15829 5.54882 0.841705 5.35356 0.646443C5.1583 0.451181 4.84172 0.451181 4.64645 0.646443L1.35356 3.93934C0.767773 4.52512 0.767774 5.47487 1.35356 6.06066L4.64645 9.35355C4.84172 9.54881 5.1583 9.54881 5.35356 9.35355C5.54882 9.15829 5.54882 8.84171 5.35356 8.64644L2.20711 5.5L11.5 5.5C11.7761 5.5 12 5.27614 12 5C12 4.72385 11.7761 4.5 11.5 4.5L2.20711 4.5L5.35356 1.35355Z" fill="black"/>
        </svg>
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
      <Loading v-if="loading" />
      <aside class="object-overview" v-if="deliverable && !loading">
        <div class="object-summary">
          <input class="object-title-input" v-model="deliverable.title" @input="updateDeliverableTitle(deliverable.id, $event.target.value)" />
          <input class="object-title-description" v-model="deliverable.description" @input="updateDeliverableDescription(deliverable.id, $event.target.value)" />
        </div>
      </aside>
      <section class="deliverable-manager">
        <div class="deliverable-editor" v-if="deliverable && !loading">
          <TipTapEditor v-if="deliverable.markdown !== ''" v-model="deliverable.markdown" :deliverable="deliverable" />
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

// Get the route object
const route = useRoute();

// Extract the deliverable ID from the route parameters
const deliverableId = route.params.id;

// Fetch the project data from supabase
const deliverable = ref(null);

// useDeliverable composable
import useDeliverables from '~/composables/useDeliverables';
const { deleteDeliverableModal, updateDeliverableTitle, updateDeliverableDescription } = useDeliverables();

const workflowStates = ref([]);

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
        getDeliverable(deliverableId);
        fetchWorkflowStates();
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeSubscription(subscription);
    });

    await getDeliverable(deliverableId);
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

  .deliverable-editor {
    width: 100%;
    height: 100%;
    padding: 0;
    background-color: rgba($brand, 0.025);

  }
}


</style>