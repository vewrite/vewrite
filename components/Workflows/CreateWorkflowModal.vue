<template>
  <div id="CreateWorkflowModal">
    <div class="modal-body">
      <Loading v-if="loading" />
      <form class="inner-container" v-if="!loading" @submit.prevent="createWorkflow(workflow)">

        <div class="form-block">
          <div class="form-content-full">
            <div class="form-input">
              <label for="name">Name</label>
              <input v-model="workflow.name" id="name" type="text" placeholder="Input your workflow's name" />
            </div>
            <div class="form-input">
              <label for="description">Description</label>
              <input v-model="workflow.description" id="description" type="text" placeholder="Quickly summarize your workflow" />
            </div>
          </div>
        </div>

        <div class="form-block">
          <div class="form-details">
            <h4>States</h4>
            <p class="details">Select the different states of your workflow, and order them accordingly.</p>
          </div>
          <div class="form-content">
            States go here
          </div>
        </div>
      </form>
          
    </div>
    
    <div class="buttons">
      <button @click="createWorkflow(workflow)" class="primary">Create</button>
    </div>
  </div>
</template>

<script setup>

// Deliverables composable
import useWorkflow from '~/composables/useWorkflow';
const { createWorkflow } = useWorkflow();

const loading = ref(false);
const user = useSupabaseUser();

// Set some sane defaults for the workflow
const workflow = reactive({
  name: 'Workflow title',
  description: 'Quickly summarize your workflow',
  created_at: new Date(),
  states: [1,2,3,4,5],
  type: 2, // Since all workflows are custom via the modal
  created_by: user.value.id,
  completion_step: 6, // TODO - This should be set by the user
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#CreateWorkflowModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  width: 100%;

  .modal-body {
    width: 100%;

    p {
      margin: 0;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-sm;
      color: $red;
    }
  }
}

</style>