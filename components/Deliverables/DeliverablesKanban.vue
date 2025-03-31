<template>
  <div class="kanban-view">
    <div class="kanban-column" v-for="deliverable in deliverables">
      {{ deliverable }}
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
  calendarViewAttrs: Array,
  personaState: String,
  isOwner: Boolean,
  membersError: Boolean
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.kanban-view {
  display: flex;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  gap: $spacing-sm;

  .kanban-column {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    width: 300px;
    min-width: 300px;
    padding: $spacing-sm;
    border-radius: $br-md;
    background-color: $white;
    border: $border;
    
  }
}

</style>