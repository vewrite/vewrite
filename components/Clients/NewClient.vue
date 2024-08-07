<template>
    <form class="inner-container" @submit.prevent="createClient">
      <div class="form-details">
          <h3>Project Details</h3>
          <p class="details">Your clients's details.</p>
      </div>
      <div class="form-content">
        <div class="form-group">
            <div>
                <label for="name">Name</label>
                <input v-model="client.name" id="name" type="text" />
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

<script setup>

import { useRouter } from 'vue-router';

const router = useRouter();
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(false)

const client = reactive({
  name: 'Name your client',
  created_at: new Date(),
  updated_at: new Date(),
  created_by: user.value.id,
})

async function createClient() {
  try {
    loading.value = true
    const updates = {
      name: client.name,
      status: client.status,
      client: client.client,
      created_at: client.created_at,
      updated_at: client.updated_at,
      created_by: client.created_by,
    }

    let { error } = await supabase.from('clients').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
    })

    // When complete, load /projects
    router.push('/clients')

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