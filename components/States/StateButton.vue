<template>
  <div class="state-button">

    <div class="display" v-if="type == 'displayCurrent'">
      <Loading v-if="loading" type="small" />
      <span v-if="StateInstanceData && !loading">
        <small>Current State</small>
        <p>{{ StateInstanceData[0].instance_name }}</p>
      </span> 
    </div>

    <div v-if="type == 'moveTo'">
      <Loading v-if="loading" type="small" />
      <div class="button vertical" v-if="StateInstanceData && !loading" @click="updateDeliverableWorkflowState(deliverableId, state)">
        <small>Move to</small>
        <p>{{ StateInstanceData[0].instance_name }}</p>
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

const loading = ref(true);

onMounted(async () => {
  await fetchSingleStateInstance(props.state);
  loading.value = false;
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