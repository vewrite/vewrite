<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/projects/" class="button">
        <Icon name="fluent:arrow-left-16-regular" size="1.5rem" />
      </router-link>
      <div class="app-panel-header" v-if="project">
        <Loading type="header" v-if="loading.global" />
      </div>
      <div class="app-panel-header-buttons" v-if="loading.global == false && hasAccess">
        <button class="button primary" @click="createDeliverableModal(project.id)" v-if="personaState == 'manager'">Create new deliverable</button>
        <Dropdown v-if="personaState == 'manager'">
          <template v-slot:trigger>
            <Icon name="uis:ellipsis-v" size="1.15rem" />
          </template>
          <template v-slot:menu>
            <div class="dropdown-item" @click="deleteProjectModal(project.id)">Delete project</div>
          </template>
        </Dropdown>
      </div>
    </template>
    <template v-slot:body>
      <section v-if="loading.global == false && hasAccess">
        <div class="project-details">
          <Loading v-if="loading.global == true" zeroHeight="zero-height" type="small"  />
          <ProjectOverview v-if="project && loading.global == false" :project="project" :deliverables="deliverables" :client="project.client_id" :creator="creator" :team="project.assigned_team" />
          <DeliverablesProgress v-if="project && loading.global == false && deliverables.length > 0" :deliverables="deliverables" :completedDeliverables="completedDeliverables" :totalDeliverables="deliverables.length" />
        </div>
        <div class="deliverables-list">
          <div class="no-deliverables" v-if="loading.deliverables == false && deliverables.length == 0">
            <p>No deliverables found for this project</p>
          </div>
          <div v-if="loading.deliverables == false && deliverables.length > 0" class="project-deliverables">
            <div class="single-deliverable" v-for="deliverable in deliverables">
              <div class="deliverable-details">
                <div class="deliverable-type">
                  <Icon v-if="deliverable.content.type == 'link'" name="fluent:open-16-regular" size="1.5rem" />
                  <Icon v-if="deliverable.content.type == 'content'" name="fluent:document-16-regular" size="1.5rem" />
                </div>
                <span class="deliverable-id">{{ deliverable.id }}</span>
                <router-link :to="'/deliverable/' + deliverable.id" class="deliverable-title">{{ deliverable.title }}</router-link>
              </div>
              <div class="deliverable-actions">
                <div class="deliverable-updated-at">
                  {{ deliverable.formattedUpdatedAt }}
                </div>
                <span class="deliverable-state">{{ deliverable.state_name }}</span>
                <Dropdown>
                  <template v-slot:trigger>
                    Due {{ deliverable.formattedDueDate }}
                  </template>
                  <template v-slot:menu>
                    <VDatePicker :attributes="deliverable.attrs" v-model="deliverable.selectedDate" @update:modelValue="onDateSelect(deliverable.id, deliverable.selectedDate)" />
                  </template>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
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

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

// Pull personaState from the middleware auth.js
const personaState = useState('personaState');

import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import ProjectOverview from '~/components/Projects/ProjectOverview.vue';
import DeliverablesProgress from '~/components/DeliverablesProgress.vue';
import { useRoute } from 'vue-router';
import { parseISO, format } from 'date-fns';
import AppPanel from '~/components/AppPanel.vue';

// Project composable
import useProject from '~/composables/useProject';
const { deleteProjectModal } = useProject();

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { createDeliverableModal, fetchDeliverable, DeliverableError } = useDeliverables();

// Client composable
import useClient from '~/composables/useClient';
const { fetchClient } = useClient();

// State Instance composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, fetchStateInstanceName, StateInstanceData } = useWorkflowStateInstances();

import useWorkflow from '~/composables/useWorkflow';
const { fetchStates, WorkflowStates } = useWorkflow();

import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers } = useTeamMembers();

const supabase = useSupabaseClient();
const loading = ref({
  global: true,
  deliverables: true
});

const attrs = ref([
  {
    key: 'today',
    highlight: {
      color: 'green',
      fillMode: 'solid'
    },
    dates: new Date()
  }
])

// Get the route object
const route = useRoute();

// Extract the project ID from the route parameters
const projectId = route.params.id;

// Fetch the project data from supabase
const project = ref(null);
const creator = ref(null);
const deliverables = ref([]);
const states = ref([]);
const completedDeliverables = ref(0);
const teamMembers = ref([]);
const user = useSupabaseUser();

// Gated access, only for the project creator or team members
const hasAccess = computed(() => {
  if (project.value && teamMembers.value) {
    if(teamMembers.value.some(member => member.user_id === user.value.id) || user.value.id === project.value.created_by) {
      return true;
    }
  }
  return false;
});

async function getProject(id) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    project.value = data;

    fetchClient(project.value.client_id);
    fetchDeliverables(project.value.id);
    fetchStates(project.value.workflow);
    fetchWorkflowStates(project.value.workflow);

  } catch (error) {
    console.error(error);
  }
}

async function fetchWorkflowStates(workflowId) {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('states')
      .eq('id', workflowId);

    // Fetch the states as an array of integers
    states.value = data[0].states;

    // Fetch the states as an array of objects from the states table
    states.value = await Promise.all(states.value.map(async state => {
      // return await fetchState(state);
      const fetchedState = await fetchSingleStateInstance(state);
      // console.log(fetchedState);
      return {
        ...fetchedState
      }
    }));

    if (error) throw error;

  } catch (error) {
    console.error(error);
  }
}

