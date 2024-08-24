<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/projects/" class="button dark">Back</router-link>
      <div class="app-panel-header" v-if="project">
        <Loading type="header" v-if="loading.global" />
      </div>
      <div class="app-panel-header-buttons">
        <!-- <router-link :to="`/project/${projectId}/edit`" class="button dark">Edit</router-link> -->
        <!-- <router-link :to="`/project/${projectId}/delete`" class="button dark">Delete</router-link> -->
      </div>
    </template>
    <template v-slot:body>
      <div class="deliverables-list">
        <Loading v-if="loading.global == true" />
        <ProjectOverview v-if="project && loading.global == false" :project="project" :deliverables="deliverables" :client="client" :creator="creator" />
      
        <!-- <div class="deliverables-workflow-preview">
          <h2>Workflow</h2>
          <div v-if="loading.global == false">
            <div v-for="state in states">
              <img :src="'/states/' + state.icon" />
              <div>{{ state.name }}</div>
            </div>
          </div>
        </div> -->

        <Loading v-if="loading.deliverables" />
        <div v-if="loading.deliverables == false && deliverables.length < 1">
          <p>No deliverables found for this project</p>
        </div>
        <div v-if="loading.deliverables == false" class="project-deliverables">
          <div class="single-deliverable" v-for="deliverable in deliverables">
            <router-link :to="'/deliverable/' + deliverable.id" class="deliverable-title">{{ deliverable.id }} - {{ deliverable.title }}</router-link>
            <div class="deliverable-actions">
              <div class="deliverable-workflow-state">
                <span class="deliverable-workflow-state-bubble button no-uppercase" @click="toggleWorkflowState">
                  <Loading v-if="!deliverable" />
                  {{ renderStateName(deliverable.workflow_state) }}
                </span>
                <div class="deliverable-workflow-state-popup popup right list" :id="'deliverable-workflow-state-' + deliverable.id">
                  <!-- <span v-for="state in workflow" class="deliverable-workflow-state-option" @click="updateWorkflowState(deliverable.id, state.id)">{{ state.name }}</span> -->
                    <div v-for="state in states" :class="deliverable.workflow_state == state.id ? 'active' : ''" @click="onWorkflowStateSelect(deliverable.id, state.id)">
                      {{ state.name }}
                    </div>
                </div>
              </div>
              
              <div class="deliverable-calendar">
                <span class="deliverable-duedate button primary no-uppercase" @click="toggleCalendar">Due {{ deliverable.formattedDueDate }}</span>
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

import ProjectOverview from '~/components/Projects/ProjectOverview.vue';
import { useRoute } from 'vue-router';
import { parseISO, format } from 'date-fns';
import AppPanel from '~/components/AppPanel.vue';

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
const client = ref(null);
const deliverables = ref([]);
const workflow = ref([]);
const states = ref([]);

async function getProject(id) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    project.value = data;

    // fetchCreator(project.value.created_by);
    fetchClient(project.value.client);
    fetchDeliverables(project.value.id);
    fetchProjectWorkflow(project.value.workflow);
    fetchWorkflowStates(project.value.workflow);
    
    // 1. fetch the project
    // 2. fetch the workflow from the project
    // 3. fetch the states from the workflow states (array of states)


  } catch (error) {
    alert(error.message);
  }
}

async function fetchCreator(uuid) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', uuid)
      .single();

    if (error) throw error;

    creator.value = data;
  } catch (error) {
    alert(error.message);
  }
}

async function fetchProjectWorkflow(workflowId) {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId);

    if (error) throw error;

    workflow.value = data;
  } catch (error) {
    alert(error.message);
  }
}

function renderStateName(stateId) {
  const state = states.value.find(s => s.id === stateId);
  return state ? state.name : '';
}

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
      const fetchedState = await fetchState(state);
      console.log(fetchedState);
      return {
        ...fetchedState
      }
    }));

    if (error) throw error;

  } catch (error) {
    alert(error.message);
  }
}

async function fetchState(stateId) {
  try {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .eq('id', stateId);

    if (error) throw error;

    return data[0];
  } catch (error) {
    alert(error.message);
  }
}

async function fetchDeliverables(projectId) {
  console.log("Fetching deliverables for project: ", projectId);

  const { data, error } = await supabase
    .from('deliverables')
    .select('*')
    .eq('project', projectId);

  if (error) {
    console.error('Error fetching deliverables:', error.message);
    return;
  }

  deliverables.value = data;

  // Update attrs with deliverables' duedate
  deliverables.value.forEach(deliverable => {
    // console.log(deliverable.due_date);
    const dueDate = parseISO(deliverable.due_date);
    // console.log('Due date:', dueDate);
    if (isNaN(dueDate)) {
      console.error('Invalid date:', deliverable.due_date);
      return;
    }

    // Format the due date into something nicer
    deliverable.formattedDueDate = format(dueDate, 'MMMM do, yyyy');

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
  });

  loading.value.deliverables = false;
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

const onWorkflowStateSelect = async (deliverableId, newWorkflowState) => {
  await updateDeliverableWorkflowState(deliverableId, newWorkflowState);
  const popup = document.getElementById(`deliverable-workflow-state-${deliverableId}`);
  popup.style.display = 'none';

  // Get the date and update the deliverable
  const deliverable = deliverables.value.find(d => d.id === deliverableId);
  if (deliverable) {
    deliverable.workflow_state = newWorkflowState;
  }
  
};

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

/**
 * CLIENT
 */

async function fetchClient(clientId) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)

  if (error) {
    console.error('Error fetching clients:', error.message)
    return
  }

  // add the clients to the clients ref
  client.value = data[0]

  loading.value.global = false
}

// Fetch the project data when the component is mounted
onMounted(() => {
  getProject(projectId);
  loading.value.global = false;
});

</script>

<style lang="scss" scoped>

@import "./assets/_variables.scss";

.deliverables-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

.project-deliverables {
  margin: $spacing-md;

  .single-deliverable {
    padding: $spacing-sm;
    border-bottom: 1px solid $gray;
    width: 100%;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;


    &:hover {
      background-color: rgba($purple, 0.05);
    }

    .deliverable-title {
      color: $black;
      text-decoration: none;
    }

    .deliverable-actions {
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      .deliverable-workflow-state {
        position: relative;
        cursor: pointer;

        .deliverable-workflow-state-bubble {
          color: $purple;
        }

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