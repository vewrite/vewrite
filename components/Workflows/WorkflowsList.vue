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
      <div class="notification warning" v-if="!visibleWorkflow">
        Your workflow has been deleted
      </div>
      <div :class="['single-workflow-preview', visibleWorkflow == workflow.id ? 'active' : '' ]" v-for="workflow in workflows" key="workflow.id" :id="`workflow-${workflow.id}`">
        <div class="single-workflow-preview-header">
          <div class="header-title">
            <h3>{{ workflow.name }}</h3>
            <p>{{ workflow.description }}</p>
          </div>
          <div class="header-actions" v-if="workflow.type == 2">
            <button class="button red" @click="deleteWorkflowModal(workflow.id)">Delete workflow {{ workflow.id }}</button>
          </div>
        </div>
        <div class="" v-if="workflow.type == 1">
          This is a default workflow. You can't edit or delete this workflow.
        </div>
        <aside class="states-list">
          <State v-for="state in workflow.states" key="state.id" :state="state" />
        </aside>
      </div>
    </div>
    <div class="inner-container" v-if="!loading && workflows.length < 1">
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

import useWorkflow from '~/composables/useWorkflow'
const { deleteWorkflowModal } = useWorkflow()


// TODO - move this to the composable
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
}

onMounted(async () => {
  // Register onUnmounted before any await statements
  const subscription = supabase
    .from('workflows')
    .on('INSERT', payload => {
      console.log('New workflows:', payload.new);
      workflows.value.push(payload.new);
      // This is to update the dates after a new deliverable is added
      fetchWorkflows();
    })
    .on('DELETE', payload => {
      console.log('Deleted workflow:', payload.old);
      workflows.value = workflows.value.filter(workflow => workflow.id !== payload.old.id);
      defaultWorkflows.value = defaultWorkflows.value.filter(workflow => workflow.id !== payload.old.id);
      customWorkflows.value = customWorkflows.value.filter(workflow => workflow.id !== payload.old.id);
      // After deletion, reset the visible workflow to null to show the empty state
      visibleWorkflow.value = null;
    })
    .subscribe();

  onUnmounted(() => {
    supabase.removeSubscription(subscription);
  });

  await fetchWorkflows();

  loading.value = false;
});

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
    border-right: 1px solid rgba($brand, 0.15);
    background-color: rgba($white, 0.5);
    padding: $spacing-md $spacing-md $spacing-md $spacing-md;

    .workflow-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: $spacing-md;

      .single-workflow {
        display: block;
        padding: 0 $spacing-xs;
        border-radius: $br-md;
        border: 1px solid rgba($brand, 0);
        transition: background-color 0.18s ease;
        color: $brand;
        font-size: $font-size-sm;
        font-family: $font-family-main;
        font-weight: 400;
        text-decoration: none;
        line-height: 36px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;

        &:hover,
        &.active {
          background-color: rgba($white, 1);
          border: 1px solid rgba($brand, .15);
          color: $brand;
        }
      }

      .title {
          font-size: $font-size-xxs;
          text-transform: uppercase;
          font-family: $font-family-main;
          font-weight: bold;
          color: rgba($black,0.5);
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