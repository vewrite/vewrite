<template>
  <AppPanel>
    <template v-slot:header>
      <router-link v-if="deliverable && !loading" :to="'/project/' + projectId" class="button">
        <Icon name="fluent:arrow-left-16-regular" size="1.5rem" />
      </router-link>
      <div class="app-panel-header-buttons">
        <Dropdown>
          <template v-slot:trigger>
            <Icon name="uis:ellipsis-v" size="1.15rem" />
          </template>
          <template v-slot:menu>
            <div class="dropdown-item" @click="deleteDeliverableModal()">Delete deliverable</div>
          </template>
        </Dropdown>
      </div>
    </template>
    <template v-slot:body>
      <!-- <pre v-if="DeliverableData">{{ DeliverableData }}</pre>
      <pre v-if="deliverable">{{ deliverable }}</pre> -->
      <Loading v-if="loading" />
      <aside class="object-overview" v-if="deliverable && !loading">
        <div class="object-summary">
          <input class="object-title-input" v-model="deliverable.title" @input="updateDeliverable" />
          <input class="object-description-input" v-model="deliverable.description" @input="updateDeliverable" />
        </div>
      </aside>
      <!-- <pre v-if="StateInstanceData && StateType">
        - Current state: {{ CurrentState }}
        - All states: {{ workflowStates }}
        - State instance is: {{ StateInstanceData }}
        - State type is: {{ StateType.name }}
        - Is first state: {{ isFirstState }}
        - Is last state: {{ isLastState }}
      </pre> -->
      <Loading v-if="loading" />
      <section class="deliverable-manager" v-if="DeliverableData && StateData && !loading" @stateChange="handleStateChange">
        <!-- New state -->
        <div class="deliverable-editor" v-if="DeliverableData && !loading">
          
          <!-- Internal Editor  -->
          <TipTapEditor v-if="DeliverableData.content.type == 'markdown'" :deliverable="DeliverableData" />
           
           <!-- External Link -->
           <section class="external-link" v-if="DeliverableData.content.type == 'link'" >
            <section class="instruction-set">
              <p class="instruction-information">{{ StateData.name }} deliverable</p>
              <p>{{ StateData.description }}</p>
              <section class="link-set">
                <section class="link-content">
                  <div class="form-input">
                    <label for="external-link">This state's content location</label>
                    <input name="external-link" class="link-value" type="text" v-model="DeliverableData.content.content" @input="updateDeliContent" />
                  </div>
                  <button class="button primary large" @click="openInNewTab(DeliverableData.content.content)">
                    <Icon name="fluent:open-16-regular" size="1.5rem" />
                  </button>
                  <button class="button large" @click="copyToClipboard(DeliverableData.content.content)">
                    <Icon name="fluent:copy-16-regular" size="1.5rem" />
                  </button>
                </section>
              </section>
            </section>

            <section class="external-link-warning notification warning" v-if="DeliverableData.content.content == ''">
              This deliverable does not have a link assigned. It's your job to create a new document and paste the link here.
            </section>
            
          </section>
        </div>
      </section>
      <StateManager v-if="deliverable && workflowStates" :deliverable="deliverable" :states="workflowStates" />
    </template>
  </AppPanel>
</template>

<script setup>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';
import StateManager from '~/components/States/StateManager.vue';

const supabase = useSupabaseClient();
const loading = ref(true);
const projectId = ref(null);
const route = useRoute();
const deliverableId = route.params.id;
const deliverable = ref(null);
const workflowStates = ref([]);
// const CurrentState = ref(null);
const isFirstState = ref(false);
const isLastState = ref(false);

// useDeliverable composable
import useDeliverables from '~/composables/useDeliverables';
const { saveDeliverable, fetchSingleProjectDeliverableByState, fetchDeliverableState, DeliverableWorkflowStateData, updateDeliverableContent, deleteDeliverableModal, DeliverableData, DeliverableError } = useDeliverables();

// useWorkflowStateInstances composable
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, StateInstanceData } = useWorkflowStateInstances();

// useWorkflowStateTypes composable
import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
const { fetchSingleState, StateData } = useWorkflowStateTypes();

// useUtils composable
import useUtils from '~/composables/useUtils';
const { copyToClipboard, openInNewTab } = useUtils();

