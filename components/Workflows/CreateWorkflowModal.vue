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

            <ClientOnly>
              <draggable 
                v-model="states" 
                item-key="id"
                class="states-list"
                ghost-class="ghost"
              >
                <template #item="{ element }">
                  <div class="state-selector-row">
                    <div class="grabby-mcgrab-face"></div>
                    <div class="form-input state-type">
                      <label for="state-type">State Type</label>
                      <select v-model="element.id">
                        <option value="">Select a state</option>
                        <option v-for="stateType in stateTypes" :value="stateType.id" :key="stateType.id">
                          {{ stateType.id }} - {{ stateType.name }}
                        </option>
                      </select>
                    </div>
                    <div class="button" @click="deleteState(element)">Set Actions</div>
                    <div class="button" @click="deleteState(element)">Delete</div>
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
      <button @click="createWorkflow(workflow)" class="primary wide">Create</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import draggable from 'vuedraggable'

// Deliverables composable
import useWorkflow from '~/composables/useWorkflow';
const { createWorkflow } = useWorkflow();

// WorkflowState composable
import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes'
const { listStates } = useWorkflowStateTypes()

// These are the states that will be added to the workflow
const states = ref([{ id: '' }])

// And now these are the state types that will populate the select dropdown
const stateTypes = ref([]);

const loading = ref(false);
const user = useSupabaseUser();

function addState() {
  states.value.push({ id: '' })
}

function deleteState(stateToDelete) {
  const index = states.value.findIndex(state => state === stateToDelete)
  if (index !== -1) {
    states.value.splice(index, 1)
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

watch(states, (newStates) => {
  console.log('States updated:', newStates)
}, { deep: true })

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
        width: 32px;
        height: 32px;
        background: rgba($brand, 0.05);
        border-radius: $br-sm;
        cursor: grab;
        position: relative;

        &::after {
          content: '═';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 1rem;
          color: rgba($brand, 0.2);
        }

        &:hover {
          &:after {
            color: $brand;
          }
        }
      }

      .state-type {
        width: 50%;
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