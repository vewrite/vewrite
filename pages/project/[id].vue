<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/projects/" class="button">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.35356 1.35355C5.54882 1.15829 5.54882 0.841705 5.35356 0.646443C5.1583 0.451181 4.84172 0.451181 4.64645 0.646443L1.35356 3.93934C0.767773 4.52512 0.767774 5.47487 1.35356 6.06066L4.64645 9.35355C4.84172 9.54881 5.1583 9.54881 5.35356 9.35355C5.54882 9.15829 5.54882 8.84171 5.35356 8.64644L2.20711 5.5L11.5 5.5C11.7761 5.5 12 5.27614 12 5C12 4.72385 11.7761 4.5 11.5 4.5L2.20711 4.5L5.35356 1.35355Z" fill="black"/>
        </svg>
        Back
      </router-link>
      <div class="app-panel-header" v-if="project">
        <Loading type="header" v-if="loading.global" />
      </div>
      <div class="app-panel-header-buttons">
        <button class="button primary" @click="createDeliverableModal(project.id)">Create new deliverable</button>
        <Dropdown>
          <template v-slot:trigger>
            <svg width="2" height="10" viewBox="0 0 2 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1ZM2 5C2 5.55228 1.55228 6 1 6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4C1.55228 4 2 4.44772 2 5ZM1 10C1.55228 10 2 9.55229 2 9C2 8.44771 1.55228 8 1 8C0.447715 8 0 8.44771 0 9C0 9.55229 0.447715 10 1 10Z" fill="black"/>
            </svg>
          </template>
          <template v-slot:menu>
            <div class="dropdown-item" @click="deleteProjectModal(project.id)">Delete project</div>
          </template>
        </Dropdown>
      </div>
    </template>
    <template v-slot:body>
      <div class="deliverables-list">
        <Loading v-if="loading.global == true" zeroHeight="zero-height" type="small"  />

        <ProjectOverview v-if="project && loading.global == false" :project="project" :deliverables="deliverables" :client="project.client_id" :creator="creator" />
        <ProjectDetails v-if="project && loading.global == false" :client="project.client_id" :team="project.assigned_team" />
        <DeliverablesProgress v-if="project && loading.global == false && deliverables.length > 0" :deliverables="deliverables" :completedDeliverables="completedDeliverables" :totalDeliverables="deliverables.length" />

        <div class="no-deliverables" v-if="loading.deliverables == false && deliverables.length == 0">
          <p>No deliverables found for this project</p>
        </div>

        <div v-if="loading.deliverables == false && deliverables.length > 0" class="project-deliverables">
          <div class="single-deliverable" v-for="deliverable in deliverables">

            <div class="deliverable-details">
              <span class="deliverable-id">{{ deliverable.id }}</span>
              <router-link :to="'/deliverable/' + deliverable.id" class="deliverable-title">{{ deliverable.title }}</router-link>
            </div>
            
            <div class="deliverable-actions">

              <div class="deliverable-updated-at">
                Last updated {{ deliverable.formattedUpdatedAt }}
              </div>

              <div class="deliverable-workflow-state">
                <span class="deliverable-workflow-state-bubble button no-uppercase" @click="toggleWorkflowState" v-if="deliverable.workflow_state">
                  <Loading v-if="!deliverable" />
                  {{ deliverable.state_name }}
                </span>
                <span class="deliverable-workflow-state-bubble button red no-uppercase" @click="toggleWorkflowState" v-else>
                  Set state
                </span>

                <div class="deliverable-workflow-state-popup popup right list" :id="'deliverable-workflow-state-' + deliverable.id" v-if="states">
                  <div v-for="state in states" :key="state[0]?.id" :class="deliverable.workflow_state == state[0]?.id ? 'active' : ''" @click="state[0] && onWorkflowStateSelect(deliverable.id, state[0].id, state[0].instance_name)">
                    {{ state[0]?.instance_name }}
                  </div>
                </div>
                
              </div>
              
              <div class="deliverable-calendar">
                <span class="deliverable-duedate button" @click="toggleCalendar" v-if="deliverable.formattedDueDate">Due {{ deliverable.formattedDueDate }}</span>
                <span class="deliverable-duedate button red" @click="toggleCalendar"v-else>Set due date</span>

                <div class="deliverable-calendar-popup popup right clean" :id="'deliverable-calendar-' + deliverable.id">
                  <VDatePicker :attributes="deliverable.attrs" v-model="deliverable.selectedDate" @update:modelValue="onDateSelect(deliverable.id, deliverable.selectedDate)" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  </AppPanel>
