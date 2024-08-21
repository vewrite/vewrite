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
            <!-- <span class="deliverable-status">{{ deliverable.status }}</span> -->
            <div class="deliverable-calendar">
              <span class="deliverable-duedate button primary" @click="toggleCalendar">Due {{ deliverable.formattedDueDate }}</span>
              <div class="deliverable-calendar-popup" :id="'deliverable-calendar-' + deliverable.id">
                <VDatePicker :attributes="deliverable.attrs" />
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
const date = ref(null);

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
    console.log(deliverable.due_date);
    const dueDate = parseISO(deliverable.due_date);
    console.log('Due date:', dueDate);
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
  popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
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

    .deliverable-status {
      padding: $spacing-xxs $spacing-xs;
      background-color: $purple;
      color: $white;
      border-radius: $br-lg;
      font-size: $font-size-xs;
    }

    .deliverable-calendar {
      display: flex;
      position: relative;
    
      .deliverable-duedate {
        cursor: pointer;
      }

      .deliverable-calendar-popup {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 1000;
        display: none;
      }
    }
  }
}

</style>