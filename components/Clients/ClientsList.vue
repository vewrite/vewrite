<template>
  <main id="Clients">
    <!-- <Loading v-if="loading" /> -->
    <div class="empty-state" v-if="clients.length === 0 && !loading">
      <img src="/images/clients-empty-state.svg" alt="No clients found" />
      <h3>You haven’t created a client yet</h3>
      <p>That’s ok, It’s easy and we’ll do it together</p>
      <router-link to="clients/create" class="button primary">Create a client</router-link>
    </div>
    <div class="clients-list" v-else>
      <router-link :to="'/client/' + client.id" class="client-card" v-for="client in clients" :key="client.id">
        <h3>{{ client.name }}</h3>
      </router-link>
    </div>
  </main>
</template>

<script setup>

import { onMounted, ref } from 'vue'

const clients = ref([]);

// Fetch clients
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)

async function fetchClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('created_by', user.value.id)

  if (error) {
    console.error('Error fetching clients:', error.message)
    return
  }

  clients.value = data
  loading.value = false
}

onMounted(() => {
  fetchClients()
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#Clients {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: $spacing-lg;

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
}

</style>