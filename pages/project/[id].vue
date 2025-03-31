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
        <button class="button primary" @click="manageProjectMembersModal(project.id)" v-if="personaState == 'manager' && isOwner">Manage members</button>
        <button class="button primary" @click="handleOpenModal()" v-if="personaState == 'manager' && isOwner && !membersError">Create new deliverable</button>
        <Dropdown v-if="personaState == 'manager' && isOwner">
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
      <section class="deliverables-wrapper" v-if="loading.global == false && hasAccess">

        <div class="project-details">
          <Loading v-if="loading.global == true" zeroHeight="zero-height" type="small"  />
          <ProjectOverview v-if="project && loading.global == false" :project="project" :deliverables="deliverables" :client="project.client_id" :creator="creator" :team="project.assigned_team" :membersError="membersError" />
          <DeliverablesProgress v-if="project && loading.global == false && deliverables.length > 0" :deliverables="deliverables" :completedDeliverables="completedDeliverables" :totalDeliverables="deliverables.length" />
        </div>

        <div class="search-bar right" v-if="deliverables.length > 0 && !loading.deliverables">
          
          <Icon name="fluent:search-20-regular" size="2rem" />
          <input type="text" placeholder="Search in this project" v-model="searchQuery" :class="[listToggle]" />
          
          <div class="list-buttons">
            <button :class="['list-icon', viewModeDeliverable == 'list' ? 'active' : '']" @click="listToggle('list')">
              <Icon name="fluent:list-20-regular" size="1.65rem" /> List
            </button>
            <button :class="['list-icon', viewModeDeliverable == 'calendar' ? 'active' : '']" @click="listToggle('calendar')">
              <Icon name="fluent:calendar-20-regular" size="1.65rem" /> Calendar
            </button>
            <button :class="['kanban-icon', viewModeDeliverable == 'kanban' ? 'active' : '']" @click="listToggle('kanban')">
              <Icon name="fluent:grid-kanban-20-regular" size="1.65rem" /> Kanban
            </button>
          </div>
        </div>

        <section class="deliverables-view">
          <DeliverablesList v-if="viewModeDeliverable == 'list' && loading.deliverables == false" :deliverables="filteredDeliverables" />
          <DeliverablesCalendar v-if="viewModeDeliverable == 'calendar' && loading.deliverables == false" :deliverables="filteredDeliverables" :calendarViewAttrs="calendarViewAttrs" :project="project" :personaState="personaState" :isOwner="isOwner" :membersError="membersError" />
          <DeliverablesKanban v-if="viewModeDeliverable == 'kanban' && loading.deliverables == false" :deliverables="filteredDeliverables" :workflowStates="WorkflowStates" />
        </section>
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

import DeliverablesList from '~/components/Deliverables/DeliverablesList.vue';
import DeliverablesCalendar from '~/components/Deliverables/DeliverablesCalendar.vue';

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'project'],
});

// Pull personaState from the middleware auth.js
const personaState = useState('personaState');

import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { parseISO, format } from 'date-fns';
import ProjectOverview from '~/components/Projects/ProjectOverview.vue';
import DeliverablesProgress from '~/components/DeliverablesProgress.vue';
import AppPanel from '~/components/AppPanel.vue';

// Project composable
import useProject from '~/composables/useProject';
const { deleteProjectModal, manageProjectMembersModal } = useProject();

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { createDeliverableModal, fetchDeliverable, useSelectedDate } = useDeliverables();

// Client composable
import useClient from '~/composables/useClient';
const { fetchClient } = useClient();

// State Instance composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, fetchStateInstanceName, StateInstanceData } = useWorkflowStateInstances();

import useWorkflow from '~/composables/useWorkflow';
const { fetchStates, WorkflowStates } = useWorkflow();

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const loading = ref({ global: true, deliverables: true });
const membersError = ref(false);

const deliverableDates = ref([]);
const viewModeDeliverable = ref('list');

const searchQuery = ref('')

const selectedDeliverableDate = useSelectedDate();

function handleOpenModal(selectedDate) {
  selectedDeliverableDate.value = new Date();
  createDeliverableModal(project.id)
}

// This is pushed into the DeliverablesCalendar component
// It starts with today, and we push new deliverables into it when they are fetched
const calendarViewAttrs = ref([
  {
    key: 'today',
    highlight: {
      color: '#5C7DF6',
      fillMode: 'solid'
    },
    dates: new Date()
  }
]);

function resetCalendarViewAttrs() {
  calendarViewAttrs.value = [
    {
      key: 'today',
      highlight: {
        color: '#5C7DF6',
        fillMode: 'solid'
      },
      dates: new Date()
    }
  ];
}

