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
        <div :class="['single-workflow', visibleWorkflow == workflow.id ? 'active' : '']" v-if="customWorkflows" v-for="workflow in customWorkflows" @click="showWorkflowPreview(workflow.id)">{{ workflow.name }}</div>
        <div class="single-workflow-empty" v-if="customWorkflows.length == 0">No custom workflows</div>
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
            <Dropdown>
              <template v-slot:trigger>
                <svg width="2" height="10" viewBox="0 0 2 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1ZM2 5C2 5.55228 1.55228 6 1 6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4C1.55228 4 2 4.44772 2 5ZM1 10C1.55228 10 2 9.55229 2 9C2 8.44771 1.55228 8 1 8C0.447715 8 0 8.44771 0 9C0 9.55229 0.447715 10 1 10Z" fill="black"/>
                </svg>
              </template>
              <template v-slot:menu>
                <div class="dropdown-item" @click="deleteWorkflowModal(workflow.id)">Delete workflow</div>
              </template>
            </Dropdown>
          </div>
        </div>
        <aside class="states-list">
          <div class="state" v-for="state in workflow.states" :key="state.id">
             <State :state="state" />
          </div>
        </aside>
      </div>
    </div>
    <div class="inner-container" v-if="!loading && workflows.length == 0">
      <p>No workflows found.</p>
    </div>
  </main>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import State from '/components/Workflows/State.vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const workflows = ref([])
const defaultWorkflows = ref([])
const customWorkflows = ref([])
const loading = ref(true)
const visibleWorkflow = ref(1)

import useWorkflow from '~/composables/useWorkflow'
const { deleteWorkflowModal, fetchWorkflows } = useWorkflow()

function showWorkflowPreview(workflowId) {
  visibleWorkflow.value = workflowId
}

onMounted(async () => {
  // Register onUnmounted before any await statements
  const subscription = supabase
    .from('workflows')
    .on('INSERT', async payload => {
      loading.value = true;
      workflows.value.push(payload.new);
      customWorkflows.value.push(payload.new);
      workflows.value = await fetchWorkflows(user.value.id);
      loading.value = false;
    })
    .on('DELETE', payload => {
      loading.value = true;
      workflows.value = workflows.value.filter(workflow => workflow.id !== payload.old.id);
      defaultWorkflows.value = defaultWorkflows.value.filter(workflow => workflow.id !== payload.old.id);
      customWorkflows.value = customWorkflows.value.filter(workflow => workflow.id !== payload.old.id);
      
      // After deletion, reset the visible workflow to null to show the empty state
      visibleWorkflow.value = null;
      loading.value = false;
    })
    .subscribe();

  onUnmounted(() => {
    supabase.removeSubscription(subscription);
  });

  workflows.value = await fetchWorkflows(user.value.id);

  loading.value = false;
});

onMounted(async () => {
  try {
    workflows.value = await fetchWorkflows(user.value.id)
    // Set default workflows (where type == 1)
    defaultWorkflows.value = workflows.value.filter(workflow => workflow.type === 1)
    // Set custom workflows (where type == 2, and belongs to this authenticated user)
    customWorkflows.value = workflows.value.filter(workflow => workflow.type === 2 && workflow.user_id === supabase.auth.user.id)
  } catch (error) {
    console.error("Error fetching workflows: ", error.message)
  }
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

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
    background: rgba($brand, 0.035);
    padding: $spacing-sm;

    .workflow-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: $spacing-md;

      .single-workflow {
        display: block;
        padding: 0 $spacing-xs;
        border-radius: $br-md;
        transition: background-color 0.18s ease;
        color: $black;
        font-size: $font-size-xs;
        font-family: $font-family-main;
        font-weight: bold;
        text-decoration: none;
        line-height: 36px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;

        &:hover,
        &.active {
          background-color: rgba($brand, .075);
          color: $brand;
        }
      }

      .single-workflow-empty {
        color: rgba($black, 0.5);
        font-size: $font-size-xs;
        padding: 0 $spacing-xs;
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
    background-color: $white;

    .single-workflow-preview {
      display: none;

      .single-workflow-preview-header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: $spacing-md;
          padding: $spacing-md;

          h3 {
            margin-bottom: $spacing-xxs;
          }

          p {
            color: $gray-dark;
            font-size: $font-size-sm;
            margin: 0;
          }
        }

      &.active {
        display: block;
      }
    }
  }

  .states-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-xxs;
    padding: $spacing-sm;
    background: white;
    border-radius: $br-lg;
  }
}

</style>