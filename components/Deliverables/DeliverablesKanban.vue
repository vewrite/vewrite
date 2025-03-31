<template>
  <div class="kanban-view" :class="{ loading: loading }">
    <Loading v-if="loading" type="small" />

    <div class="kanban-column" v-if="!loading" v-for="state in deliverablesByState">
      <!-- {{ state }} -->
      <div class="kanban-column-header">{{ state.instance_name }}</div>
      <div class="deliverables">
        <div class="deliverable" v-for="deliverable in state.deliverables">
          <div class="deliverable-title">{{ deliverable.title }}</div>
          <div class="deliverable-due-date">{{ deliverable.due_date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { format, parseISO } from 'date-fns';

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { fetchDeliverable, onDateSelect, createDeliverableModal, useSelectedDate } = useDeliverables();

// State Instance composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchStateInstanceName } = useWorkflowStateInstances();

const supabase = useSupabaseClient();
const selectedDeliverableDate = useSelectedDate();

const loading = ref(false);

const props = defineProps({
  deliverables: Array,
  project: Object,
  workflowStates: Array
});

// So I have many workflow states in my project, and I want to display them as columns in a kanban view.
// I have a prop called workflowStates that contains the ids of the workflow states.
// In each column, I'll want to create an array of deliverables that belong to that state.

const deliverablesByState = ref([]);

// Now, I need to populate this array with each state and its information.

async function populateStates() {
  
  loading.value = true;

  try {

    for (const state of props.workflowStates) {
      const stateId = state;
      const stateName = await fetchStateInstanceName(state);

      // deliverables is an array of objects that contain the deliverables that belong to the state.
      // I want to filter the deliverables into the deliverables array.
      const deliverables = props.deliverables.filter(deliverable => deliverable.workflow_state === state);
      deliverablesByState.value.push({ id: stateId, instance_name: stateName[0].instance_name, deliverables: deliverables });

    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  
  try {
    await populateStates();
  } catch (error) {
    console.error(error);
  }
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.kanban-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-flow: column;
  height: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  gap: $spacing-sm;
  padding: $spacing-md;

  &.loading {
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .kanban-column {
    display: flex;
    flex-direction: column;
    width: 300px;
    min-width: 300px;
    border-radius: $br-md;
    background-color: rgba($black, 0.025);
    border: $border;
    height: 100%;
    overflow: hidden;
    
    .kanban-column-header {
      font-size: $font-size-xs;
      padding: $spacing-sm $spacing-sm 0 $spacing-sm;
      background: linear-gradient(to bottom, rgba($white, 0.75), transparent);
      color: rgba($black, 0.5);
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .deliverables {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      padding: $spacing-sm;
      height: 100%;
      overflow-y: auto;

      .deliverable {
        padding: $spacing-sm;
        border-radius: $br-lg;
        background-color: rgba($white, 1);
        cursor: pointer;
        transition: background-color 0.2s;
        box-shadow: $small-shadow;

        &:hover {
          outline: 1px solid rgba($brand, 0.25);
        }

        .deliverable-title {
          font-size: $font-size-sm;
        }

        .deliverable-due-date {
          font-size: $font-size-xs;
          color: $gray;
        }
      }
    }
  }
}

</style>