<template>
  <div id="CreateProjectModal">
    <div class="modal-body">
      <Loading v-if="loading" />
      <section class="inner-container" v-if="clients.length < 1">
        <div class="empty">
          <h3>No Clients Found</h3>
          <p>You do not have a client to assign a project to. You must first add a client to Vewrite.</p>
          <nuxt-link class="button primary" to="/clients" @click="useModal().reset()">Add a client</nuxt-link>
        </div>
      </section>
      <form class="inner-container" v-if="!loading && clients.length > 0" @submit.prevent="createProject(project)">

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
            <h4>Client</h4>
            <p class="details">Select which client this is for.</p>
          </div>
          <div class="form-content">
            <div class="form-group">
              <section id="ClientSelect">
                <div class="client-select" v-for="client in clients">
                  <input type="radio" :id="client.id" name="drone" :value="client.id" v-model="project.client" />
                  <label :for="client.id">
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

// Deliverables composable
import useProject from '~/composables/useProject';
const { createProject } = useProject();

// Clients composable
import useClient from '~/composables/useClient';
const { fetchClients } = useClient();

// Workflow composable
import useWorkflow from '~/composables/useWorkflow';
const { fetchWorkflows } = useWorkflow();

// Modal
import { useModal } from '~/stores/modal'

const loading = ref(false);
const user = useSupabaseUser();

// Set some sane defaults for the workflow
const project = reactive({
  name: '',
  description: '',
  status: 1,
  client: 0,
  deliverables: ["1"],
  workflow: 1,
  created_at: new Date(),
  updated_at: new Date(),
  created_by: user.value.id,
  stakeholders: {
                  "stakeholders": "1"
                }
})

const clients = ref([]);
const workflows = ref([]);

onMounted(async () => {
  try {
    clients.value = await fetchClients(user.value.id);
    workflows.value = await fetchWorkflows(user.value.id);
  } catch (error) {
    console.error('Error fetching clients:', error.message);
  }
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#CreateProjectModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  width: 100%;

  .modal-body {
    width: 100%;

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
    margin-bottom: 1rem;
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