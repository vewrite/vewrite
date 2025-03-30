<template>
  <div class="calendar-view">
    <VCalendar :class="panelState" :attributes="calendarViewAttrs" title-position="left" borderless @dayclick="handleDateSelected" />
    <section class="calendar-panel" :class="panelState" v-if="panelState == 'open'">
      <section class="calendar-panel-header">
        <span class="panel-title">
          Deliverables
        </span>
        <button class="button" @click="panelToggle">
          <Icon name="fluent:chevron-left-16-regular" size="1.5rem" />
        </button>
      </section>
      <section class="calendar-panel-content">
        <div class="no-deliverables" v-if="deliverablesByDate.length == 0">
          <p>No deliverables found for this date</p>
        </div>
        <div class="calendar-panel-deliverables" v-for="deliverable in deliverablesByDate">
          <div class="deliverable-details">
            <div class="deliverable-type">
              <Icon v-if="deliverable.content.type == 'link'" name="fluent:open-16-regular" size="1.5rem" />
              <Icon v-if="deliverable.content.type == 'content'" name="fluent:document-16-regular" size="1.5rem" />
              <span class="deliverable-id">{{ deliverable.id }}</span>
            </div>
            <span class="deliverable-state">{{ deliverable.state_name }}</span>
          </div>
          <router-link :to="'/deliverable/' + deliverable.id" class="deliverable-title">{{ deliverable.title }}</router-link>
          <div class="deliverable-actions">
            <Dropdown position="left">
              <template v-slot:trigger>
                Due {{ deliverable.formattedDueDate }}
              </template>
              <template v-slot:menu>
                <VDatePicker :id="'deliverable-calendar-' + deliverable.id" :attributes="deliverable.attrs" v-model="deliverable.selectedDate" @update:modelValue="onDateSelect(deliverable.id, deliverable.selectedDate, deliverable.due_date)" borderless />
              </template>
            </Dropdown>
            <router-link :to="'/deliverable/' + deliverable.id" class="button primary">Open</router-link>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>

import { format, parseISO } from 'date-fns';

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { fetchDeliverable, formatDate, onDateSelect, updateDeliverableDate } = useDeliverables();

// State Instance composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchStateInstanceName } = useWorkflowStateInstances();

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const props = defineProps({
  deliverables: Array,
  project: Object,
  calendarViewAttrs: Array,
});

const deliverablesByDate = ref([]);
const selectedDay = ref(null);

// Calendar panel state
const panelState = ref('closed');

const panelToggle = () => {
  panelState.value = panelState.value === 'closed' ? 'open' : 'closed';
};

async function handleDateSelected(date) {
  // format should be timestamptz
  // like: 2025-03-11 22:00:00+00
  const simplifiedDate = {
    year: date.year,
    month: date.month,
    day: date.day,
    date: new Date(date.year, date.month - 1, date.day),
  };
  
  console.log('Date selected:', simplifiedDate);
  selectedDay.value = simplifiedDate;

  try {
    deliverablesByDate.value = await loadDeliverableByDate(simplifiedDate.date);
  } catch (error) {
    console.error('Error fetching deliverables:', error.message);
  }

  if (panelState.value === 'closed') {
    panelToggle();
  }
}

async function loadDeliverableByDate(timestamptz) {

  const targetDate = format(timestamptz, 'yyyy-MM-dd');

  try {
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('due_date::date', targetDate)
      .eq('project', props.project.id);

    if (error) throw error;

    await Promise.all(data.map(async deliverable => {
      try {
        // Workflow state instance name
        const state_name = await fetchStateInstanceName(deliverable.workflow_state);
        deliverable.state_name = state_name[0].instance_name;
      } catch (error) {
        console.error('Error fetching state:', error.message);
      }

      try {
        await fetchDeliverable(deliverable.id);
      } catch (error) {
        console.error('Error fetching content type:', error.message);
      }

      // Due date
      const dueDate = parseISO(deliverable.due_date);

      // Format the due date into something nicer
      deliverable.formattedDueDate = format(dueDate, 'MMMM do, yyyy');

    }));

    return data;

  } catch (error) {
    console.error('Error fetching deliverables:', error.message);
  }
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.calendar-view {
  height: 100%;
  width: 100%;
  border: $border;
  border-radius: $br-lg;
  display: flex;
  flex-direction: row;

  .vc-expanded {
    min-width: auto;
  }

  .calendar-panel {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    width: 100%;
    border-left: $border;

    &.open {
      display: flex;
      min-width: 500px;
      width: 500px;
    }

    &.closed {
      display: none;
    }

    .calendar-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 58px;
      border-bottom: $border;
      padding: 0 $spacing-md;

      .panel-title {
        font-size: $font-size-md;
      }
    }

    .calendar-panel-content {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      padding: 0 $spacing-sm;
      height: 100%;

      .no-deliverables {
        font-size: $font-size-xs;
        text-align: center;
      }

      .calendar-panel-deliverables {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: $spacing-sm;
        border: $border;
        border-radius: $br-md;
        transition: background-color 0.2s ease;

        .deliverable-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;

          .deliverable-type {
            display: flex;
            align-items: center;
            justify-content: center;
            color: $gray-dark;
            gap: $spacing-xxs;
          }

          .deliverable-id,
          .deliverable-state {
            color: $gray-dark;
            font-size: $font-size-xs;
          }

        }

        .deliverable-title {
          color: $black;
          text-decoration: none;
          font-size: $font-size-sm;
          width: 100%;
          line-height: 54px;
          text-align: center;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          gap: $spacing-xxs;
        }

        .deliverable-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        &:hover {
          background-color: rgba($black, 0.025);
        }
      }
    }
  }
}

</style>