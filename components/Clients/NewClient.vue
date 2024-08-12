<template>
    <form class="inner-container" @submit.prevent="createClient">

      <div class="form-block">
          <div class="form-details">
              <h3>Client Details</h3>
              <p class="details">Your client's basic details.</p>
          </div>
          <div class="form-content">
            <div class="form-input">
                <label for="name">Name</label>
                <input v-model="client.name" id="name" type="text" placeholder="Input your client's name" />
            </div>
          </div>
      </div>

      <div class="form-block">
          <div class="form-details">
              <h3>Client Logo</h3>
              <p class="details">Make your client identifiable. If this is a company, use their logo!</p>
          </div>
          <div class="form-content">
              <ImageManager size="medium" table="logos" v-model:path="logo_url" /> 
          </div>
      </div>

      <div class="form-content">
        <div class="form-group">

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

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(false)
const logo_url = ref('')
const router = useRouter();

const client = reactive({
  name: 'Client name',
  created_at: new Date(),
  updated_at: new Date(),
  created_by: user.value.id,
})

console.log(logo_url.value)

async function createClient() {
  try {
    loading.value = true
    const updates = {
      name: client.name,
      created_at: client.created_at,
      updated_at: client.updated_at,
      created_by: client.created_by,
      logo_url: logo_url.value,
    }

    // console.log(updates)

    let { error } = await supabase.from('clients').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
    })

    // When complete, load /clients
    router.push('/clients')

    if (error) throw error

  } catch (error) {
    console.error('Error creating client:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Your styles here */
</style>