<template>
  <section class="state-manager" v-if="states">
    <div class="button">
      {{ previousPositionInWorkflow !== null ? states[previousPositionInWorkflow] : 'No previous state' }}
    </div>
    <div v-for="state in states" :key="state">
      <StateButton :state="state" v-if="deliverable.workflow_state === state" />
    </div>
    <div class="button">
      {{ nextPositionInWorkflow !== null ? states[nextPositionInWorkflow] : 'No next state' }}
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StateButton from '~/components/States/StateButton.vue';

const props = defineProps(['deliverable', 'states']);

const currentPositionInWorkflow = ref(null);
const previousPositionInWorkflow = ref(null);
const nextPositionInWorkflow = ref(null);

onMounted(() => {
  // Define the current item (e.g., based on deliverable's current state)
  const currentItem = props.deliverable.workflow_state;
  console.log('Current Item:', currentItem);
  console.log('States:', props.states);

  // Use findIndex to get the position of the current item in the states array
  currentPositionInWorkflow.value = props.states.findIndex((state) => state === currentItem);

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

  console.log('Current State Position:', currentPositionInWorkflow.value);
  console.log('Previous State Position:', previousPositionInWorkflow.value);
  console.log('Next State Position:', nextPositionInWorkflow.value);
});
</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.state-manager {
  display: flex;
  flex-direction: row;
  align-items: center;
}

</style>