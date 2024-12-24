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
      <section class="single-client">
        <div class="client-image" v-if="ClientData && !loading">
          <ClientImage :client="ClientData.client_id" size="large" table="logos" />
        </div>
        <div class="object-overview" v-if="ClientData && !loading">
          <div class="object-summary">
            <input class="object-title-input" v-model="ClientData.name" @input="updateClientWithDebounce(ClientData.client_id, $event.target.value)" />
          </div>
        </div>
        <section class="client-project-list" v-if="ClientData && !loading">
          <div v-for="client in ClientProjects" :key="client.client_id">
            <div v-for="project in client.projects" :key="project.id">
              <router-link :to="'/project/' + project.id" class="project-card">
                <div class="project-card-header">
                  <div class="project-card-details">
                    <h3>{{ project.name }}</h3>
                  </div>
                </div>
              </router-link>
            </div>
          </div>  
        </section>
      </section>
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

@keyframes cardAppear {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.client-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.single-client {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  .client-image {
    margin-top: $spacing-md;
  }

  .object-overview {
    margin-bottom: $spacing-sm;

    .object-summary {
      input {
        text-align: center;
      }
    }
  }
}

.client-project-list {
  padding: $spacing-md;
  border-top: $border;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: $spacing-sm;
  width: 100%;
  padding: $spacing-sm;
  align-content: flex-start;

  @media (max-width: 1800px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .project-card {
    padding: $spacing-md;
    background: $white;
    border-radius: $br-lg;
    border: $border;
    text-decoration: none;
    color: $black;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    justify-content: space-between;
    transition: border, transform 0.18s ease;
    animation: cardAppear 0.2s ease;
    animation-fill-mode: forwards;
    animation-delay: 0s;
    opacity: 0;
    transform: scale(0.9);

    &.completed {
      background: $white linear-gradient(to bottom, $white 70%, rgba($mint, 0.25) 90%, rgba($mint, 0.1) 100%);
    }

    $project-cards: ();

    @for $i from 0 through 60 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * .1}s;
      }
    }

    &:hover {
      border: 1px solid rgba($brand, 1);
      transform: scale(1.05);
    }

    .project-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: column;

      .project-card-details {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        gap: $spacing-sm;
      }

      h3 {
        margin: 0;
      }

    }

    h3 {
      font-size: $font-size-xs;
      font-family: $font-family-main;
      font-weight: bold;
      margin: 0 0 $spacing-sm;
      
      a {
        color: $brand;
        text-decoration: none;
      }
    }

    p {
      font-size: $font-size-xs;
      font-weight: 400;
      color: $gray-dark;
    }

    .project-card-buttons {
      opacity: 0;
      transition: bottom 0.2s ease;
      z-index: 10;
      position: absolute;
      bottom: -80px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: flex-end;
      gap: $spacing-xs;
      padding: $spacing-sm $spacing-md;
      background-color: $brand;
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba($black, 0.1);
      border-radius: $br-lg $br-lg 0 0;

      a, button {
        width: 50%;
        justify-content: center;
      }
    }

    .project-deliverables-status {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      position: absolute;
      bottom: $spacing-md;
      width: calc(100% - #{$spacing-md * 2});
      transition: bottom 0.2s ease;

      .progress-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-xs;
        width: 100%;

        span {
          font-size: $font-size-xs;
          font-weight: 400;
          color: rgba($black, 0.5);
        }
      }

      .progress-content {
        width: 100%;

        .progress-bar {
          width: 100%;
          padding: 2px;
          min-height: 10px;
          border-radius: $br-md;
          background-color: $white;
          border: $border;

          .progress {
            height: 6px;
            border-radius: $br-md;
            background: linear-gradient(to right, $mint, $mint 80%, $brand 100%);

            &.completed {
              background: $mint;
            }
          }

        }
      }
    }
  }
}

</style>
