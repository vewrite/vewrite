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

            <!-- {{ states.states }} -->

            <ClientOnly>
              <draggable 
                v-model="states.states" 
                item-key="id"
                class="states-list"
                ghost-class="ghost"
              >
                <template #item="{ element }">
                  <div class="state-selector-row">
                    <div class="grabby-mcgrab-face">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 7L7 7" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                        <path d="M13 10L7 10" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                        <path d="M13 13L7 13" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                        <circle cx="10" cy="10" r="9.5" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                      </svg>

                    </div>
                    <div class="form-input state-name">
                      <label for="state-name">State Name</label>
                      <input type="text" v-model="element.state_instance.instance_name" placeholder="Name your state" />
                    </div>
                    <div class="form-input state-type">
                      <label for="state-type">State Type</label>
                      <select v-model="element.state_instance.state_type">
                        <option value="">Select a state type</option>
                        <option v-for="stateType in stateTypes" :value="stateType.id" :key="stateType.id">
                          {{ stateType.name }}
                        </option>
                      </select>
                    </div>
                    <div class="button" @click="deleteState(element)">Actions</div>
                    <div class="button red" @click="deleteState(element)">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 10L5 10" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                        <circle cx="10" cy="10" r="9.5" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                      </svg>
                    </div>
                  </div>
                </template>
              </draggable>
            </ClientOnly>

            <div v-if="states.length === 0" class="no-states">No states added yet.</div>
            <hr>
            <div class="button" @click="addState()">Add State</div>
          </div>
        </div>
      </form>
          
    </div>
    
    <div class="buttons">
      <button @click="createWorkflow(workflow, states.states)" class="primary wide">Create</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import draggable from 'vuedraggable'

const loading = ref(false);
const user = useSupabaseUser();

// Deliverables composable
import useWorkflow from '~/composables/useWorkflow';
const { createWorkflow } = useWorkflow();

// WorkflowState composable
import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes'
const { listStates } = useWorkflowStateTypes()

// These are the states that will be added to the workflow
// const states = ref([{ id: '' }])

const states = ref({
  "states": [
    {
      "id": 1,
      "state_instance": {
        "instance_name": "",       
        "created_at": new Date(),
        "state_type": 1,
        "created_by": user.value.id,
        "assigned_to": null,
        "actions": []
      }
    }
  ]
});

// And now these are the state types that will populate the select dropdown
const stateTypes = ref([]);

function addState() {
  // states.value.push({ id: '' })
  states.value.states.push(
    {
      "id": states.value.states.length + 1,
      "state_instance": {
        "instance_name": "",       
        "created_at": new Date(),
        "state_type": 1,
        "created_by": user.value.id,
        "assigned_to": null,
        "actions": []
      }
    }
  )
}

function deleteState(stateToDelete) {
  // const index = states.value.findIndex(state => state === stateToDelete)
  // if (index !== -1) {
  //   states.value.splice(index, 1)
  // }
  const index = states.value.states.findIndex(state => state === stateToDelete)
  if (index !== -1) {
    states.value.states.splice(index, 1)
  }
}

// Set some sane defaults for the workflow
const workflow = reactive({
  name: 'Workflow title',
  description: 'Quickly summarize your workflow',
  created_at: new Date(),
  states: states,
  type: 2, // Since all workflows are custom via the modal
  created_by: user.value.id,
  completion_step: 6, // TODO - This should be set by the user
})

onMounted(async () => {
  stateTypes.value = await listStates();
})

// watch(states, (newStates) => {
//   console.log('States updated:', newStates)
// }, { deep: true })

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
    gap: $spacing-xxs;
    margin-top: $spacing-md;

    .state-selector-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-xxs $spacing-xs;
      transition: background-color 0.18s ease;
      border-radius: $br-lg;

      &:hover {
        background-color: rgba($brand, 0.05);
      }

      .grabby-mcgrab-face {
        padding: 4px;
        border-radius: $br-md;
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: rgba($brand, 0.1);
        }
        &:active {
          background-color: rgba($brand, 0.15);
          cursor: grabbing;
        }
      }

      .state-type {
        width: 50%;

        select {
          text-transform: capitalize;
        }
      }

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

.ghost {
  opacity: 0.5;
  background: $gray-light;
}

.no-states {
  text-align: center;
  padding: $spacing-md;
  color: $gray-dark;
}

</style>