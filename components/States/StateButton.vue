<template>
  <div class="state-button">

    <div class="display" v-if="type == 'displayCurrent'">
      <span v-if="StateInstanceData">
        <small>Current State</small>
        <p>{{ StateInstanceData[0].instance_name }}</p>
      </span> 
    </div>

    <div v-if="type == 'disabledPrev'">
      <div class="button disabled" disabled>
        <Icon name="mdi:chevron-left" size="1.5rem" />
        <p>Prev state</p>
      </div> 
    </div>

    <div v-if="type == 'moveToPrev'">
      <div class="button" v-if="StateInstanceData" @click="updateDeliverableWorkflowState(deliverableId, state)">
        <Icon name="mdi:chevron-left" size="1.5rem" />
        <p>Prev state</p>
      </div> 
    </div>

    <div v-if="type == 'moveToNext'">
      <div class="button" v-if="StateInstanceData" @click="updateDeliverableWorkflowState(deliverableId, state)">
        <p>Next state</p>
        <Icon name="mdi:chevron-right" size="1.5rem" />
      </div> 
    </div>

    <div v-if="type == 'disabledNext'">
      <div class="button disabled" disabled>
        <p>Next state</p>
        <Icon name="mdi:chevron-right" size="1.5rem" />
      </div> 
    </div>

  </div>
</template>

<script setup>

const props = defineProps(['deliverableId', 'state', 'type']);

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, StateInstanceData, StateInstanceError } = useWorkflowStateInstances();

import useDeliverables from '~/composables/useDeliverables';
const { updateDeliverableWorkflowState } = useDeliverables();

onMounted(async () => {
  await fetchSingleStateInstance(props.state);
});

watch(() => props.state, async () => {
  await fetchSingleStateInstance(props.state);
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