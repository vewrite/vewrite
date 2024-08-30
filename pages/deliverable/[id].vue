<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="deliverable && !loading" :to="'/project/' + projectId" class="button dark">Back</router-link>
      <div class="app-panel-header-buttons">
        <!-- <router-link :to="`/project/${projectId}/edit`" class="button dark">Edit</router-link> -->
        <!-- <router-link :to="`/project/${projectId}/delete`" class="button dark">Delete</router-link> -->
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <aside class="deliverable-overview" v-if="deliverable && !loading">
        <div class="deliverable-summary">
          <h2>{{ deliverable.title }}</h2>
          <p>{{ deliverable.description }}</p>
        </div>
      </aside>
      <div v-if="!loading" v-html="deliverable.markdown"></div>
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

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.deliverable-overview {
  width: calc(100%);
  padding: $spacing-md $spacing-md 0 $spacing-md;
  background-color: rgba($gray, 0.15);
  border-radius: $br-md;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-md;

  .deliverable-summary {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    h2 {
      font-family: $font-family-secondary;
      font-weight: 500;
      margin: 0;
    }

    p {
      font-size: $font-size-sm;
      font-weight: 400;
      margin: 0;
    }
  }
}


</style>