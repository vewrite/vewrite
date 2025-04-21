<template>
  <div class="calendar-view" :class="calendarType">

    <section class="calendar-switch">
      <span @click="calendarTypeToggle('monthly')" class="switch-item" :class="calendarType == 'monthly' ? 'active' : ''">Monthly</span>
      <span @click="calendarTypeToggle('weekly')" class="switch-item" :class="calendarType == 'weekly' ? 'active' : ''">Weekly</span>
    </section>

    <section class="calendar-layout">

      <!-- Calendar -->
      <VCalendar :class="panelState" :attributes="calendarViewAttrs" title-position="left" borderless @dayclick="handleDateSelected" v-if="calendarType == 'monthly'" />
      <VCalendar :class="panelState" :attributes="calendarViewAttrs" title-position="left" borderless @dayclick="handleDateSelected" view="weekly" v-if="calendarType == 'weekly'" />
      
      <!-- Panel -->
      <section class="calendar-panel" :class="panelState" v-if="panelState == 'open'">
        <section class="calendar-panel-header">
          <span class="panel-title">
            {{ selectedDay ? format(selectedDay.date, 'MMMM do, yyyy') : 'No date selected' }}
          </span>
          <section class="panel-actions">
            <button class="button" @click="panelToggle">
              <Icon name="fluent:chevron-left-16-regular" size="1.5rem" />
            </button>
            <button class="button primary" @click="handleOpenModal(selectedDay.date)" v-if="personaState == 'manager' && isOwner && !membersError">
              <Icon name="fluent:add-20-regular" size="1.5rem" />
            </button>
          </section>
        </section>
        <section class="calendar-panel-content">
          
          <Loading v-if="loading" type="small" class="padded-loader" />
          
          <div class="no-deliverables" v-if="deliverablesByDate.length == 0 && !loading">
            <p>No deliverables found for this date</p>
          </div>
          <div class="calendar-panel-deliverables" v-if="!loading" v-for="deliverable in deliverablesByDate">
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
                  <VDatePicker :id="'deliverable-calendar-' + deliverable.id" :attributes="deliverable.attrs" v-model="deliverable.selectedDate" @update:modelValue="handleOnDateSelect(deliverable.id, deliverable.selectedDate)" borderless />
                </template>
              </Dropdown>
              <router-link :to="'/deliverable/' + deliverable.id" class="button primary">Open</router-link>
            </div>
          </div>
        </section>
      </section>
    
    </section>
    
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

const calendarType = ref('monthly');

const props = defineProps({
  deliverables: Array,
  project: Object,
  calendarViewAttrs: Array,
  personaState: String,
  isOwner: Boolean,
  membersError: Boolean
});

const deliverablesByDate = ref([]);
const selectedDay = ref(null);

// Calendar panel state
const panelState = ref('closed');

const panelToggle = () => {
  panelState.value = panelState.value === 'closed' ? 'open' : 'closed';
};

const calendarTypeToggle = (type) => {
  calendarType.value = type;
};

function handleOpenModal(selectedDate) {
  selectedDeliverableDate.value = selectedDate;
  createDeliverableModal(props.project.id)
}

async function handleOnDateSelect(deliverableId, selectedDate) {
  try {
    await onDateSelect(deliverableId, selectedDate);
    deliverablesByDate.value = await loadDeliverableByDate(selectedDate);
  } catch (error) {
    console.error('Error selecting date:', error.message);
  }

}

async function handleDateSelected(date) {

  loading.value = true;

  if (panelState.value === 'closed') {
    panelToggle();
  }

  // format should be timestamptz
  // like: 2025-03-11 22:00:00+00
  const simplifiedDate = {
    year: date.year,
    month: date.month,
    day: date.day,
    date: new Date(date.year, date.month - 1, date.day),
  };
  
  selectedDay.value = simplifiedDate;

  try {
    deliverablesByDate.value = await loadDeliverableByDate(simplifiedDate.date);
  } catch (error) {
    console.error('Error fetching deliverables:', error.message);
  } finally {
    loading.value = false;
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
  max-width: 1600px;
  margin: $spacing-md auto;
  border: $border;
  border-radius: $br-lg;
  display: flex;
  flex-direction: column;

  .calendar-switch {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: $spacing-sm;
    border-bottom: $border;
    overflow: visible;
    z-index: 1;
    position: relative;

    .switch-item {
      cursor: pointer;
      padding: $spacing-sm;
      border-bottom: 1px solid transparent;
      margin-bottom: -1px;

      &.active {
        color: $brand;
        border-bottom: 1px solid $brand;
      }
    }
  }

  .vc-expanded {
    min-width: auto;
  }

  .calendar-layout {
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;

    .v-calendar {
      width: 100%;
      height: 100%;
    }
  }

  .calendar-panel {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    width: 100%;
    border-left: $border;
    background-color: rgba($black, 0.025);

    &.open {
      display: flex;
    }

    &.closed {
      display: none;
    }

    .calendar-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 58px;
      padding: 0 $spacing-sm 0 $spacing-sm;
      background: linear-gradient(to bottom, rgba($white, 0.75), transparent);

      .panel-title {
        font-size: $font-size-md;
      }

      .panel-actions {
        display: flex;
        flex-direction: row;
        gap: $spacing-xs;
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
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba($black, 0.5);
      }

      .calendar-panel-deliverables {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: $spacing-sm;
        transition: background-color 0.2s ease;
        border-radius: $br-xl;
        background-color: rgba($white, 1);
        cursor: pointer;
        box-shadow: $small-shadow;

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
          width: 80%;
          text-wrap: balance;
          margin: $spacing-md;
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