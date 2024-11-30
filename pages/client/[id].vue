<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/clients/" class="button">
        <Icon name="fluent:arrow-left-16-regular" size="1.5rem" />
        Back
      </router-link>
      <div class="app-panel-header-buttons">
        <Dropdown>
          <template v-slot:trigger>
            <Icon name="uis:ellipsis-v" size="1.15rem" />
          </template>
          <template v-slot:menu>
            <div class="dropdown-item" @click="deleteClientModal()">Delete client</div>
          </template>
        </Dropdown>
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <div class="client-image" v-if="ClientData && !loading">
        <ClientImage :client="ClientData.client_id" size="large" table="logos" />
      </div>
      <div class="object-overview" v-if="ClientData && !loading">
        <div class="object-summary">
          <input class="object-title-input" v-model="ClientData.name" @input="updateClientWithDebounce(ClientData.client_id, $event.target.value)" />
        </div>
      </div>
      <div class="inner-container" v-if="ClientData && !loading">
        <h3>Projects</h3>
        <div v-for="client in ClientProjects" :key="client.client_id">
          <div v-for="project in client.projects" :key="project.id">
            <nuxt-link :to="'/project/' + project.id">{{ project.name }}</nuxt-link>
          </div>
        </div>  
      </div>
      <!-- I want to show: 
      - Client name
      - Client image
      - Client projects -->
    </template>
  </AppPanel>
</template>

<script setup>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';

const supabase = useSupabaseClient();
const loading = ref(true);

// Get the route object
const route = useRoute();

// Extract the client ID from the route parameters
const clientId = route.params.id;

import useClient from '~/composables/useClient';
const { fetchClient, fetchProjectsFromSpecificClient, deleteClientModal, updateClient, ClientData, ClientProjects, ClientError } = useClient();

// Manual debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Debounced save function
const debouncedSaveClient = debounce(() => updateClient(ClientData.value), 1000);

// Update deliverable function
function updateClientWithDebounce() {
  debouncedSaveClient();
}

// Fetch the client data when the component is mounted
onMounted(async () => {
  try {
    await fetchClient(clientId);
    await fetchProjectsFromSpecificClient(clientId);
    loading.value = false;
  } catch (error) {
    console.error('Error fetching client:', error);
  }
});

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.client-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
