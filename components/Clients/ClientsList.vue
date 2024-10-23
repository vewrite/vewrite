<template>
  <main id="Clients">
    <Loading v-if="loading" />

    <div class="search-bar" v-if="!loading">
      <input type="text" placeholder="Search clients" v-model="searchQuery" />
    </div>

    <!-- Empty state -->
    <div class="empty-state" v-if="clientsData && clientsData.length === 0 && !loading">
      <img src="/images/clients-empty-state.svg" alt="No clients found" />
      <h3>You haven’t created a client yet</h3>
      <p>That’s ok, It’s easy and we’ll do it together</p>
      <!-- <router-link to="clients/create" class="button primary">Create a client</router-link> -->
      <div class="button primary" @click="createClientModal()">Create a client</div>
    </div>

    <!-- Client list -->
    <div class="clients-list inner-container" v-if="!loading && clientsData.length > 0">
      <router-link :to="'/client/' + client.id" class="client-card max-width sm" v-for="client in filteredClients" :key="client.id">
        <div class="client-info">
          <div class="image-wrapper">
            <ClientImage :client="client" size="medium" table="logos" />
          </div>
          <h3>{{ client.name }}</h3>
        </div>
        <div class="clients-projects">
          <span v-if="client.projects">{{ client.projects.length }} projects</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="15" y1="8" x2="19" y2="12" />
            <line x1="15" y1="16" x2="19" y2="12" />
          </svg>
        </div>
      </router-link>
    </div>
  </main>
</template>

<script setup>

import { onMounted, ref } from 'vue'

// Fetch clients
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const clients = ref([])
const test = ref([])
const loading = ref(true)
const searchQuery = ref('')

// Client composable
import useClient from '~/composables/useClient';
const { fetchClients, clientsData, createClientModal } = useClient();

onMounted(async () => {
  try {

    const subscription = supabase
      .from('clients')
      .on('INSERT', payload => {
        console.log('New client:', payload.new);
        const newClient = { ...payload.new, projects: [] }; // Add empty projects array
        clients.value.push(newClient);
        fetchClients(user.value.id);
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeSubscription(subscription);
    });

    await fetchClients(user.value.id)
  } catch (error) {
    console.error('Failed to fetch clients:', error)
  } finally {
    loading.value = false
  }
  
})

const filteredClients = computed(() => {
  if (!searchQuery.value) {
    return clientsData.value
  }
  return clientsData.value.filter(client =>
    client.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#Clients {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    img {
      width: 200px;
    }

    h3 {
      font-size: $font-size-lg;
      font-family: $font-family-secondary;
      font-weight: 500;
      margin: $spacing-md 0 0;
    }

    p {
      font-size: $font-size-sm;
      font-weight: 400;
      margin: $spacing-sm 0 $spacing-md;
      color: $gray-dark;
    }

  }

  .clients-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    align-items: flex-start;
    width: 100%;
    overflow-y: auto;
    background-color: $white;
    height: calc(100% - 60px);
    padding: $spacing-md $spacing-sm;

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-sm;
      text-decoration: none;
      width: 100%;
      padding: $spacing-xxs;
      border-radius: $br-lg;
      transition: all 0.2s ease;
      border: 1px solid $gray-light;

      &:hover {
        border: 1px solid $brand;
      }

      .image-wrapper {
        border-radius: $br-md;
        overflow: hidden;
        background-color: $gray-light;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: auto;
          height: 100%;
        }

      }

      .client-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-sm;
      }

      .clients-projects {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: $font-size-sm;
        font-weight: 400;
        color: $gray-dark;

        svg {
          fill: $gray-dark;
          margin-right: $spacing-sm;
        }
      }
      
      h3 {
        font-size: $font-size-md;
        font-family: $font-family-main;
        font-weight: 500;
        color: $black;
        margin: 0;
      }
    }
  }
}

</style>