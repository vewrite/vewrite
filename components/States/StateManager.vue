<template>
  <section class="state-manager" v-if="props.states.length > 0">
    <StateButton :deliverableId="deliverable.id" :state="states[previousPositionInWorkflow]" type="moveTo" />
    <StateButton :deliverableId="deliverable.id" :state="deliverable.workflow_state" type="displayCurrent" />
    <StateButton :deliverableId="deliverable.id" :state="states[nextPositionInWorkflow]" type="moveTo" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StateButton from '~/components/States/StateButton.vue';

const props = defineProps(['deliverable', 'states']);

const currentPositionInWorkflow = ref(null);
const previousPositionInWorkflow = ref(null);
const nextPositionInWorkflow = ref(null);

watch(() => props.states, () => {
  console.log('Got props.states:', props.states);
  currentPositionInWorkflow.value = props.states.findIndex((state) => state == props.deliverable.workflow_state);

  // Calculate the previous position
  if (currentPositionInWorkflow.value > 0) {
    previousPositionInWorkflow.value = currentPositionInWorkflow.value - 1;
  } else {
    previousPositionInWorkflow.value = null; // No previous position if current is the first
  }

  // Calculate the next position
  if (currentPositionInWorkflow.value < props.states.length - 1) {
    nextPositionInWorkflow.value = currentPositionInWorkflow.value + 1;
  } else {
    nextPositionInWorkflow.value = null; // No next position if current is the last
  }
});

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.state-manager {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: $spacing-xxs;
  height: 100%;
}

</style>