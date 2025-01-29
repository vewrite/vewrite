<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="projectId && !loading" :to="'/project/' + projectId" class="button">
        <Icon name="fluent:arrow-left-16-regular" size="1.5rem" />
      </router-link>
      <ObjectOverview v-if="DeliverableData && !loading" :deliverable="DeliverableData" />
      <div class="app-panel-header-buttons" v-if="DeliverableData && !loading">
        <Dropdown>
          <template v-slot:trigger>
            <Icon name="uis:ellipsis-v" size="1.15rem" />
          </template>
          <template v-slot:menu>
            <div class="dropdown-item" @click="deleteDeliverableModal()">Delete deliverable</div>
          </template>
        </Dropdown>
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" type="small" />
      <section class="deliverables" v-if="!loading">
        <DocumentManager v-if="DeliverableData" :DeliverableData="DeliverableData" :StateData="StateData" />
        <!-- <section class="state-bar">
          <StateBar v-if="StateData" :StateData="StateData" />
        </section> -->
      </section>
      
    </template>
  </AppPanel>
</template>

<script setup>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';
import DocumentManager from '~/components/Deliverables/DocumentManager.vue';

const loading = ref(true);
const projectId = ref(null);
const route = useRoute();
const deliverableId = route.params.id;
const StateData = ref(null);

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance } = useWorkflowStateInstances();

import useDeliverables from '~/composables/useDeliverables';
const { fetchDeliverable, deleteDeliverableModal, DeliverableData, DeliverableError } = useDeliverables();

import { useDeliverableStore } from '~/stores/deliverable';
const deliverableStore = useDeliverableStore();

// In the parent (this), I need to get the deliverable state and pass it to the children (DocumentManager -> StateBar)
// I also need to set it in the store
async function init() {
  loading.value = true;
  
  try {
    await fetchDeliverable(deliverableId);
    projectId.value = DeliverableData.value.project;
    StateData.value = await fetchSingleStateInstance(DeliverableData.value.workflow_state);

    // Set the deliverable state in the store
    deliverableStore.setDeliverableState(deliverableId, DeliverableData.value.workflow_state);

    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

onMounted(() => {
 init();
});

// Now, I need to watch the store and see if the workflow state changes
// If it does, I need to update DeliverableData.workflow_state so that the child components can react to it
watch(() => deliverableStore.getStateInstanceId(), (newValue) => {
  console.log('Deliverable state changed:', newValue);
  // DeliverableData.value.workflow_state = newValue;
  init();
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverables {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  height: 100%;
  padding: $spacing-sm;
  position: relative;

  .state-bar {
    position: sticky;
    bottom: 0;
    width: 100%;
    z-index: 1;
  }
}

</style>
