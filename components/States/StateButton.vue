<template>
  <div class="state-button">

    <div v-if="type == 'disabledPrev'">
      <div class="button disabled" disabled>
        <p>No state</p>
      </div> 
    </div>

    <div v-if="type == 'moveToPrev'">
      <div class="button" v-if="StateInstanceData" @click="handleStateChange(deliverableId, state)">
        <Icon name="mdi:chevron-left" size="1.5rem" />
        <p>{{ StateInstanceData[0].instance_name }}</p>
      </div> 
    </div>

    <div v-if="type == 'moveToNext'">
      <div class="button primary" v-if="StateInstanceData" @click="handleStateChange(deliverableId, state)">
        <p>{{ StateInstanceData[0].instance_name }}</p>
        <Icon name="mdi:chevron-right" size="1.5rem" />
      </div> 
    </div>

    <div v-if="type == 'disabledNext'">
      <div class="button disabled" disabled>
        <p>No state</p>
      </div> 
    </div>

  </div>
</template>

<script setup>

const props = defineProps(['deliverableId', 'state', 'type']);
const StateInstanceData = ref(null);

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance } = useWorkflowStateInstances();

import useDeliverables from '~/composables/useDeliverables';
const { updateDeliverableWorkflowState } = useDeliverables();

import { useDeliverableStore } from '~/stores/deliverable';
const deliverableStore = useDeliverableStore();

async function handleStateChange() {
  console.log('State button setting deliverableStore', props.deliverableId, props.state);
  await updateDeliverableWorkflowState(props.deliverableId, props.state);
  deliverableStore.setDeliverableState(props.deliverableId, props.state);
}

onMounted(async () => {
  if(props.state){
    StateInstanceData.value = await fetchSingleStateInstance(props.state);
  }
});

watch(() => props.state, async () => {
  StateInstanceData.value = await fetchSingleStateInstance(props.state);
});



</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.state-button {

  .display span {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-xxxs $spacing-sm;
    font-size: $font-size-xs;
    font-weight: 500;
    border-radius: $br-md;
    background-color: rgba($brand, 0.05);
    height: 100%;
    min-width: 200px;
  }

  small {
    color: rgba($black, 0.5);
    text-wrap: nowrap;
    margin: 0;
  }

  p {
    margin: 0;
    text-wrap: nowrap;
  }
}

</style>