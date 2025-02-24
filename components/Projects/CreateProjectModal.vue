<template>
  <div id="CreateProjectModal">
    <div class="modal-body">

      <Loading v-if="loading" class="loader" type="small" />
      
      <!-- No teams -->
      <section class="inner-container" v-if="!loading && !hasReadyTeams">
        <div class="empty">
          <h3>No Ready Teams Found</h3>
          <p>You do not have a team to assign a project to. You must first add a team to Vewrite, and add at least two team members.</p>
          <nuxt-link class="button primary" to="/teams" @click="useModal().reset()">Manage your teams</nuxt-link>
        </div>
      </section>

      <!-- No clients -->
      <section class="inner-container" v-if="!loading && !hasClients">
        <div class="empty">
          <h3>No Clients Found</h3>
          <p>You do not have a client to assign a project to. You must first add a client to Vewrite.</p>
          <nuxt-link class="button primary" to="/clients" @click="useModal().reset()">Add a client</nuxt-link>
        </div>
      </section>

      <!-- Free user, maxxed out projects -->
      <section class="inner-container" v-if="!loading && !isPro && !isAllowed">
        <div class="empty">
          <h3>Free projects are limited</h3>
          <p>You're a manager and already have one free project. If you need more, you must upgrade.</p>
          <nuxt-link class="button green large" to="/subscriptions" @click="useModal().reset()">Upgrade</nuxt-link>
        </div>
      </section>

      <!-- Has clients and teams -->
      <form class="inner-container" v-if="!loading && hasReadyTeams && hasClients && isAllowed" @submit.prevent="createProject(project)">

        <!-- isPro or freeLimitedProject -->
        <div class="form-block" v-if="isAllowed">
          <div class="form-details">
            <h4>Project Details</h4>
            <p class="details">These help you quickly identify and differentiate your projects. Make sure to be as descriptive and details as possible so that you don't confuse your projects.</p>
          </div>
          <div class="form-content">
            <div class="form-input">
              <label for="name">Name</label>
              <input v-model="project.name" id="name" type="text" placeholder="Your project's name" />
              <span class="form-required" v-if="formErrors.name != ''">{{ formErrors.name }}</span>
            </div>
            <div class="form-input">
              <label for="description">Description</label>
              <input v-model="project.description" id="description" type="text" placeholder="Summarize your project and its objectives" />
            </div>
          </div>
        </div>

        <div class="form-block">
          <div class="form-details">
            <h4>Team</h4>
            <p class="details">Assign a team who will work on this project.</p>
          </div>
          <div class="form-content">
            <div class="form-input">
              <label for="team">Assigned team</label>
              <select v-model="project.assigned_team" id="team">
                <option v-for="team in readyTeamsData" :key="team.assigned_team" :value="team.id">{{ team.name }}</option>
              </select>
              <span class="form-required" v-if="formErrors.assigned_team != ''">{{ formErrors.assigned_team }}</span>
            </div>
          </div>
        </div>

        <div class="form-block">
          <div class="form-details">
            <h4>Client</h4>
            <p class="details">Select which client this is for.</p>
          </div>
          <div class="form-content">
            <div class="form-group">
              <span class="form-required" v-if="formErrors.client_id != ''">{{ formErrors.client_id }}</span>
              <section id="ClientSelect">
                <div class="client-select" v-for="client in clients">
                  <input type="radio" :id="client.client_id" name="drone" :value="client.client_id" v-model="project.client_id" />
                  <label :for="client.client_id">
                    <div class="image-wrapper">
                      <img :src="client.logo_url" alt="Client avatar" />
                    </div>
                    {{ client.name }}
                  </label>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div class="form-block">
          <div class="form-details">
            <h4>Workflow</h4>
            <p class="details">Your team relies on this workflow to set the correct order of work.</p>
          </div>
          <div class="form-content">
            <div class="form-input">
                <label for="client">Workflow</label>
                <select v-model="project.workflow" id="client">
                  <option v-for="workflow in workflows" :value="workflow.id">{{ workflow.name }}</option>
                </select>
                <span class="form-required" v-if="formErrors.workflow != ''">{{ formErrors.workflow }}</span>
            </div>
          </div>
        </div>
      </form>
          
    </div>
    
    <div class="buttons" v-if="!loading && hasReadyTeams && hasClients && isAllowed">
      <button @click="handleCreateProject(project)" class="primary large">Create</button>
    </div>
  </div>
</template>

<script setup>

import useProject from '~/composables/useProject';
const { createProject, fetchProjectsCreatedBy } = useProject();

import useClient from '~/composables/useClient';
const { fetchClients } = useClient();

