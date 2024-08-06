<template>
  <AppPanel>
    <template v-slot:header>
      <div class="app-panel-header">Create a new project</div>
    </template>
    <template v-slot:body>
      <form class="inner-container" @submit.prevent="createProject">
        <div class="form-details">
            <h3>Project Details</h3>
            <p class="details">Your project's details.</p>
        </div>
        <div class="form-content">
          <div class="form-group">
              <div>
                  <label for="name">Name</label>
                  <input v-model="project.name" id="name" type="text" />
              </div>
              <div>
                  <label for="status">Status</label>
                  <input v-model="project.status" id="status" type="text" />
              </div>
              

              <div class="form-group-footer">
                <button type="submit" class="button block primary" :disabled="loading">
                    <span v-if="loading">Updating...</span>
                    <span v-else>Create</span>
                </button>
              </div>
          </div>     
        </div>
      </form>
    </template>
  </AppPanel>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(false)

const project = reactive({
  name: 'Name your project',
  status: 0,
  company: 0,
  workflow: 0,
  created_at: new Date(),
  updated_at: new Date(),
  created_by: user.value.id,
  stakeholders: {
                  "stakeholders": "1"
                }
})

async function createProject() {
  try {
    loading.value = true
    const updates = {
      name: project.name,
      status: project.status,
      company: project.company,
      workflow: project.workflow,
      created_at: project.created_at,
      updated_at: project.updated_at,
      created_by: project.created_by,
      stakeholders: project.stakeholders
    }

    let { error } = await supabase.from('projects').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
    })
    if (error) throw error

  } catch (error) {
    console.error('Error creating project:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Your styles here */
</style>