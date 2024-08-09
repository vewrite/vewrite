<template>
  <AppPanel>
    <template v-slot:header>
      <div class="app-panel-header">Create a new project</div>
    </template>
    <template v-slot:body>
      <!-- <pre>{{ $v }}</pre> -->

      <Loading v-if="loading" />
      <form class="inner-container" @submit.prevent="createProject" v-else>

        <div class="form-block">
            <div class="form-details">
                <h3>Project Details</h3>
              <p class="details">Your project's details.</p>
            </div>
            <div class="form-content">
              <div class="form-group">
                <div>
                    <label for="name">Name</label>
                    <input v-model="project.name" id="name" type="text" placeholder="Name your project"  />
                    <span class="form-error" v-if="$v.$errors.length !== 0 && $v.project.name.required">Name is required</span>
                </div>
                <div>
                    <label for="status">Status</label>
                    <select v-model="project.status" id="status">
                      <option value="0">Not started</option>
                      <option value="1">Active</option>
                      <option value="2">Archived</option>
                    </select>
                    <span v-if="!$v.project.status.required">Status is required</span>
                </div>

                <div>
                    <label for="client">Client</label>
                    <select v-model="project.client" id="client">
                      <option v-for="client in clients" :value="client.id">{{ client.name }}</option>
                    </select>
                    <span v-if="!$v.project.client.required">Client is required</span>
                </div>
                

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

      <WizardBar v-if="!loading" />
    </template>
  </AppPanel>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const router = useRouter();
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)

const project = reactive({
  name: '',
  status: 1,
  client: 0,
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
    status: { required },
    client: { required }
  }
}

const $v = useVuelidate(rules, { project })

// Get the list of clients
const clients = ref([])

async function fetchClients() {

  loading.value = true

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('created_by', user.value.id)

  if (error) {
    console.error('Error fetching clients:', error.message)
    return
  }

  clients.value = data

  // set the v-model to the first client in the list
  if (clients.value.length > 0) {
    project.client = clients.value[0].id
  }

  loading.value = false
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
      status: project.status,
      client: project.client,
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

    if (error) throw error

  } catch (error) {
    console.error('Error creating project:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchClients()
})

</script>

<style scoped>
/* Your styles here */
</style>