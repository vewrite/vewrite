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
        <button class="button primary" @click="createDeliverableModal(project.id)" v-if="personaState == 'manager' && isOwner && !membersError">Create new deliverable</button>
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
      <section v-if="loading.global == false && hasAccess">

        <div class="search-bar right" v-if="deliverables.length > 0 && !loading.deliverables">
          <Icon name="fluent:search-20-regular" size="2rem" />
          <input type="text" placeholder="Search in this project" v-model="searchQuery" :class="[listToggle]" />
          <div class="list-buttons">
            <button :class="['list-icon', viewModeDeliverable == 'list' ? 'active' : '']" @click="listToggle">
              <Icon name="fluent:list-20-regular" size="1.65rem" />
            </button>
            <button :class="['list-icon', viewModeDeliverable == 'calendar' ? 'active' : '']" @click="listToggle">
              <Icon name="fluent:calendar-20-regular" size="1.65rem" />
            </button>
          </div>
        </div>

        <div class="project-details">
          <Loading v-if="loading.global == true" zeroHeight="zero-height" type="small"  />
          <ProjectOverview v-if="project && loading.global == false" :project="project" :deliverables="deliverables" :client="project.client_id" :creator="creator" :team="project.assigned_team" :membersError="membersError" />
          <DeliverablesProgress v-if="project && loading.global == false && deliverables.length > 0" :deliverables="deliverables" :completedDeliverables="completedDeliverables" :totalDeliverables="deliverables.length" />
        </div>

        <section class="deliverables-view">

          <!-- Deliverables list component -->
          <DeliverablesList v-if="viewModeDeliverable == 'list' && loading.deliverables == false" :deliverables="filteredDeliverables" />

          <!-- Deliverables calendar component -->
          <div class="calendar-view" v-if="viewModeDeliverable == 'calendar'">
            <VCalendar :class="panelState" :attributes="calendarViewAttrs" title-position="left" borderless @dayclick="handleDateSelected" />
            <section class="calendar-panel" :class="panelState" v-if="panelState == 'open'">
              <section class="calendar-panel-header">
                <span class="panel-title">
                  Deliverables
                </span>
                <button class="button" @click="panelToggle">
                  <Icon name="fluent:chevron-left-16-regular" size="1.5rem" />
                </button>
              </section>
              <section class="calendar-panel-content">
                <div class="no-deliverables" v-if="deliverablesByDate.length == 0">
                  <p>No deliverables found for this date</p>
                </div>
                <div class="calendar-panel-deliverables" v-for="deliverable in deliverablesByDate">
                  <div class="deliverable-details">
                    <div class="deliverable-type">
                      <Icon v-if="deliverable.content.type == 'link'" name="fluent:open-16-regular" size="1.5rem" />
                      <Icon v-if="deliverable.content.type == 'content'" name="fluent:document-16-regular" size="1.5rem" />
                      <span class="deliverable-id">{{ deliverable.id }}</span>
                    </div>
                    <span class="deliverable-state">{{ deliverable.state_name }}</span>
                  </div>
                  <router-link :to="'/deliverable/' + deliverable.id" class="deliverable-title">{{ deliverable.title }}</router-link>
                  <div class="deliverable-actions">
                    <Dropdown position="left">
                      <template v-slot:trigger>
                        Due {{ deliverable.formattedDueDate }}
                      </template>
                      <template v-slot:menu>
                        <VDatePicker :id="'deliverable-calendar-' + deliverable.id" :attributes="deliverable.attrs" v-model="deliverable.selectedDate" @update:modelValue="onDateSelect(deliverable.id, deliverable.selectedDate, deliverable.due_date)" borderless />
                      </template>
                    </Dropdown>
                    <router-link :to="'/deliverable/' + deliverable.id" class="button primary">Open</router-link>
                  </div>
                </div>
              </section>
            </section>
          </div>
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
const { createDeliverableModal, fetchDeliverable, DeliverableError } = useDeliverables();

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
const selectedDay = ref(null);

