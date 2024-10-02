<template>
  <main id="Workflows">
    <Loading v-if="loading" />
    <div class="workflow-select" v-if="!loading && workflows.length > 0">
      <div class="workflow-group">
        <div class="title">Default</div>
        <div :class="['single-workflow', visibleWorkflow == workflow.id ? 'active' : '']" v-for="workflow in defaultWorkflows" @click="showWorkflowPreview(workflow.id)">{{ workflow.name }}</div>
      </div>
      <div class="workflow-group">
        <div class="title">Custom</div>
        <div :class="['single-workflow', visibleWorkflow == workflow.id ? 'active' : '']" v-for="workflow in customWorkflows" @click="showWorkflowPreview(workflow.id)">{{ workflow.name }}</div>
      </div>
    </div>
    <div :class="['workflow-preview', 'scrollable']" v-if="!loading && workflows.length > 0">
      <div :class="['single-workflow-preview', visibleWorkflow == workflow.id ? 'active' : '' ]" v-for="workflow in workflows" key="workflow.id" :id="`workflow-${workflow.id}`">
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
const user = supabase.auth.user()

const workflows = ref([])
const defaultWorkflows = ref([])
const customWorkflows = ref([])
const loading = ref(true)
const visibleWorkflow = ref(1)

async function fetchWorkflows() {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')

    if (error) throw error

    workflows.value = data

    // Set default workflows (where type == 1)
    defaultWorkflows.value = data.filter(workflow => workflow.type === 1)

    // Set custom workflows (where type == 2, and belongs to this authenticated user)
    customWorkflows.value = data.filter(workflow => workflow.type === 2 && workflow.user_id === supabase.auth.user.id)

    loading.value = false

  } catch (error) {
    console.error("Error fetching workflows: ", error.message)
  }
}

function showWorkflowPreview(workflowId) {
  visibleWorkflow.value = workflowId
  console.log('showWorkflowPreview', workflowId)
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
    padding: $spacing-md $spacing-md $spacing-md 0;

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
        &.active {
          background-color: rgba($brand, 0.05);
          color: $brand;
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

    .single-workflow-preview {
      display: none;

      &.active {
        display: block;
      }
    }
  }

  .states-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: $spacing-md 0;
  }
}

</style>