<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="deliverable && !loading" :to="'/project/' + projectId" class="button">Back</router-link>
      <div class="app-panel-header-buttons">
        <!-- TODO - This delete button is dangerous and should be replaced with a modal -->
        <span class="button red" @click="deleteDeliverable(deliverable.id, projectId)">Delete Deliverable</span>
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <aside class="deliverable-overview" v-if="deliverable && !loading">
        <div class="deliverable-summary">
          <input class="deliverable-title-input" v-model="deliverable.title" @input="updateDeliverableTitle(deliverable.id, $event.target.value)" />
          <input class="deliverable-title-description" v-model="deliverable.description" @input="updateDeliverableDescription(deliverable.id, $event.target.value)" />
        </div>
        <section class="state-management">
          <!-- TODO -  This breaks if there are no state instances set -->
          <!-- https://github.com/ramijames/vewrite/issues/19 -->
          <div class="button vertical"><small>Current state</small><span>{{ StateInstanceData[0].instance_name }}</span></div>
        </section>
      </aside>
      <div class="deliverable-editor" v-if="deliverable && !loading">
        <Toolbar :textareaRef="$refs.textareaRef" />
        <textarea 
          ref="textareaRef" 
          v-if="deliverable.markdown !== ''" 
          v-model="deliverable.markdown" 
          @input="updateDeliverable" 
        />
      </div>
    </template>
  </AppPanel>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';
import Toolbar from '~/components/Toolbar.vue';

const supabase = useSupabaseClient();
const loading = ref(true);
const projectId = ref(null);
const textareaRef = ref(null);
const currentState = ref(null);
const previousState = ref(null);
const nextState = ref(null);

// Get the route object
const route = useRoute();

// Extract the deliverable ID from the route parameters
const deliverableId = route.params.id;

// Fetch the project data from supabase
const deliverable = ref(null);

// useDeliverable composable
import useDeliverables from '~/composables/useDeliverables';
const { saveDeliverable, deleteDeliverable, updateDeliverableTitle, updateDeliverableDescription } = useDeliverables();

// useWorkflowStateInstances composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, StateInstanceData } = useWorkflowStateInstances();

// Get the previous and next states
// 1. Get the project workflow
// 2. Get the state instances
// 3. Get the current state instance
// 4. Set the previous and next state instances


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
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

// Manual debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Debounced save function
const debouncedSaveDeliverable = debounce(() => saveDeliverable(deliverable.value), 1000);

// Update deliverable function
function updateDeliverable() {
  debouncedSaveDeliverable();
}

// Fetch the deliverable data when the component is mounted
onMounted(async () => {
  await getDeliverable(deliverableId);
  await fetchSingleStateInstance(deliverable.value.workflow_state);
});

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

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

.deliverable-editor {
  width: 100%;
  height: calc(100% - 140px);
  padding: 0 $spacing-md $spacing-md $spacing-md;
  border-top: 1px solid rgba($black, 0.1);
  background-color: $white;

  textarea {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    font-size: $font-size-md;
    padding: $spacing-sm 0 0 0;
  }
}


</style>