// Calendar panel state
const panelState = ref('closed');

const deliverablesByDate = ref([]);

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

const listToggle = () => {
  viewModeDeliverable.value = viewModeDeliverable.value === 'list' ? 'calendar' : 'list';
  localStorage.setItem('viewModeDeliverable', JSON.stringify(viewModeDeliverable.value));
};

const panelToggle = () => {
  panelState.value = panelState.value === 'closed' ? 'open' : 'closed';
};

async function handleDateSelected(date) {
  // format should be timestamptz
  // like: 2025-03-11 22:00:00+00
  const simplifiedDate = {
    year: date.year,
    month: date.month,
    day: date.day,
    date: new Date(date.year, date.month - 1, date.day),
  };
  
  console.log('Date selected:', simplifiedDate);
  selectedDay.value = simplifiedDate;

  try {
    deliverablesByDate.value = await loadDeliverableByDate(simplifiedDate.date);
  } catch (error) {
    console.error('Error fetching deliverables:', error.message);
  }

  if (panelState.value === 'closed') {
    panelToggle();
  }
}

async function loadDeliverableByDate(timestamptz) {

  const targetDate = format(timestamptz, 'yyyy-MM-dd');
  console.log('Target date:', targetDate);

  try {
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('due_date::date', targetDate)
      .eq('project', projectId);

    if (error) throw error;

    await Promise.all(data.map(async deliverable => {
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

      // Format the due date into something nicer
      deliverable.formattedDueDate = format(dueDate, 'MMMM do, yyyy');

    }));

    return data;

    console.log('Deliverables due on', targetDate, ':', data);
  } catch (error) {
    console.error('Error fetching deliverables:', error.message);
  }
}

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

// Set today's date for the calendar view
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

      // Pre-check if the deliverable is already in the array
      if (!deliverableDates.value.some(date => date.getTime() === dueDate.getTime())) {
        deliverableDates.value.push(dueDate); // Use the already parsed dueDate

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
      }

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

// const onDateSelect = async (deliverableId, newDate, oldDate) => {
  
//   console.log('Updating date:', deliverableId, newDate, oldDate);

//   try {
//     // Convert dates to standardized format
//     let oldDateConverted = new Date(oldDate);
//     let newDateConverted = new Date(newDate);

//     console.log('Old date:', oldDateConverted);
//     console.log('New date:', newDateConverted);
    
//     // Update in database first
//     await updateDeliverableDate(deliverableId, newDateConverted);
    
//     // Find deliverable by its ID
//     const deliverableIndex = deliverables.value.findIndex(d => d.id === deliverableId);
//     if (deliverableIndex === -1) return;
    
//     // Create clean date format for display. This is shown to the user.
//     const formattedNewDate = format(newDateConverted, 'MMMM do, yyyy');
    
//     // Update deliverable with new values (create a new object to avoid reference issues)
//     deliverables.value[deliverableIndex] = {
//       ...deliverables.value[deliverableIndex],
//       due_date: newDateConverted,
//       selectedDate: newDateConverted,
//       formattedDueDate: formattedNewDate
//     };
    
//     console.log(calendarViewAttrs.value);

//     // Remove old calendar attributes that match the old date
//     // This needs a conversion because in Postgres we are using date and not timestamptz
//     calendarViewAttrs.value = calendarViewAttrs.value.filter(attr => 
//       // !attr.dates || (attr.dates.getTime && attr.dates.getTime() !== oldDateConverted.getTime())
//       // console.log(attr.dates.toISOString(), oldDateConverted.toISOString())
//       !attr.dates || (attr.dates.toISOString() !== oldDateConverted.toISOString())
//     );
    
