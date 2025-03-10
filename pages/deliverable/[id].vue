<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="projectId && !loading" :to="'/project/' + projectId" class="button">
        <Icon name="fluent:arrow-left-16-regular" size="1.5rem" />
      </router-link>
      <ObjectOverview v-if="DeliverableData && !loading" :deliverable="DeliverableData" />
      <div class="app-panel-header-buttons" v-if="DeliverableData && !loading">
        <button class="button" @click="toggleFullscreen()">
          <Icon name="fluent:full-screen-maximize-20-regular" size="1.5rem" />
        </button>
        <button class="button" @click="changeAssignmentsModal()" v-if="isOwner">
          <Icon name="fluent-mdl2:user-sync" size="1.5rem" />
        </button>
        <div class="vertical-divider"></div>
        <StateBar v-if="StateData" :StateData="StateData" :DeliverableData="DeliverableData" />
        <div class="vertical-divider"></div>
        <Dropdown v-if="personaState == 'manager' || isOwner">
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
      <section class="deliverables" v-if="!loading && hasAccess" :class="{ 'fullscreen': fullscreen }">
        <section class="fullscreen-bar" v-if="fullscreen">
          <button class="button" @click="toggleFullscreen()">
            <Icon name="fluent-mdl2:chrome-close" size="1rem" />
          </button>
        </section>  
        <LinkManager v-if="DeliverableData && DeliverableData.content.type == 'link'" :DeliverableData="DeliverableData" :StateData="StateData" />
        <DocumentManager v-if="DeliverableData && DeliverableData.content.type == 'content'" :DeliverableData="DeliverableData" :StateData="StateData" />
      </section>
      <section v-else-if="loading.global == false && !hasAccess" class="project-gate">
        <div class="project-details">
          <p>You do not have access to this project</p>
        </div>
      </section>
    </template>
  </AppPanel>
</template>

<script setup>

import StateBar from '~/components/Deliverables/StateBar.vue';

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'deliverable', 'project'],
});

// Pull personaState from the middleware auth.js
const personaState = useState('personaState');

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';
import DocumentManager from '~/components/Deliverables/DocumentManager.vue';
import LinkManager from '~/components/Deliverables/LinkManager.vue';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const loading = ref(true);
const project = ref(null);
const projectId = ref(null);
const route = useRoute();
const deliverableId = route.params.id;
const teamMembers = ref([]);
const StateData = ref(null);
const fullscreen = ref(false);

import useProject from '~/composables/useProject';
const { getProjectDetails } = useProject();

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance } = useWorkflowStateInstances();

import useDeliverables from '~/composables/useDeliverables';
const { fetchDeliverable, deleteDeliverableModal, changeAssignmentsModal, DeliverableData } = useDeliverables();

import { useDeliverableStore } from '~/stores/deliverable';
const deliverableStore = useDeliverableStore();

import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers } = useTeamMembers();

// Gated access, only for the project creator or team members
const hasAccess = computed(() => {
  if (project.value && teamMembers.value) {
    if(teamMembers.value.some(member => member.user_id === user.value.id) || user.value.id === project.value.created_by) {
      return true;
    }
  }
  return false;
});

// Roles
const isOwner = computed(() => 
  route.meta.role === 'owner'
);

console.log('isOwner:', isOwner.value);

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
}

// In the parent (this), I need to get the deliverable state 
// and pass it to the children (DocumentManager -> StateBar)
// I also need to set it in the store
async function init() {
  loading.value = true;
  
  try {
    await fetchDeliverable(deliverableId);
    projectId.value = DeliverableData.value.project;
    project.value = await getProjectDetails(projectId.value);
    StateData.value = await fetchSingleStateInstance(DeliverableData.value.workflow_state);

    // Set the deliverable state in the store
    deliverableStore.setDeliverableState(deliverableId, DeliverableData.value.workflow_state);

    // For the gated access, we need the team members
    teamMembers.value = await fetchTeamMembers(project.value.assigned_team);

    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

onMounted(async () => {

 // subscription
 const subscription = supabase
    .channel('public:deliverables')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'deliverables' }, (payload) => {
        
        // This is checking if the workflow state in the payload is different than current one, and if so, it refreshes the data
        // This is for the case that a user has a window open and the state changes from another user
        if (payload.new) {
          const newWorkflowState = payload.new.workflow_state;
          const oldWorkflowState = DeliverableData.value.workflow_state;

          if (newWorkflowState !== oldWorkflowState) {
            init();
          }
        } else {
          console.error("Payload missing 'new' or 'old' data:", payload); // Use console.error
        }
      }
    )
    .subscribe();

  onUnmounted(() => {
    supabase.removeChannel(subscription);
  });

  init();
});

// Now, I need to watch the store and see if the workflow state changes
// If it does, I need to update DeliverableData.workflow_state so that 
// the children components can react to it
watch(() => deliverableStore.getStateInstanceId(), (newValue) => {
  console.log('State instance ID changed:', newValue);
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
  position: relative;
  background: rgba($black, 0.0);

  .fullscreen-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: $spacing-sm $spacing-sm 0;
    background: transparent;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 1001;
  }

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba($white, 1);
    overflow-y: scroll;
    z-index: 1000;

    .documents {
      padding: 0 $spacing-md $spacing-md;
    }
  }

  .state-bar {
    position: sticky;
    bottom: 0;
    width: 100%;
    z-index: 1;
  }
}

</style>
