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
                          <div class="state-type-icon">
                            <StateImage :state="element.state_instance.state_type" />
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

                          <div class="form-input state-name">
                            <label for="state-name">State Name</label>
                            <input type="text" v-model="element.state_instance.instance_name" placeholder="Name your state" />
                          </div> 
                          
                        </section>
                        
                        <section class="state-actions">
                          
                          <div class="state-actions-header" @click="toggleOpenState(element)" v-if="element.is_open">
                            <span>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z" stroke="black" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12.8659 4.39969L12.367 3.60031C12.0917 3.15862 11.4815 3.00769 11.0041 3.26246L10.7416 3.40277C9.74383 3.93538 8.49659 3.26938 8.49659 2.20369V1.92308C8.49659 1.41308 8.05007 1 7.49879 1H6.50099C5.94971 1 5.50319 1.41308 5.50319 1.92308V2.20369C5.50319 3.26938 4.25594 3.93585 3.25815 3.40277L2.99573 3.26246C2.51828 3.00769 1.90813 3.15862 1.63273 3.60031L1.13383 4.39969C0.858442 4.84138 1.02158 5.40585 1.49903 5.66062L1.76145 5.80092C2.75925 6.334 2.75925 7.666 1.76145 8.19908L1.49903 8.33938C1.02158 8.59415 0.858442 9.15862 1.13383 9.60031L1.63273 10.3997C1.90813 10.8414 2.51828 10.9923 2.99573 10.7375L3.25815 10.5972C4.25594 10.0642 5.50319 10.7306 5.50319 11.7963V12.0769C5.50319 12.5869 5.94971 13 6.50099 13H7.49879C8.05007 13 8.49659 12.5869 8.49659 12.0769V11.7963C8.49659 10.7306 9.74383 10.0642 10.7416 10.5972L11.0041 10.7375C11.4815 10.9923 12.0917 10.8414 12.367 10.3997L12.8659 9.60031C13.1413 9.15862 12.9782 8.59415 12.5008 8.33938L12.2383 8.19908C11.2405 7.666 11.2405 6.334 12.2383 5.80092L12.5008 5.66062C12.9782 5.40585 13.1418 4.84138 12.8659 4.39969Z" stroke="black" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              Close state actions
                            </span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 5L4.29289 1.70711C4.68342 1.31658 5.31658 1.31658 5.70711 1.70711L9 5" stroke="#1759D5" stroke-opacity="0.5" stroke-linecap="round"/>
                            </svg>
                          </div>

                          <div class="state-actions-header" @click="toggleOpenState(element)" v-else>
                            <span>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z" stroke="black" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12.8659 4.39969L12.367 3.60031C12.0917 3.15862 11.4815 3.00769 11.0041 3.26246L10.7416 3.40277C9.74383 3.93538 8.49659 3.26938 8.49659 2.20369V1.92308C8.49659 1.41308 8.05007 1 7.49879 1H6.50099C5.94971 1 5.50319 1.41308 5.50319 1.92308V2.20369C5.50319 3.26938 4.25594 3.93585 3.25815 3.40277L2.99573 3.26246C2.51828 3.00769 1.90813 3.15862 1.63273 3.60031L1.13383 4.39969C0.858442 4.84138 1.02158 5.40585 1.49903 5.66062L1.76145 5.80092C2.75925 6.334 2.75925 7.666 1.76145 8.19908L1.49903 8.33938C1.02158 8.59415 0.858442 9.15862 1.13383 9.60031L1.63273 10.3997C1.90813 10.8414 2.51828 10.9923 2.99573 10.7375L3.25815 10.5972C4.25594 10.0642 5.50319 10.7306 5.50319 11.7963V12.0769C5.50319 12.5869 5.94971 13 6.50099 13H7.49879C8.05007 13 8.49659 12.5869 8.49659 12.0769V11.7963C8.49659 10.7306 9.74383 10.0642 10.7416 10.5972L11.0041 10.7375C11.4815 10.9923 12.0917 10.8414 12.367 10.3997L12.8659 9.60031C13.1413 9.15862 12.9782 8.59415 12.5008 8.33938L12.2383 8.19908C11.2405 7.666 11.2405 6.334 12.2383 5.80092L12.5008 5.66062C12.9782 5.40585 13.1418 4.84138 12.8659 4.39969Z" stroke="black" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              Open state actions
                            </span>
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

            <div v-if="states.length === 0" class="no-states">No states added yet.</div>
            
            <div class="button primary add-new-state" @click="addState()">
              <Icon name="fluent-mdl2:circle-plus" size="1.5rem" />
            </div>

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
import StateImage from '~/components/Workflows/StateImage.vue'

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

const stateTypes = ref([]);

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

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

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

  .add-new-state {
    align-self: center;
    margin-top: $spacing-xs;
    padding: $spacing-xs;
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
    height: 100%;
    background: rgba($brand, 0.05);
    border-radius: $br-lg;
    overflow-y: auto;
    max-height: 440px;
    padding: $spacing-sm;

    .state-selector-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: $br-md;
      height: 100%;
      background: $white;

      &:last-child {
        border-bottom: none;
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
          grid-template-columns: 60px 1fr 1fr;
          gap: $spacing-xs;
          padding: $spacing-xs;
          width: 100%;

          .state-type-icon {
            background: $white;
            border-radius: $br-md;
            border: $border;
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
            padding: 0 $spacing-sm $spacing-sm calc(60px + $spacing-md);
            font-size: $font-size-xs;
            color: $brand;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: $spacing-xs;
            align-items: center;
            width: 100%;
            color: $gray-dark;

            span {
              display: flex;
              align-items: center;
              gap: 2px;
            }

            svg {
              path {
                stroke: $gray-dark;
              }
            }

            &:hover {
              color: $brand;

              svg {
                path {
                  stroke: $brand;
                }
              }
            }
          }

          .state-actions-body {
            padding: 0 $spacing-xs;
            display: flex;
            flex-direction: column;
            gap: $spacing-xs;
            overflow: hidden;
            height: 0;
            transition: height 0.2s ease;

            .form-input-row {
              margin-left: calc(60px + $spacing-xs);
              width: calc(100% - 60px);

              .form-input {
                margin: 0;
                width: 100%;
              }
            }

            &.open {
              height: 136px;
              padding: 0 $spacing-xs $spacing-xs;
              overflow: visible;
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
  opacity: 0.8;
  background: $white;
  transform: rotate(12deg) scale(0.8);
  outline: 1px solid $brand;
}

.no-states {
  text-align: center;
  padding: $spacing-md;
  color: $gray-dark;
}

</style>