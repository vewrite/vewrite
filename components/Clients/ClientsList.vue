<template>
  <main id="Clients">
    <Loading v-if="loading" />

    <!-- Empty state -->
    <div class="empty-state" v-if="clients.length === 0 && !loading">
      <img src="/images/clients-empty-state.svg" alt="No clients found" />
      <h3>You haven’t created a client yet</h3>
      <p>That’s ok, It’s easy and we’ll do it together</p>
      <router-link to="clients/create" class="button primary">Create a client</router-link>
    </div>

    <!-- Client list -->
    <div class="clients-list inner-container" v-if="!loading">
      <router-link :to="'/client/' + client.id" class="client-card" v-for="client in clients" :key="client.id">
        <div class="image-wrapper">
          <img :src="client.logo_url" alt="Client avatar" />
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

  // add the clients to the clients ref
  clients.value = data

  // Add the clients to the clients ref
  clients.value = await Promise.all(data.map(async client => {
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

  .clients-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    align-items: flex-start;
    width: 100%;

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: $spacing-md;
      text-decoration: none;
      width: 100%;
      border: 1px solid transparent;
      background-color: $white;
      padding: $spacing-xxs;
      border-radius: $br-md;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba($purple, 0.1);
        border-color: $purple;
      }

      .image-wrapper {
        width: 80px;
        min-height: 54px;
        height: 54px;
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
        font-size: $font-size-lg;
        font-family: $font-family-secondary;
        font-weight: 500;
        color: $black;
        margin: 0;
      }
    }
  }
}

</style>