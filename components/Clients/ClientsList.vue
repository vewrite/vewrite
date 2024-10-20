<template>
  <main id="Clients">
    <Loading v-if="loading" />

    <div class="search-bar">
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
    <div class="clients-list inner-container" v-if="!loading">
      <router-link :to="'/client/' + client.id" class="client-card" v-for="client in filteredClients" :key="client.id">
        <div class="image-wrapper">
          <ClientImage :client="client" size="medium" table="logos" />
        </div>
        <h3>{{ client.name }}</h3>
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
    padding: $spacing-sm;

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: $spacing-sm;
      text-decoration: none;
      width: 100%;
      padding: $spacing-xxs;
      border-radius: $br-md;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba($brand, 0.05);
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