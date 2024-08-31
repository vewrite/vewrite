<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="deliverable && !loading" :to="'/project/' + projectId" class="button dark">Back</router-link>
      <div class="app-panel-header-buttons">
        <!-- <router-link :to="`/project/${projectId}/edit`" class="button dark">Edit</router-link> -->
        <span class="button dark" @click="deleteDeliverable(deliverable.id, projectId)">Delete</span>
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <aside class="deliverable-overview" v-if="deliverable && !loading">
        <div class="deliverable-summary">
          <input class="deliverable-title-input" v-model="deliverable.title" @input="updateDeliverableTitle(deliverable.id, $event.target.value)" />
          <input class="deliverable-title-description" v-model="deliverable.description" @input="updateDeliverableDescription(deliverable.id, $event.target.value)" />
        </div>
      </aside>
      <div class="deliverable-editor" v-if="deliverable && !loading">
        <Toolbar :textareaRef="$refs.textareaRef" />
        <textarea 
          ref="textareaRef" 
          v-if="deliverable.markdown !== ''" 
          v-model="deliverable.markdown" 
          @input="updateDeliverable" 
        />
      </div>
    </template>
  </AppPanel>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';
import Toolbar from '~/components/Toolbar.vue';

const supabase = useSupabaseClient();
const loading = ref(true);
const projectId = ref(null);
const textareaRef = ref(null);

// Get the route object
const route = useRoute();

// Extract the deliverable ID from the route parameters
const deliverableId = route.params.id;

// Fetch the project data from supabase
const deliverable = ref(null);

// useDeliverable composable
import useDeliverables from '~/composables/useDeliverables';
const { saveDeliverable, deleteDeliverable, updateDeliverableTitle, updateDeliverableDescription } = useDeliverables();

async function getDeliverable(id) {
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if(data.description === null) {
      data.description = 'No description provided';
    }

    deliverable.value = data;

    projectId.value = data.project;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

// Manual debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}



// Debounced save function
const debouncedSaveDeliverable = debounce(() => saveDeliverable(deliverable.value), 1000);

// Update deliverable function
function updateDeliverable() {
  debouncedSaveDeliverable();
}

// Fetch the deliverable data when the component is mounted
onMounted(async () => {
  await getDeliverable(deliverableId);
});

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.deliverable-overview {
  width: calc(100%);
  padding: $spacing-md;
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
    gap: 2px;
    width: 100%;

    .deliverable-title-input {
      font-family: $font-family-secondary;
      font-size: $font-size-lg;
      font-weight: 500;
      margin: 0;
      background-color: transparent;
      width: 100%;
      padding: $spacing-xs;

      &:focus,
      &:active {
        border: 1px solid $purple;
        background: $white;
      }
    }

    .deliverable-title-description {
      font-family: $font-family-main;
      font-size: $font-size-sm;
      color: $gray-dark;
      font-weight: 400;
      margin: 0;
      background-color: transparent;
      width: 100%;
      padding: $spacing-xs;

      &:focus,
      &:active {
        border: 1px solid $purple;
        background: $white;
        color: $black;
      }
    }

    p {
      font-size: $font-size-sm;
      font-weight: 400;
      margin: 0;
    }
  }
}

.deliverable-editor {
  width: 100%;
  height: calc(100% - 100px);
  padding: $spacing-md;
  background-color: $white;
  border-radius: $br-md;

  textarea {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    font-size: $font-size-md;
    padding: 0;
  }
}


</style>