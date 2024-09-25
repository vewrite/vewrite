<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/clients/" class="button primary">Back</router-link>
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
    alert(error.message);
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
    alert(error.message);
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