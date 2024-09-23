<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/projects/" class="button dark">Back</router-link>

      <div></div>
    </template>
    <template v-slot:body>

      <Loading v-if="loading" />

      <main class="scrollable has-wizard">

        <!-- STEP 1 -->
        <div class="inner-container" v-if="!loading && wizardBar.currentStep == 1">
          <div class="form-block">
            <div class="form-details">
              <h3>Select the Client</h3>
              <p class="details">Choose a client from the list.</p>
              <p class="details">If you haven't created a client for this project, <router-link to="/clients/create">you can do so here</router-link>.</p>
            </div>
            <div class="form-content">
              <div class="form-group">
                <div class="client-select" v-for="client in clients">
                  <input type="radio" :id="client.id" name="drone" :value="client.id" v-model="project.client" />
                  <label :for="client.id">
                    <div class="image-wrapper">
                      <img :src="client.logo_url" alt="Client avatar" />
                    </div>
                    {{ client.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2 -->
        <form class="inner-container" @submit.prevent="createProject" v-if="!loading && wizardBar.currentStep == 2">
          <div class="form-block" >
              <div class="form-details">
                  <h3>Project Details</h3>
                <p class="details">Your project's details.</p>
              </div>
              <div class="form-content">
                <div class="form-group">
                  <div class="form-input">
                      <label for="name">Name</label>
                      <input v-model="project.name" id="name" type="text" placeholder="Name your project"  />
                      <span class="form-error" v-if="$v.$errors.length !== 0 && $v.project.name.required">Name is required</span>
                  </div>
                  <div class="form-input">
                      <label for="name">Description</label>
                      <textarea v-model="project.description" id="name" type="text" placeholder="Describe your project and its objective"  />
                      <span class="form-error" v-if="$v.$errors.length !== 0 && $v.project.name.required">Description is required</span>
                  </div>
                  <div class="form-input">
                      <label for="status">Status</label>
                      <select v-model="project.status" id="status">
                        <option value="0">Not started</option>
                        <option value="1">Active</option>
                        <option value="2">Archived</option>
                      </select>
                      <span v-if="!$v.project.status.required">Status is required</span>
                  </div>

                  <div class="form-input">
                      <label for="client">Workflow</label>
                      <select v-model="project.workflow" id="client">
                        <option v-for="workflow in workflows" :value="workflow.id">{{ workflow.name }}</option>
                      </select>
                      <span v-if="!$v.project.workflow.required">Workflow is required</span>
                  </div>

                  <!-- <div class="form-input">
                      <label for="client">Client</label>
                      <select v-model="project.client" id="client">
                        <option v-for="client in clients" :value="client.id">{{ client.name }}</option>
                      </select>
                      <span v-if="!$v.project.client.required">Client is required</span>
                  </div> -->

                  <div class="form-group-footer">
                    <button type="submit" class="button block primary" :disabled="loading">
                        <span v-if="loading">Updating...</span>
                        <span v-else>Create</span>
                    </button>
                  </div>
                </div>     
              </div>
          </div>
          
        </form> 
      </main>

      <WizardBar :totalSteps="2" :labels="['Select a Client', 'Project Details']" v-if="!loading" />
    </template>
  </AppPanel>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue'

// Vuelidate
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

// Wizard Bar Store
import { useWizardBar } from '@/stores/wizardbar'
const wizardBar = useWizardBar()

// Supabase
const router = useRouter();
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)

const project = reactive({
  name: '',
  description: '',
  status: 1,
  client: 0,
  deliverables: ["1"],
  workflow: 0,
  created_at: new Date(),
  updated_at: new Date(),
  created_by: user.value.id,
  stakeholders: {
                  "stakeholders": "1"
                }
})

const rules = {
  project: {
    name: { required },
    description: { required },
    status: { required },
    client: { required },
    workflow: { required }
  }
}

const $v = useVuelidate(rules, { project })

// Get the list of clients
const clients = ref([])

async function fetchClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('created_by', user.value.id)

  if (error) {
    console.error('Error fetching clients:', error.message)
    return
  }

  // add the clients to the clients ref
  clients.value = data

  // Add the clients to the clients ref
  clients.value = await Promise.all(data.map(async client => {
    const logoBlob = await downloadImage(client.logo_url);
    return {
      ...client,
      logo_url: URL.createObjectURL(logoBlob)
    };
  }));

  loading.value = false
}

const downloadImage = async (path) => {
  try {
    const { data, error } = await supabase.storage
          .from('logos')
          .download(path)
      if (error) throw error
      // console.log(data)
      return data
  } catch (error) {
      console.error("Error downloading image: ", error.message)
  }
}

// Workflows
const workflows = ref([])

async function fetchWorkflows() {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('created_by', user.value.id)

  if (error) {
    console.error('Error fetching workflows:', error.message)
    return
  }

  workflows.value = data
}

async function createProject() {
  $v.value.$touch()
  if ($v.value.$invalid) {
    console.log(project)
    console.log($v.value)
    console.log('Form is invalid')
    return
  }
  
  try {
    loading.value = true

    const updates = {
      name: project.name,
      description: project.description,
      status: project.status,
      client: project.client,
      deliverables: project.deliverables,
      workflow: project.workflow,
      created_at: project.created_at,
      updated_at: project.updated_at,
      created_by: project.created_by,
      stakeholders: project.stakeholders
    }

    let { error } = await supabase.from('projects').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
    })

    // When complete, load /projects
    router.push('/projects')

    // Reset the create form
    loading.value = false
    wizardBar.currentStep == 1

    if (error) throw error

  } catch (error) {
    console.error('Error creating project:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchClients()
  fetchWorkflows()
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.client-select {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border: 1px solid rgba($brand, 0);
  border-radius: $br-md;
  padding: $spacing-xxs;

  &:hover {
    background-color: rgba($brand, 0.1);
    border-color: $brand;
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

</style>