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

const supabase = useSupabaseClient();
const user = supabase.auth.user();
const loading = ref(true);
const projectId = ref(null);
const route = useRoute();
const deliverableId = route.params.id;
const StateData = ref(null);

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance } = useWorkflowStateInstances();

import useDeliverables from '~/composables/useDeliverables';
const { fetchDeliverable, deleteDeliverableModal, DeliverableData, DeliverableError } = useDeliverables();

// Set the basics
async function init() {
 loading.value = true;
 try {
   await fetchDeliverable(deliverableId);
   projectId.value = DeliverableData.value.project;
   StateData.value = await fetchSingleStateInstance(DeliverableData.value.workflow_state);
   loading.value = false;
 } catch (error) {
   console.error(error);
 }
}

onMounted(() => {
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
}

</style>
