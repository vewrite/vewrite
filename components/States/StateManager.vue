<template>
  <!-- <span>{{ previousPositionInWorkflow }}</span>
  <span>{{ currentPositionInWorkflow }}</span>
  <span>{{ nextPositionInWorkflow }}</span> -->
  <section class="state-manager" v-if="props.states.length > 0">
    <Loading v-if="loading" type="small" />
    <StateButton v-if="!loading && previousPositionInWorkflow == 0" type="disabledPrev" />
    <StateButton v-if="!loading && currentPositionInWorkflow > 1" :deliverableId="deliverable.id" :state="states[previousPositionInWorkflow]" type="moveToPrev" />
    <StateButton v-if="!loading" :deliverableId="deliverable.id" :state="deliverable.workflow_state" type="displayCurrent" />
    <StateButton v-if="!loading && currentPositionInWorkflow < states.length - 1" :deliverableId="deliverable.id" :state="states[nextPositionInWorkflow]" type="moveToNext" />
    <StateButton v-if="!loading && currentPositionInWorkflow >= states.length - 1" type="disabledNext" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StateButton from '~/components/States/StateButton.vue';

const props = defineProps(['deliverable', 'states']);

const currentPositionInWorkflow = ref(null);
const previousPositionInWorkflow = ref(null);
const nextPositionInWorkflow = ref(null);

const loading = ref(true);

watch(() => props.states, () => {
  loading.value = true;
  currentPositionInWorkflow.value = props.states.findIndex((state) => state == props.deliverable.workflow_state);
  
  if (currentPositionInWorkflow.value == 0) {
    previousPositionInWorkflow.value = 0;
  } else {
    previousPositionInWorkflow.value = currentPositionInWorkflow.value - 1;
  }
  
  if (currentPositionInWorkflow.value == props.states.length - 1) {
    nextPositionInWorkflow.value = props.states.length;
  } else {
    nextPositionInWorkflow.value = currentPositionInWorkflow.value + 1;
  }
  
  loading.value = false;
});

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.state-manager {
  display: flex;
  flex-direction: row;
  flex: 1 3 1;
  align-items: center;
  gap: $spacing-xxs;
  height: 100%;
}

</style>