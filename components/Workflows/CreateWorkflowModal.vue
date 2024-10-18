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
                v-model="states.states" 
                item-key="id"
                class="states-list"
                ghost-class="ghost"
              >
                <template #item="{element}">
                  <div class="state-selector-row">

                    <div class="state-fill">


                      <div class="grabby-mcgrab-face">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13 7L7 7" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                          <path d="M13 10L7 10" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                          <path d="M13 13L7 13" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                          <circle cx="10" cy="10" r="9.5" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                        </svg>
                      </div>

                      <div class="state-content">

                        <section class="state-details">
                          <!-- <div class="state-type-icon">
                            {{ element }}
                            <img :src="StateTypeImg" alt="State type icon" />
                          </div> -->

                          <div class="form-input state-type">
                            <label for="state-type">State Type</label>
                            <select v-model="element.state_instance.state_type">
                              <option value="">Select a state type</option>
                              <option v-for="stateType in stateTypes" :value="stateType.id" :key="stateType.id">
                                {{ stateType.name }}
                              </option>
                            </select>
                          </div>

                          <div class="form-input state-name">
                            <label for="state-name">State Name</label>
                            <input type="text" v-model="element.state_instance.instance_name" placeholder="Name your state" />
                          </div> 
                          
                        </section>
                        
                        <section class="state-actions">
                          
                          <div class="state-actions-header" @click="toggleOpenState(element)" v-if="element.is_open">
                            <span>Close actions</span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 5L4.29289 1.70711C4.68342 1.31658 5.31658 1.31658 5.70711 1.70711L9 5" stroke="#1759D5" stroke-opacity="0.5" stroke-linecap="round"/>
                            </svg>
                          </div>

                          <div class="state-actions-header" @click="toggleOpenState(element)" v-else>
                            <span>Open actions</span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L4.29289 4.29289C4.68342 4.68342 5.31658 4.68342 5.70711 4.29289L9 1" stroke="#1759D5" stroke-opacity="0.5" stroke-linecap="round"/>
                            </svg>
                          </div>
                          
                          <div :class="['state-actions-body', element.is_open ? 'open' : 'closed']">
                            <div class="form-input-row">
                              <div class="form-input state-type">
                                <label for="state-on-enter">On state enter</label>
                                <select v-model="element.state_instance.actions">
                                  <option value="">Select an action</option>
                                  <option value="">Do nothing</option>
                                  <option value="">Send an email</option>
                                </select>
                              </div>
                            </div>

                            <div class="form-input-row">
                              <div class="form-input state-type">
                                <label for="state-on-enter">On state exit</label>
                                <select v-model="element.state_instance.actions">
                                  <option value="">Select an action</option>
                                  <option value="">Do nothing</option>
                                  <option value="">Send an email</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </section>
                        
                      </div>

                      <div class="delete-state" @click="deleteState(element)">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 10L5 10" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                          <circle cx="10" cy="10" r="9.5" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </ClientOnly>

            <!-- <ClientOnly>
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
            </ClientOnly> -->

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
      "is_open": false,
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

const state_type_img = ref('')

function toggleOpenState(state) {
  state.is_open = !state.is_open
}

function addState() {
  states.value.states.push(
    {
      "id": states.value.states.length + 1,
      "is_open": false,
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
    gap: $spacing-md;
    margin-top: $spacing-md;
    height: 100%;

    .state-selector-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: $br-md;
      border: 1px solid rgba($brand, 0.25); 
      height: 100%;

      &:hover {
        border: 1px solid $brand;
        box-shadow: $main-shadow;
      }

      .state-fill {
        display: flex;
        flex-direction: row;
        width: 100%;
      }

      .grabby-mcgrab-face {
        padding: $spacing-xxs;
        cursor: grab;
        height: 100%;
        display: flex;
        align-items: center;

        &:hover {
          background-color: rgba($brand, 0.1);

          svg {
            path, circle {
              stroke: $brand;
              stroke-width: 2;
            }
          }
        }
        &:active {
          background-color: rgba($brand, 0.15);
          cursor: grabbing;
        }
      }

      .state-content {
        width: 100%;
        border-left: 1px solid rgba($brand, 0.1);
        border-right: 1px solid rgba($brand, 0.1);

        .state-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: $spacing-xs;
          padding: $spacing-xs;
          width: 100%;

          .state-type-icon {
            background: $brand;
            border-radius: $br-md;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .state-name, .state-type {
            margin: 0;
          }
        }

        .state-actions {
          background: rgba($white, 0.6);

          .state-actions-header {
            padding: $spacing-xxs $spacing-sm;
            font-size: $font-size-xs;
            color: $brand;
            border-top: 1px solid rgba($brand, 0.1);
            background: rgba($brand, 0.05);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            &:hover {
              background: rgba($brand, 0.1);
            }
          }

          .state-actions-body {
            padding: 0 $spacing-xs;
            display: flex;
            flex-direction: column;
            gap: $spacing-xs;
            overflow: hidden;
            height: 0;

            &.open {
              height: auto;
              padding: $spacing-xs;
            }

            .form-input {
              margin: 0;
            }
          }
        }
      }

      .delete-state {
        height: 100%;
        padding: $spacing-xxs;
        display: flex;
        align-items: center;

        &:hover {
          background-color: rgba($red, 0.1);

          svg {
            path, circle {
              stroke: $red;
              stroke-width: 2;
            }
          }
        }
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