// TODO - migrate to composable
async function getDeliverable(id) {
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if(data.description === null) {
      data.description = 'No description provided';
    }

    deliverable.value = data;

    projectId.value = data.project;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function fetchWorkflowStates() {
  try {
    loading.value = true;
    // 1. Get the current deliverable ID
    const deliverableId = route.params.id;

    // 2. Get the project ID from the deliverable
    const { data: deliverableData, error: deliverableError } = await supabase
      .from('deliverables')
      .select('project')
      .eq('id', deliverableId)
      .single();

    if (deliverableError) throw deliverableError;

    const projectId = deliverableData.project;

    // 3. Get the workflow ID from the project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('workflow')
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;

    const workflowId = projectData.workflow;

    // 4. Get the workflow states instances array from the workflow
    const { data: workflowData, error: workflowError } = await supabase
      .from('workflows')
      .select('states')
      .eq('id', workflowId)
      .single();

    if (workflowError) throw workflowError;

    workflowStates.value = workflowData.states;

    if (workflowStates.value[0] === DeliverableWorkflowStateData.value) {
      isFirstState.value = true;
    }

    if (workflowStates.value[workflowStates.value.length - 1] === DeliverableWorkflowStateData.value) {
      isLastState.value = true;
    }

  } catch (error) {
    console.error('Error fetching workflow states:', error);
  } finally {
    loading.value = false;
  }
}

async function handleStateChange({ deliverableId, newState }){
  console.log('State changed:', deliverableId, newState);
}

import { useDeliverableStore } from '~/stores/deliverable';
const deliverableStore = useDeliverableStore();

watch(
  () => deliverableStore.stateInstanceId,
  async () => {
    refreshDeliverable();
  }
);

async function refreshDeliverable() {
  loading.value = true;
  await fetchDeliverableState(deliverableId);
  await getDeliverable(deliverableId);
  await fetchSingleProjectDeliverableByState(deliverableId, DeliverableWorkflowStateData.value);
  await fetchWorkflowStates();
  await fetchSingleStateInstance(DeliverableWorkflowStateData.value);
  await fetchSingleState(StateInstanceData.value[0].state_type);
  loading.value = false;
}

onMounted(async () => {
  try {
    const subscription = supabase
      .from('deliverables')
      .on('UPDATE', payload => {
        loading.value = true;
        fetchDeliverableState(deliverableId);
        getDeliverable(deliverableId);
        fetchSingleProjectDeliverableByState(deliverableId, DeliverableWorkflowStateData.value);
        fetchWorkflowStates();
        fetchSingleStateInstance(DeliverableWorkflowStateData.value);
        fetchSingleState(StateInstanceData.value[0].state_type);
        loading.value = false;
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeSubscription(subscription);
    });

    refreshDeliverable();

  } catch (error) {
    console.error(error);
  }
});

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedSaveDeliverable = debounce(() => saveDeliverable(deliverable.value), 1000);
const debouncedUpdateDeliverableContent = debounce(() => updateDeliverableContent(DeliverableData.value.deliverable_id, DeliverableData.value.stateinstance_id, DeliverableData.value.content), 1000);

function updateDeliverable() {
  debouncedSaveDeliverable();
}

function updateDeliContent() {
  debouncedUpdateDeliverableContent();
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverable-overview {
  width: calc(100%);
  padding: $spacing-md;
  border-radius: $br-md;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-md;
  height: 140px;

  .deliverable-summary {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 50%;

    .deliverable-title-input {
      font-family: $font-family-secondary;
      font-size: $font-size-lg;
      font-weight: 500;
      margin: 0 -0.85rem;
      background-color: transparent;
      width: 100%;
      padding: $spacing-xs;

      &:focus,
      &:active {
        border: 1px solid $brand;
        background: $white;
      }
    }

    .deliverable-title-description {
      font-family: $font-family-main;
      font-size: $font-size-sm;
      color: $gray-dark;
      font-weight: 400;
      margin: -10px -0.85rem 0 -0.85rem;
      background-color: transparent;
      width: 100%;
      padding: $spacing-xs;

      &:focus,
      &:active {
        border: 1px solid $brand;
        background: $white;
        color: $black;
      }
    }

    p {
      font-size: $font-size-sm;
      font-weight: 400;
      margin: 0;
    }
  }
}

.deliverable-manager {
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px - 80px);
  background-color: $white;

  @media (max-width: 600px) {
    height: calc(100% - 110px - 80px);
  }

  .toggle-information {
    position: absolute;
    bottom: $spacing-sm;
    left: $spacing-sm;
    z-index: 1;
    background-color: rgba($white, 0.15);
    backdrop-filter: blur(10px);
    border-radius: $br-lg;
    box-shadow: $big-shadow;
    padding: $spacing-xs;
    color: $brand;
  }

  .deliverable-instruction {
    padding: $spacing-md;
    font-size: $font-size-sm;
    background-color: rgba($white, 0.15);
    backdrop-filter: blur(10px);
    border-radius: $br-lg;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    align-self: center;
    gap: $spacing-xs;
    max-width: 400px;
    width: calc(100% - 2 * $spacing-sm);
    position: absolute;
    bottom: $spacing-sm;
    left: $spacing-sm;
    box-shadow: $big-shadow;
    z-index: 1;

    .deliverable-instruction-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      gap: $spacing-md;

      section {
        display: flex;
        flex-direction: column;
        gap: $spacing-xxs;
      }

      h4 {
        font-size: $font-size-sm;
        font-weight: bold;
        margin: 0;
      }

      p {
        font-size: $font-size-sm;
        font-weight: 400;
        margin: 0;
        opacity: 0.5;

        &.instruction-information {
          font-size: $font-size-sm;
          font-weight: 500;
          text-transform: uppercase;
          opacity: 1;
          color: $brand;
          border-radius: $br-md;
        }
      }
    }
  }

  .deliverable-editor {
    width: 100%;
    height: calc(100%);
    padding: 0;
    background-color: rgba($white, 0.025);

    .external-link {
      width: calc(100% - 2 * $spacing-sm);
      height: calc(100% - $spacing-sm);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: $br-lg;
      margin: $spacing-sm $spacing-sm 0 ;
      background: rgba($black, 0.05);

      .instruction-set {
        width: calc(100% - 2 * $spacing-sm);
        max-width: 600px;
        background: $white;
        border-radius: $br-lg;
        padding: $spacing-md;
        margin: $spacing-sm;
        display: flex;
        flex-direction: column;
        gap: $spacing-xxs;
        box-shadow: $main-shadow;

        p {
          margin: 0;
        }

        .instruction-information {
          color: $brand;
          text-transform: capitalize;
        }
      }

      .link-set {
        display: flex;
        gap: $spacing-xs;
        flex-direction: column;
        margin-top: $spacing-sm;

        .link-content {
          display: flex;
          flex-direction: row;
          gap: $spacing-xs;
          width: 100%;

          @media (max-width: 600px) {
            flex-direction: column;
          }
          
          .form-input {
            margin: 0;
          }

          input {
            width: 100%;
          }
        }
      }

      .link-value {
        align-self: center;
        width: auto;
        padding: $spacing-xs;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
      }
    }

    .external-link-warning {
      max-width: 600px;
    }
  }
}


</style>