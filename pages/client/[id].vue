<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/clients/" class="button">
        <Icon name="fluent:chevron-left-16-regular" size="1rem" />
        Back
      </router-link>
      <div class="app-panel-header-buttons">
        <Dropdown>
          <template v-slot:trigger>
            <svg width="2" height="10" viewBox="0 0 2 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1ZM2 5C2 5.55228 1.55228 6 1 6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4C1.55228 4 2 4.44772 2 5ZM1 10C1.55228 10 2 9.55229 2 9C2 8.44771 1.55228 8 1 8C0.447715 8 0 8.44771 0 9C0 9.55229 0.447715 10 1 10Z" fill="black"/>
            </svg>
          </template>
          <template v-slot:menu>
            <div class="dropdown-item" @click="deleteClientModal()">Delete client</div>
          </template>
        </Dropdown>
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <div class="object-overview" v-if="ClientData && !loading">
        <div class="object-summary">
          <input class="object-title-input" v-model="ClientData.name" @input="updateClientWithDebounce(ClientData.client_id, $event.target.value)" />
          <span>Click to edit</span>
        </div>
      </div>
      <div class="inner-container" v-if="ClientData && !loading">
        <div class="client-image" v-if="ClientData && !loading">
          <ClientImage :client="ClientData.client_id" size="large" table="logos" />
        </div>
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
}

</style>
