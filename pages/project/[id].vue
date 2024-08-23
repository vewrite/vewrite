<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/projects/" class="button dark">Back</router-link>
      <div class="app-panel-header" v-if="project">
        <Loading type="header" v-if="loading" />
        <!-- <span v-else>{{ project.name }}</span> -->
      </div>
      <div class="app-panel-header-buttons">
        <router-link :to="`/project/${projectId}/edit`" class="button dark">Edit</router-link>
        <router-link :to="`/project/${projectId}/delete`" class="button dark">Delete</router-link>
      </div>
    </template>
    <template v-slot:body>
      <div class="deliverables-list">
        <Loading v-if="loading" />
        <ProjectOverview v-if="project && !loading" :project="project" :deliverables="deliverables" :client="client" :creator="creator" />
        <!-- <DeliverablesProgress v-if="deliverables" :deliverables="deliverables" /> -->

      
        <Loading v-if="loadingDeliverables" />
        <div v-if="!loadingDeliverables && deliverables.length < 1">
          <p>No deliverables found for this project</p>
        </div>
        <div v-if="!loadingDeliverables" class="project-deliverables">
          <div class="single-deliverable" v-for="deliverable in deliverables">
            <router-link :to="'/deliverable/' + deliverable.id" class="deliverable-title">{{ deliverable.id }} - {{ deliverable.title }}</router-link>
            <div class="deliverable-actions">
              <div class="deliverable-status">
                <span class="deliverable-status-bubble button primary no-uppercase" @click="toggleStatus">{{ deliverable.status }}</span>
                <div class="deliverable-status-popup popup right list" :id="'deliverable-status-' + deliverable.id">
                  <span v-for="status in workflow" class="deliverable-status-option" @click="updateStatus(deliverable.id, status.id)">{{ status.name }}</span>
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
const loading = ref(true);
const loadingDeliverables = ref(true);
const selectedDate = ref(null);
const workflow = ref([
  { id: 1, name: 'Not Started' },
  { id: 2, name: 'In Progress' },
  { id: 3, name: 'Completed' }
]);

const onDateSelect = (deliverableId, newDate) => {
  console.log('Selected date:', deliverableId, newDate);
  // Update the database
  // loading.value = true;

  // Toggle the calendar popup
  const popup = document.getElementById(`deliverable-calendar-${deliverableId}`);
  popup.style.display = 'none';
  
};

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

const path = ref("")

async function getProject(id) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    project.value = data;

    // Cool, now go get the creator data
    fetchCreator(project.value.created_by);
    fetchClient(project.value.client);
    fetchDeliverables(project.value.id);

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

  loadingDeliverables.value = false;
}

function toggleCalendar(event) {
  const id = event.target.parentElement.querySelector('.deliverable-calendar-popup').id;
  const popup = document.getElementById(id);
  popup.style.visibility = popup.style.visibility === 'visible' ? 'hidden' : 'visible';
}

function onDateSelected(deliverableId, selectedDate) {
  console.log(`Date selected for deliverable ${deliverableId}:`, selectedDate);
  const deliverable = deliverables.value.find(d => d.id === deliverableId);
  if (deliverable) {
    deliverable.due_date = selectedDate;
    deliverable.formattedDueDate = format(selectedDate, 'MMMM do, yyyy');
    // Optionally, you can update the deliverable in the database here
  }
}

function toggleStatus(event) {
  const id = event.target.parentElement.querySelector('.deliverable-status-popup').id;
  const popup = document.getElementById(id);
  popup.style.visibility = popup.style.visibility === 'visible' ? 'hidden' : 'visible';
}

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

  loading.value = false
}

// Fetch the project data when the component is mounted
onMounted(() => {
  getProject(projectId);
  loading.value = false;
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

      .deliverable-status {
        position: relative;
        cursor: pointer;

        .deliverable-status-bubble {
          background-color: $gray;
        }

        .deliverable-status-popup {
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