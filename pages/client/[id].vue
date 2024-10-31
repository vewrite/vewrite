<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/clients/" class="button primary">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.35356 1.35355C5.54882 1.15829 5.54882 0.841705 5.35356 0.646443C5.1583 0.451181 4.84172 0.451181 4.64645 0.646443L1.35356 3.93934C0.767773 4.52512 0.767774 5.47487 1.35356 6.06066L4.64645 9.35355C4.84172 9.54881 5.1583 9.54881 5.35356 9.35355C5.54882 9.15829 5.54882 8.84171 5.35356 8.64644L2.20711 5.5L11.5 5.5C11.7761 5.5 12 5.27614 12 5C12 4.72385 11.7761 4.5 11.5 4.5L2.20711 4.5L5.35356 1.35355Z" fill="black"/>
        </svg>
        Back
      </router-link>
      <div class="app-panel-header" v-if="client">
        <Loading type="header" v-if="loading" />
        <span v-else>{{ client.name }}</span>
      </div>
      <div class="app-panel-header-buttons">
        <button class="button primary" @click="edit">Edit</button>
        <!-- <router-link :to="`/client/${clientId}/delete`" class="button primary">Delete</router-link> -->
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <div class="inner-container" v-if="client && !loading">
        <div class="form-block">
          <div class="form-details">
            <h3>Overview</h3>
            <p>Just a quick list of all available details</p>
          </div>
          <div class="form-content">
            <table>
              <tr>
                <td>Name</td>
                <td>{{ client.name }}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{{ client.description }}</td>
              </tr>
              <tr>
                <td>Created at</td>
                <td>{{ new Date(client.created_at).toLocaleString() }}</td>
              </tr>
              <tr>
                <td>Updated at</td>
                <td>{{ new Date(client.updated_at).toLocaleString() }}</td>
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
      </div>
    </template>
  </AppPanel>
</template>

<script setup>
import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';

const supabase = useSupabaseClient();
const loading = ref(true);

// Get the route object
const route = useRoute();

// Extract the client ID from the route parameters
const clientId = route.params.id;

// Fetch the client data from supabase
const client = ref(null);
const creator = ref(null);

// Modal
import { useModal } from '~/stores/modal';
const modal = useModal();

async function getclient(id) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    client.value = data;

    // Cool, now go get the creator data
    getCreator(client.value.created_by);

  } catch (error) {
    console.error(error);
  }
}

async function getCreator(uuid) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', uuid)
      .single();

    if (error) throw error;

    creator.value = data;
  } catch (error) {
    console.error(error);
  }
}

const edit = () => {
  modal.visible = 1;
};

// Fetch the client data when the component is mounted
onMounted(() => {
  getclient(clientId);
  loading.value = false;
});

</script>

<style scoped>
/* Your styles here */
</style>