</template>

<script setup>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import ProjectOverview from '~/components/Projects/ProjectOverview.vue';
import ProjectDetails from '~/components/Projects/ProjectDetails.vue';
import DeliverablesProgress from '~/components/DeliverablesProgress.vue';
import { useRoute } from 'vue-router';
import { parseISO, format } from 'date-fns';
import AppPanel from '~/components/AppPanel.vue';

// Project composable
import useProject from '~/composables/useProject';
const { deleteProjectModal } = useProject();

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { createDeliverableModal } = useDeliverables();

// Client composable
import useClient from '~/composables/useClient';
const { fetchClient, ClientData } = useClient();

// State Instance composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, fetchStateInstanceName, StateInstanceData } = useWorkflowStateInstances();

const supabase = useSupabaseClient();
const loading = ref({
  global: true,
  deliverables: true
});

const attrs = ref([
  {
    key: 'today',
    highlight: {
      color: 'green',
      fillMode: 'solid'
    },
    dates: new Date()
  }
])

// Get the route object
const route = useRoute();

// Extract the project ID from the route parameters
const projectId = route.params.id;

// Fetch the project data from supabase
const project = ref(null);
const creator = ref(null);
const deliverables = ref([]);
const workflow = ref([]);
const states = ref([]);
const completedDeliverables = ref(0);

async function getProject(id) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    project.value = data;

    fetchClient(project.value.client_id);
    fetchDeliverables(project.value.id);
    fetchProjectWorkflow(project.value.workflow);
    fetchWorkflowStates(project.value.workflow);

  } catch (error) {
    console.error(error);
  }
}

// TODO - migrate to composable
async function fetchProjectWorkflow(workflowId) {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId);

    if (error) throw error;

    workflow.value = data;
  } catch (error) {
    console.error(error);
  }
}

// // TODO - migrate to composable
async function renderStateName(stateId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: `State ${stateId}` });
    }, 1000);
  });
}

// TODO - migrate to composable
async function fetchWorkflowStates(workflowId) {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('states')
      .eq('id', workflowId);

    // Fetch the states as an array of integers
    states.value = data[0].states;

    // Fetch the states as an array of objects from the states table
    states.value = await Promise.all(states.value.map(async state => {
      // return await fetchState(state);
      const fetchedState = await fetchSingleStateInstance(state);
      // console.log(fetchedState);
      return {
        ...fetchedState
      }
    }));

    if (error) throw error;

  } catch (error) {
    console.error(error);
  }
}

async function fetchDeliverables(projectId) {
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('project', projectId);

    if (error) {
      console.error('Error fetching deliverables:', error.message);
      return;
    }

    deliverables.value = data;

    // Fetch the state name for each deliverable
    await Promise.all(deliverables.value.map(async deliverable => {
      try {
        // Workflow state instance name
        const state_name = await fetchStateInstanceName(deliverable.workflow_state);
        deliverable.state_name = state_name[0].instance_name;
      } catch (error) {
        console.error('Error fetching state:', error.message);
      }

      // Due date
      const dueDate = parseISO(deliverable.due_date);
      
      if (isNaN(dueDate)) {
        console.error('Invalid date:', deliverable.due_date);
        return;
      }

      // Format the due date into something nicer
      deliverable.formattedDueDate = format(dueDate, 'MMMM do, yyyy');
      deliverable.formattedUpdatedAt = format(parseISO(deliverable.updated_at), 'MMMM do, yyyy');

      if (!deliverable.attrs) {
        deliverable.attrs = [];
      }
      deliverable.attrs.push({
        key: deliverable.id,
        highlight: {
          color: 'red',
          fillMode: 'solid'
        },
        dates: dueDate
      });
    }));

    loading.value.deliverables = false;
  } catch (error) {
    console.error('Error fetching deliverables:', error.message);
  }
}

function toggleCalendar(event) {
  const id = event.target.parentElement.querySelector('.deliverable-calendar-popup').id;
  const popup = document.getElementById(id);
  popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
}