async function setNewCalendarViewAttrs() {

  try {
    deliverables.value.forEach(deliverable => {

      const dueDate = parseISO(deliverable.due_date);
      if (isNaN(dueDate)) {
        console.error('Invalid date:', deliverable.due_date);
        return;
      }

      // Push the new deliverable into the calendar view
      calendarViewAttrs.value.push({
        key: deliverable.title,
        highlight: {
          color: '#5C7DF6',
          fillMode: 'outline'
        },
        popover: {
          label: deliverable.id + ' - ' + deliverable.title + ' (' + deliverable.state_name + ')',
          color: '#5C7DF6',
          fillMode: 'solid'
        },
        dot: true,
        dates: dueDate
      });
      // }

      if (!deliverable.attrs) {
        deliverable.attrs = [];
      }
      deliverable.attrs.push({
        key: deliverable.id,
        highlight: {
          color: '#5C7DF6',
          fillMode: 'solid'
        },
        dates: dueDate
      });
    });

  } catch (error) {
    console.error('Error setting new calendar view attributes:', error.message);
  }
}

// Get the route object and the meta from /middleware/role.js
const route = useRoute();

// Extract the project ID from the route parameters
const projectId = route.params.id;

// Fetch the project data from supabase
const project = ref(null);
const creator = ref(null);
const deliverables = ref([]);
const states = ref([]);
const completedDeliverables = ref(0);

const listToggle = (type) => {
  viewModeDeliverable.value = type;
  localStorage.setItem('viewModeDeliverable', JSON.stringify(viewModeDeliverable.value));
};

const filteredDeliverables = computed(() => {
  if (searchQuery.value != '') {
  return deliverables.value.filter(
    deliverable => 
      deliverable.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  } else {
    return deliverables.value
  }
})

async function checkMemberRequirements() {
  if (!project.value || !project.value.project_members) {
    membersError.value = true;
    return;
  }

  try {
    // After updating the members list in ManageProjectMembersModal, we need to re-fetch the project
    await getProject(projectId);

    // Count members with user_id
    const validMembersCount = project.value.project_members.filter(member => member.user_id).length;
    
    // Set error if less than 2 valid members
    membersError.value = validMembersCount < 2;
  } catch (error) {
    console.error('Error fetching project members:', error.message);
  }
  
}

// Roles
const isOwner = computed(() => 
  route.meta.role === 'owner'
);

// Gated access, only for the project creator or team members
const hasAccess = computed(() => {
  if (project.value) {
    if(project.value.project_members.some(member => member.user_id === user.value.id) || user.value.id === project.value.created_by) {
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
      const fetchedState = await fetchSingleStateInstance(state);
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

      // Setup the calendar view attributes by resetting and setting new ones
      resetCalendarViewAttrs();
      await setNewCalendarViewAttrs();

      if (!deliverable.attrs) {
        deliverable.attrs = [];
      }
      deliverable.attrs.push({
        key: deliverable.id,
        highlight: {
          color: '#5C7DF6',
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

onMounted(async () => {

  const savedState = localStorage.getItem('viewModeDeliverable');
  if (savedState !== null) {
    viewModeDeliverable.value = JSON.parse(savedState);
  }

  const subscription = supabase
    .channel('deliverables')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'deliverables' }, payload => {
      console.log('New deliverable:', payload.new);
      deliverables.value.push(payload.new);
      // This is to update the dates after a new deliverable is added
      fetchDeliverables(projectId);
    })
    .subscribe();

  const projectSubscription = supabase
    .channel('projects')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, payload => {
      console.log('Updated project:', payload.new);
      checkMemberRequirements();
    })
    .subscribe();

  const deliverablesSubscription = supabase
    .channel('deliverables')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'deliverables' }, payload => {
      fetchDeliverables(projectId);

      // Setup the calendar view attributes by resetting and setting new ones
      resetCalendarViewAttrs();
      setNewCalendarViewAttrs();
    })
    .subscribe();

  onUnmounted(() => {
    supabase.removeChannel(subscription);
    supabase.removeChannel(projectSubscription);
    supabase.removeChannel(deliverablesSubscription);
  });

  await getProject(projectId);
  await fetchDeliverables(projectId);
  checkMemberRequirements();

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
  padding: 0 $spacing-md;
  margin: $spacing-sm 0;
  border-radius: $br-lg;
}

.deliverables-wrapper {
  height: calc(100% - 86px);
  width: 100%;

  .deliverables-view {
    display: flex;
    gap: $spacing-md;
    height: calc(100% - 125px);
    width: 100%;
  }
}

</style>