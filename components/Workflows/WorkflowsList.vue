<template>
  <main id="Workflows">
    <Loading v-if="loading" />
    <div class="inner-container" v-if="!loading && workflows.length > 0">
      <div v-for="workflow in workflows" key="workflow.id">
        <h2>{{ workflow.name }}</h2>
        <p>{{ workflow.description }}</p>
        <aside class="states-list">
          <State v-for="state in workflow.states" key="state.id" :state="state" />
        </aside>
      </div>
    </div>
    <div class="inner-container" v-else>
      <p>No workflows found.</p>
    </div>
  </main>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import State from '/components/Workflows/State.vue'

// Supabase
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const workflows = ref([])
const loading = ref(true)
const states = ref([])

async function fetchWorkflows() {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')

    if (error) throw error

    workflows.value = data

    loading.value = false

  } catch (error) {
    console.error("Error fetching workflows: ", error.message)
  }
}

onMounted(() => {
  fetchWorkflows()
  // const states = computed(() => workflows.states.map(workflow => workflow.state))
})

</script>

<style lang="scss" scoped>

@import "./assets/variables.scss";

#Workflows {

  .states-list {
    display: flex;
    gap: 1rem;

    .state {
      padding: 1rem;
      border: 1px solid $gray-300;
      border-radius: 0.5rem;
    }
  }
}

</style>