import useWorkflow from '~/composables/useWorkflow';
const { fetchWorkflows } = useWorkflow();

import useTeam from '~/composables/useTeam';
const { fetchTeams, TeamsData, TeamsError } = useTeam();

import useGroup from '~/composables/useGroup';
const { fetchSingleGroup, GroupData, GroupError } = useGroup();

import { useModal } from '~/stores/modal'

const user = useSupabaseUser();

const PlanStatus = ref('')
const ownedProjects = ref(0);

// Pull subscription status from the middleware auth.js
const subscriptionStatus = useState('subscriptionStatus');
PlanStatus.value = subscriptionStatus.value.status

const readyTeamsData = computed(() => {
  return TeamsData.value.filter(team => team.details.ready === true);
})

// Loading state
const loading = ref(true);
// useModal().toggleLoading();

// Set some sane defaults for the workflow
const project = reactive({
  name: '',
  description: '',
  status: 1,
  client_id: 0,
  workflow: 1,
  created_at: new Date(),
  updated_at: new Date(),
  created_by: user.value.id,
  assigned_team: '',
})

const clients = ref([]);
const workflows = ref([]);

onMounted(async () => {
  try {
    await fetchSingleGroup(user.value.id);
    await fetchTeams(GroupData.value.id);
    ownedProjects.value = await fetchProjectsCreatedBy(user.value.id);
    console.log('Owned projects:', ownedProjects.value);
    clients.value = await fetchClients(user.value.id);
    workflows.value = await fetchWorkflows(user.value.id);
    loading.value = false;
  } catch (error) {
    console.error('Error fetching clients:', error.message);
    loading.value = false;
  }
})

const hasReadyTeams = computed(() => {
  return readyTeamsData.value.length > 0;
})

const hasClients = computed(() => {
  return clients.value.length > 0;
})

const isPro = computed(() => {
  console.log('Plan status:', PlanStatus.value);
  return PlanStatus.value == 'pro';
})

const isFree = computed(() => {
  return PlanStatus.value == 'free';
})

const limitedProject = computed(() => {
  return ownedProjects.value > 1;
})

const isAllowed = computed(() => {
  // Pro user always allowed
  if (isPro.value) {
    console.log('Pro user, allowed');
    return true;
  }

  // Free user, no projects, allowed
  if (ownedProjects.value < 2) {
    console.log(ownedProjects.value);
    return true;
  }

  // Free user, already has one project, not allowed
  if (ownedProjects.value > 1) {
    return false;
  }
})

// Form validation
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  project: {
    name: { required },
    assigned_team: { required },
    client_id: { required },
    workflow: { required },
  }
}

const formErrors = ref({
  name: '',
  assigned_team: '',
  client_id: '',
  workflow: '',
})

const $v = useVuelidate(rules, { project })

$v.value.$touch()

function handleCreateProject (project) {

  if ($v.value.$invalid) {
    console.log('Form is invalid');

    clearErrors();

    console.log(formErrors.value);

    // Process validation errors
    $v.value.$errors.forEach(error => {
      processError(error);
    });
    return
  } else {
    createProject(project);
  }

}

function processError (error) {
  formErrors.value[error.$property] = error.$property + ' is required';
}

function clearErrors () {
  formErrors.value = {
    name: '',
    assigned_team: '',
    client_id: '',
    workflow: '',
  };
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#CreateProjectModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .modal-body {
    width: 100%;
    min-height: 320px;

    p {
      margin: 0;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-xs;
      color: $red;
    }
  }
}

#ClientSelect {
  padding: $spacing-sm;
  border: 1px solid rgba($brand, 0.15);
  background-color: $white;
  border-radius: $br-md;
  max-height: 320px;
  overflow-y: auto;

  .client-select {
    display: flex;
    align-items: center;
    border: 1px solid rgba($brand, 0);
    border-radius: $br-md;
    padding: $spacing-xxs;

    &:hover {
      background-color: rgba($brand, 0.05);
    }

    .image-wrapper {
        width: 80px;
        min-height: 54px;
        height: 54px;
        border-radius: $br-md;
        overflow: hidden;
        background-color: $gray-light;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: auto;
          height: 100%;
        }

      }

    input[type="radio"] {
      margin-right: 0.5rem;
      width: 18px;
      height: 18px;
    }

    label {
      display: flex;
      flex-direction: row;
      gap: $spacing-sm;
      align-items: center;
      cursor: pointer;
      justify-content: flex-start;
      font-size: $font-size-xs;
      color: $black;
      padding: 0 $spacing-sm;
      width: 100%;
    }

    &:hover {

      label {
        background: transparent;
      }
    }
  }
}

</style>