<template>
  <AppPanel>
    <template v-slot:header>
      <router-link :to="'/project/' + projectId" class="button dark">Back</router-link>
      <div class="app-panel-header" v-if="project">
        <Loading type="header" v-if="loading" />
      </div>
      <div class="app-panel-header-buttons">
        <!-- <router-link :to="`/project/${projectId}/edit`" class="button dark">Edit</router-link> -->
        <!-- <router-link :to="`/project/${projectId}/delete`" class="button dark">Delete</router-link> -->
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <div v-if="deliverable && !loading">
        {{ deliverable.id }}
      </div>
    </template>
  </AppPanel>
</template>

<script setup>

import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';

const supabase = useSupabaseClient();
const loading = ref(true);
const projectId = ref(null);

// Get the route object
const route = useRoute();

// Extract the deliverable ID from the route parameters
const deliverableId = route.params.id;

// Fetch the project data from supabase
const deliverable = ref(null);

async function getDeliverable(id) {
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    deliverable.value = data;

    projectId.value = data.project;

    console.log(data);

  } catch (error) {
    alert(error.message);
  }
}

// Fetch the deliverable data when the component is mounted
onMounted(() => {
  getDeliverable(deliverableId);
  loading.value = false;
});

</script>

<style scoped>
/* Your styles here */
</style>