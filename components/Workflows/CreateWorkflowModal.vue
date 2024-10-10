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
          <div class="form-content-full">
            <h4>States</h4>
            <p class="details">Select the different states of your workflow, and order them accordingly.</p>

            <div class="states-list">
              <div class="state-selector-row" v-for="(state, index) in states" :key="index">
                <div class="form-input state-type">
                  <label for="state-type">State Type</label>
                  <select v-model="states[index]" @change="updateState(index, $event)">
                    <option v-for="stateType in stateTypes" :value="stateType.id" placeholder="Select state">{{ stateType.id }} - {{ stateType.name }}</option>
                  </select>
                </div>
                <div class="button" @click="deleteState(index)">Delete</div>
              </div>
            </div>
            <hr>
            <div class="button" @click="addState()">Add State</div>
          </div>
        </div>
      </form>
          
    </div>
    
    <div class="buttons">
      <button @click="createWorkflow(workflow)" class="primary wide">Create</button>
    </div>
  </div>
</template>

<script setup>

// Deliverables composable
import useWorkflow from '~/composables/useWorkflow';
const { createWorkflow } = useWorkflow();

// WorkflowState composable
import useWorkflowState from '~/composables/useWorkflowState'
const { listStates, StateData, StateError } = useWorkflowState()

// These are the states that will be added to the workflow
const states = ref([0]);

// And now these are the state types that will populate the select dropdown
const stateTypes = ref([]);

const loading = ref(false);
const user = useSupabaseUser();

function addState() {
  // This adds a new row to the states array
  states.value.push(0);
  console.log(states.value);
}

function deleteState(index) {
  // This removes a row from the states array
  states.value.splice(index, 1);
  console.log(states.value);
}

function updateState(index, event) {
  states.value[index] = parseInt(event.target.value, 10);
  console.log(states.value);
}

// Set some sane defaults for the workflow
const workflow = reactive({
  name: 'Workflow title',
  description: 'Quickly summarize your workflow',
  created_at: new Date(),
  states: states.value,
  type: 2, // Since all workflows are custom via the modal
  created_by: user.value.id,
  completion_step: 6, // TODO - This should be set by the user
})

onMounted(async () => {
  stateTypes.value = await listStates();
  console.log(states.value);

  console.log(workflow);
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#CreateWorkflowModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
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

  .states-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    margin-top: $spacing-md;

    .state-selector-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: $spacing-sm;

      .form-input {
        margin: 0;
      }


      button {
        background-color: $red;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
      }
    }
  }
}

</style>