//     // Clean up deliverable attributes
//     // Same as above, we must convert the dates to strings for comparison
//     if (deliverables.value[deliverableIndex].attrs) {
//       deliverables.value[deliverableIndex].attrs = 
//         deliverables.value[deliverableIndex].attrs.filter(attr => 
//           // !attr.dates || (attr.dates.getTime && attr.dates.getTime() !== oldDateConverted.getTime())
//           !attr.dates || (attr.dates.toISOString() !== oldDateConverted.toISOString())
//         );
//     } else {
//       deliverables.value[deliverableIndex].attrs = [];
//     }
    
//     // Clean deliverable dates array
//     deliverableDates.value = deliverableDates.value.filter(date => 
//       // date.getTime() !== oldDateConverted.getTime()
//       date.toISOString() !== oldDateConverted.toISOString()
//     );
    
//     // Add new date to arrays with clean references
//     deliverableDates.value.push(new Date(newDateConverted));
    
    
//     // Add new attributes with primitive values where possible
//     const deliverable = deliverables.value[deliverableIndex];
//     deliverable.attrs.push({
//       key: `${deliverable.id}-${newDateConverted.getTime()}`,
//       highlight: {
//         color: '#5C7DF6',
//         fillMode: 'solid'
//       },
//       dates: new Date(newDateConverted) // Create a new date instance
//     });
    
//     // Add to calendar with new date instance
//     calendarViewAttrs.value.push({
//       key: `${deliverable.title}-${newDateConverted.getTime()}`,
//       highlight: {
//         color: '#5C7DF6',
//         fillMode: 'outline'
//       },
//       popover: {
//         label: `${deliverable.id} - ${deliverable.title} (${deliverable.state_name})`,
//         color: '#5C7DF6',
//         fillMode: 'solid'
//       },
//       dot: true,
//       dates: new Date(newDateConverted) // Create a new date instance
//     });
//   } catch (error) {
//     console.error('Error updating date:', error);
//   }
// };

// const updateDeliverableDate = async (deliverableId, newDate) => {
//   try {
//     const { data, error } = await supabase
//       .from('deliverables')
//       .update({ due_date: newDate })
//       .eq('id', deliverableId);

//     if (error) throw error;

//   } catch (error) {
//     console.error('Error updating deliverable:', error.message);
//   }
// };

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
  margin: $spacing-sm 0 $spacing-md;
  border-radius: $br-lg;
  position: sticky;
  top: $spacing-sm;
}

.deliverables-view {
  display: flex;
  gap: $spacing-md;
  height: 100%;
  padding: 0 $spacing-md;
}

.calendar-view {
  height: 100%;
  width: 100%;
  border: $border;
  border-radius: $br-lg;
  display: flex;
  flex-direction: row;

  .vc-expanded {
    min-width: auto;
  }

  .calendar-panel {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    width: 100%;
    border-left: $border;

    &.open {
      display: flex;
      min-width: 500px;
      width: 500px;
    }

    &.closed {
      display: none;
    }

    .calendar-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 58px;
      border-bottom: $border;
      padding: 0 $spacing-md;

      .panel-title {
        font-size: $font-size-md;
      }
    }

    .calendar-panel-content {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      padding: 0 $spacing-sm;
      height: 100%;

      .no-deliverables {
        font-size: $font-size-xs;
        text-align: center;
      }

      .calendar-panel-deliverables {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: $spacing-sm;
        border: $border;
        border-radius: $br-md;
        transition: background-color 0.2s ease;

        .deliverable-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;

          .deliverable-type {
            display: flex;
            align-items: center;
            justify-content: center;
            color: $gray-dark;
            gap: $spacing-xxs;
          }

          .deliverable-id,
          .deliverable-state {
            color: $gray-dark;
            font-size: $font-size-xs;
          }

        }

        .deliverable-title {
          color: $black;
          text-decoration: none;
          font-size: $font-size-sm;
          width: 100%;
          line-height: 54px;
          text-align: center;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          gap: $spacing-xxs;
        }

        .deliverable-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        &:hover {
          background-color: rgba($black, 0.025);
        }
      }
    }
  }
}

</style>