<template>
  <div id="CreateProjectModal">
    <div class="modal-body">

      <Loading v-if="loading" class="loader" />

      <section class="inner-container" v-if="!loading && TeamsData.length < 1">
        <div class="empty">
          <h3>No Teams Found</h3>
          <p>You do not have a team to assign a project to. You must first add a team to Vewrite.</p>
          <nuxt-link class="button primary" to="/teams" @click="useModal().reset()">Add a team</nuxt-link>
        </div>
      </section>

      <section class="inner-container" v-if="!loading && clients.length < 1">
        <div class="empty">
          <h3>No Clients Found</h3>
          <p>You do not have a client to assign a project to. You must first add a client to Vewrite.</p>
          <nuxt-link class="button primary" to="/clients" @click="useModal().reset()">Add a client</nuxt-link>
        </div>
      </section>

      <form class="inner-container" v-if="!loading && clients.length > 0 && TeamsData.length > 0" @submit.prevent="createProject(project)">

        <div class="form-block">
          <div class="form-details">
            <h4>Project Details</h4>
            <p class="details">These help you quickly identify and differentiate your projects. Make sure to be as descriptive and details as possible so that you don't confuse your projects.</p>
          </div>
          <div class="form-content">
            <div class="form-input">
              <label for="name">Name</label>
              <input v-model="project.name" id="name" type="text" placeholder="Your project's name" />
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
                <option v-for="team in TeamsData" :key="team.team_id" :value="team.id">{{ team.name }}</option>
              </select>
              <!-- TODO: Add validation -->
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
                <!-- TODO: Add validation -->
                <!-- <span v-if="!$v.project.workflow.required">Workflow is required</span> -->
            </div>
          </div>
        </div>
      </form>
          
    </div>
    
    <div class="buttons" v-if="clients.length > 0">
      <button @click="createProject(project)" class="primary wide">Create</button>
    </div>
  </div>
</template>

<script setup>

import useProject from '~/composables/useProject';
const { createProject } = useProject();

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
    clients.value = await fetchClients(user.value.id);
    workflows.value = await fetchWorkflows(user.value.id);
    loading.value = false;
  } catch (error) {
    console.error('Error fetching clients:', error.message);
    loading.value = false;
  }
})

watch(project, (newVal, oldVal) => {
  console.log('Project:', project);
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#CreateProjectModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
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
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-sm;
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
      font-size: $font-size-sm;
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