const onDateSelect = async (deliverableId, newDate) => {
  await updateDeliverableDate(deliverableId, newDate);
  const popup = document.getElementById(`deliverable-calendar-${deliverableId}`);
  popup.style.display = 'none';

  // Get the date and update the deliverable
  const deliverable = deliverables.value.find(d => d.id === deliverableId);
  if (deliverable) {
    deliverable.due_date = newDate;
    deliverable.formattedDueDate = format(newDate, 'MMMM do, yyyy');
  }
  
};

const updateDeliverableDate = async (deliverableId, newDate) => {
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .update({ due_date: newDate })
      .eq('id', deliverableId);

    if (error) throw error;

    console.log('Deliverable updated:', data);
  } catch (error) {
    console.error('Error updating deliverable:', error.message);
  }
};

/**
 * WORKFLOW STATE
 */ 

function toggleWorkflowState(event) {
  const id = event.target.parentElement.querySelector('.deliverable-workflow-state-popup').id;
  const popup = document.getElementById(id);
  popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
}

const onWorkflowStateSelect = async (deliverableId, newWorkflowState, newStateName) => {
  await updateDeliverableWorkflowState(deliverableId, newWorkflowState);
  
  try {
    deliverables.value = deliverables.value.map(d => {
      if (d.id === deliverableId) {
        d.workflow_state = newWorkflowState;
        d.state_name = newStateName;
      }
      return d;
    });
  } catch (error) {
    console.error('Error fetching state:', error.message);
  }

  const popup = document.getElementById(`deliverable-workflow-state-${deliverableId}`);
  popup.style.display = 'none';

  // Get the date and update the deliverable
  const deliverable = deliverables.value.find(d => d.id === deliverableId);
  if (deliverable) {
    deliverable.workflow_state = newWorkflowState;
  }
  
};

// TODO - migrate this to the useWorkflow composable
const updateDeliverableWorkflowState = async (deliverableId, newWorkflowState) => {
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .update({ workflow_state: newWorkflowState })
      .eq('id', deliverableId);

    if (error) throw error;

    console.log('Deliverable updated:', data);
  } catch (error) {
    console.error('Error updating deliverable:', error.message);
  }
};

onMounted(async () => {
  // Register onUnmounted before any await statements
  const subscription = supabase
    .from('deliverables')
    .on('INSERT', payload => {
      console.log('New deliverable:', payload.new);
      deliverables.value.push(payload.new);
      // This is to update the dates after a new deliverable is added
      fetchDeliverables(projectId);
    })
    .subscribe();

  onUnmounted(() => {
    supabase.removeSubscription(subscription);
  });

  await getProject(projectId);
  await fetchDeliverables(projectId);

  loading.value.global = false;
});

watchEffect(() => {
  // TODO this is hard-coding the approved state for now
  completedDeliverables.value = deliverables.value.filter(d => d.workflow_state === 6).length;
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverables-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

.new-deliverable {
  display: flex;
  justify-content: flex-end;
  margin: $spacing-md $spacing-md 0 $spacing-md;
}

.no-deliverables {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: $gray;
}

.project-deliverables {
  padding: $spacing-sm;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: $white;
  height: 100%;

  .single-deliverable {
    padding: $spacing-sm;
    width: 100%;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border-radius: $br-md;

    .deliverable-details {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .deliverable-id {
        color: $gray-dark;
        font-size: $font-size-sm;
        padding-right: $spacing-sm;
        min-width: 44px;
      }

      .deliverable-title {
        color: $black;
        text-decoration: none;
        font-size: $font-size-sm;
      }
    }

    &:hover {
      background-color: rgba($brand, 0.05);
    }

    .deliverable-title {
      color: $black;
      text-decoration: none;
    }

    .deliverable-actions {
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      .deliverable-updated-at {
        color: $gray-dark;
        font-size: $font-size-xs;
      }

      .deliverable-workflow-state {
        position: relative;
        cursor: pointer;

        .deliverable-workflow-state-popup {
          position: absolute;
          top: calc(100% + 2px);
          right: 0;
          z-index: 1000;
          display: none;
        }
      }

      .deliverable-calendar {
        display: flex;
        position: relative;
      
        .deliverable-duedate {
          cursor: pointer;
        }
      }
    }
  }
}

</style>