async function fetchDeliverables(projectId) {
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('project', projectId);

    if (error) {
      console.error('Error fetching deliverables:', error.message);
      return;
    }

    deliverables.value = data;

    // Fetch the state name for each deliverable
    await Promise.all(deliverables.value.map(async deliverable => {
      try {
        // Workflow state instance name
        const state_name = await fetchStateInstanceName(deliverable.workflow_state);
        deliverable.state_name = state_name[0].instance_name;
      } catch (error) {
        console.error('Error fetching state:', error.message);
      }

      try {
        await fetchDeliverable(deliverable.id);
      } catch (error) {
        console.error('Error fetching content type:', error.message);
      }

      // Due date
      const dueDate = parseISO(deliverable.due_date);
      
      if (isNaN(dueDate)) {
        console.error('Invalid date:', deliverable.due_date);
        return;
      }

      // Format the due date into something nicer
      deliverable.formattedDueDate = format(dueDate, 'MMMM do, yyyy');
      deliverable.formattedUpdatedAt = format(parseISO(deliverable.updated_at), 'MMMM do, yyyy');

      if (!deliverable.attrs) {
        deliverable.attrs = [];
      }
      deliverable.attrs.push({
        key: deliverable.id,
        highlight: {
          color: 'red',
          fillMode: 'solid'
        },
        dates: dueDate
      });
    }));

    loading.value.deliverables = false;
  } catch (error) {
    console.error('Error fetching deliverables:', error.message);
  }
}

const onDateSelect = async (deliverableId, newDate) => {
  await updateDeliverableDate(deliverableId, newDate);
  const popup = document.getElementById(`deliverable-calendar-${deliverableId}`);
  popup.style.display = 'none';

  // Get the date and update the deliverable
  const deliverable = deliverables.value.find(d => d.id === deliverableId);
  if (deliverable) {
    deliverable.due_date = newDate;
    deliverable.formattedDueDate = format(newDate, 'MMMM do, yyyy');
  }
  
};

const updateDeliverableDate = async (deliverableId, newDate) => {
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .update({ due_date: newDate })
      .eq('id', deliverableId);

    if (error) throw error;

    console.log('Deliverable updated:', data);
  } catch (error) {
    console.error('Error updating deliverable:', error.message);
  }
};

onMounted(async () => {

  const subscription = supabase
    .channel('deliverables')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'deliverables' }, payload => {
      console.log('New deliverable:', payload.new);
      deliverables.value.push(payload.new);
      // This is to update the dates after a new deliverable is added
      fetchDeliverables(projectId);
    })
    .subscribe();

  onUnmounted(() => {
    supabase.removeChannel(subscription);
  });

  await getProject(projectId);
  await fetchDeliverables(projectId);
  // For the gated access, we need the team members
  teamMembers.value = await fetchTeamMembers(project.value.assigned_team);

  loading.value.global = false;
});

const LastState = ref(null);

watchEffect(() => {
  LastState.value = WorkflowStates.value[WorkflowStates.value.length - 1];
  completedDeliverables.value = deliverables.value.filter(d => d.workflow_state === LastState.value).length;
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.project-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-md;
  margin: $spacing-sm;
  background: rgba($white, 0.025);
  backdrop-filter: blur(10px);
  z-index: 2;
  border-radius: $br-lg;
  position: sticky;
  top: $spacing-sm;
}

.deliverables-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 $spacing-sm $spacing-sm;
  gap: $spacing-sm;
}

.new-deliverable {
  display: flex;
  justify-content: flex-end;
  margin: $spacing-md $spacing-md 0 $spacing-md;
}

.no-deliverables {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: $gray;
}

.project-deliverables {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: $white;
  height: 100%;

  .single-deliverable {
    padding: $spacing-sm;
    width: 100%;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border-radius: $br-xl;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba($black, 0.025);
    }

    .deliverable-details {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-xs;

      .deliverable-id {
        color: $gray-dark;
        font-size: $font-size-xs;
        padding-right: $spacing-xs;
        border-right: $border;

        @media (max-width: 960px) {
          font-size: $font-size-xxs;
        }
      }

      .deliverable-type {
        display: flex;
        align-items: center;
        justify-content: center;
        color: $gray-dark;
      }

      .deliverable-title {
        color: $black;
        text-decoration: none;
        font-size: $font-size-xs;

        @media (max-width: 960px) {
          font-size: $font-size-xxs;
        }
      }
    }

    .deliverable-title {
      color: $black;
      text-decoration: none;
    }

    .deliverable-actions {
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      .deliverable-state {
        color: $black;
        font-size: $font-size-xs;
        border: $border;
        padding: $spacing-xxxs $spacing-xs;
        border-radius: $br-lg;

        @media (max-width: 960px) {
          font-size: $font-size-xxs;
        }
      }

      .deliverable-updated-at {
        color: $gray-dark;
        font-size: $font-size-xs;

        @media (max-width: 960px) {
          font-size: $font-size-xxs;
        }
      }

      .deliverable-workflow-state {
        position: relative;
        cursor: pointer;

        .deliverable-workflow-state-popup {
          position: absolute;
          top: calc(100% + 2px);
          right: 0;
          z-index: 1000;
          display: none;
        }
      }

      .deliverable-calendar {
        display: flex;
        position: relative;
      
        .deliverable-duedate {
          cursor: pointer;
        }
      }
    }
  }
}

</style>