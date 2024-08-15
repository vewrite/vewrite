<template>
  <main id="Workflows">
    <Loading v-if="loading" />
    <div class="workflow-select" v-if="!loading && workflows.length > 0">
      <div class="workflow-group">
        <div class="title">Workflows</div>
        <div class="single-workflow" v-for="workflow in workflows">{{ workflow.name }}</div>
      </div>
    </div>
    <div class="workflow-preview scrollable" v-if="!loading && workflows.length > 0">
      <div v-for="workflow in workflows" key="workflow.id">
        <h3>{{ workflow.name }}</h3>
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
})

</script>

<style lang="scss" scoped>

@import "./assets/variables.scss";

#Workflows {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .workflow-select {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 280px;
    height: 100%;
    border-right: 1px solid rgba($black, 0.1);
    padding: $spacing-md;

    .workflow-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: $spacing-md;

      .single-workflow {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-xs;
        padding: $spacing-xxs $spacing-xs;
        border-radius: $br-md;
        transition: background-color 0.18s ease;
        color: $black;
        font-size: $font-size-sm;
        font-family: $font-family-main;
        font-weight: 400;
        text-decoration: none;
        min-height: 36px;
        cursor: pointer;

        &:hover,
        &.router-link-active,
        &.router-link-exact-active {
          background-color: rgba($purple, 0.05);
          color: $purple;
        }
      }

      .title {
          font-size: $font-size-sm;
          font-family: $font-family-main;
          font-weight: 500;
          color: $gray-dark;
          margin-bottom: $spacing-xs;
        }
    }
  }

  .workflow-preview {
    width: calc(100% - 200px);
    display: flex;
    flex-direction: column;
    padding:  $spacing-md;
  }

  .states-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px solid rgba($black, 0.1);
    background-color: rgba($white-dark, 0.25);
    padding: $spacing-md;
    border-radius: $br-md;
    margin: $spacing-md 0;
    overflow-x: auto;
  }
}

</style>