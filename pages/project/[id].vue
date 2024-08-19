<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/projects/" class="button dark">Back</router-link>
      <div class="app-panel-header" v-if="project">
        <Loading type="header" v-if="loading" />
        <span v-else>{{ project.name }}</span>
      </div>
      <div class="app-panel-header-buttons">
        <router-link :to="`/project/${projectId}/edit`" class="button dark">Edit</router-link>
        <router-link :to="`/project/${projectId}/delete`" class="button dark">Delete</router-link>
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <ProjectOverview v-if="project && !loading" :project="project" :deliverables="deliverables" :client="client" :creator="creator" />
      <!-- :creator="creator" :client="client" -->
      <!-- <div class="inner-container" v-if="project && !loading">
        <div class="form-block">
          <div class="form-details">
            <h3>Overview</h3>
            <p>Just a quick list of all available details</p>
          </div>
          <div class="form-content">
            <table>
              <tr>
                <td>Name</td>
                <td>{{ project.name }}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{{ project.description }}</td>
              </tr>
              <tr>
                <td>Created at</td>
                <td>{{ new Date(project.created_at).toLocaleString() }}</td>
              </tr>
              <tr>
                <td>Updated at</td>
                <td>{{ new Date(project.updated_at).toLocaleString() }}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="form-block" v-if="creator && !loading">
          <div class="form-details">
            <h3>Creator</h3>
            <p>Who made this?</p>
          </div>
          <div class="form-content">
            <p>{{ creator.username }}</p>
          </div>
        </div>

        <div class="form-block" v-if="creator && !loading">
          <div class="form-details">
            <h3>Deliverables</h3>
          </div>
          <div class="form-content">
            <div v-for="deliverable in deliverables">
              {{ deliverable.id }}
            </div>
          </div>
        </div>

        <div class="form-block" v-if="client && !loading">
          <div class="form-details">
            <h3>Client</h3>
            <p>Who is this for?</p>
          </div>
          <div class="form-content">
            <p>{{ client }}</p>
          </div>
        </div>
      </div> -->
    </template>
  </AppPanel>
</template>

<script setup>

import ProjectOverview from '~/components/Projects/ProjectOverview.vue';
import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';

const supabase = useSupabaseClient();
const loading = ref(true);

// Get the route object
const route = useRoute();

// Extract the project ID from the route parameters
const projectId = route.params.id;

// Fetch the project data from supabase
const project = ref(null);
const creator = ref(null);
const client = ref(null);
const deliverables = ref(null);

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

  const { data, error } = await supabase
    .from('deliverables')
    .select('*')
    .eq('project', projectId)

  deliverables.value = data;

  if (error) {
    console.error('Error fetching deliverables:', error.message)
    return
  }

  return data
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
  client.value = data

  // Add the clients to the clients ref
  client.value = await Promise.all(data.map(async client => {
    const logoBlob = await downloadImage(client.logo_url);
    return {
      ...client,
      logo_url: URL.createObjectURL(logoBlob)
    };
  }));

  loading.value = false
}

const downloadImage = async (path) => {
  try {
    const { data, error } = await supabase.storage
          .from('logos')
          .download(path)
      if (error) throw error
      // console.log(data)
      return data
  } catch (error) {
      console.error("Error downloading image: ", error.message)
  }
}

// Fetch the project data when the component is mounted
onMounted(() => {
  getProject(projectId);
  loading.value = false;
});

watch(path, () => {
    if (path.value) {
        downloadImage()
    }
})

</script>

<style scoped>
/* Your styles here */
</style>