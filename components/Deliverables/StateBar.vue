<template>
  <section class="state-buttons">

    <!-- {{StateData}} -->

    <!-- Project just started (43) -->
    <div v-if="props.StateData[0].state_type === 1">
      <button class="button primary" @click="handleState(DeliverableData.id, 44)">Get started</button>
    </div>
    
    <!-- Is in research state (44) -->
    <div v-if="props.StateData[0].state_type === 7">
      <button class="button primary" @click="handleState(DeliverableData.id, 45)">Start outline</button>
    </div>
    
    <!-- Is in outline state (45) -->
    <div v-if="props.StateData[0].state_type === 3">
      <button class="button primary" @click="handleState(DeliverableData.id, 44)">Back to research</button>
      <button class="button primary" @click="handleState(DeliverableData.id, 46)">Send for review</button>
    </div>
    
    <!-- Is in outline review state (46) -->
    <div v-if="props.StateData[0].state_type === 2">
      <button class="button primary" @click="handleState(DeliverableData.id, 45)">Send back to writer</button>
      <button class="button primary" @click="handleState(DeliverableData.id, 47)">Approve outline</button>
    </div>

    <!-- Is in Writing state (47) -->
    <div v-if="props.StateData[0].state_type === 4"> 
      <button class="button primary" @click="handleState(DeliverableData.id, 48)">Send for review</button>
    </div>

    <!-- Is in draft review state (48) -->
    <div v-if="props.StateData[0].state_type === 5">
      <button class="button primary" @click="handleState(DeliverableData.id, 47)">Send back to writer</button>
      <button class="button primary" @click="handleState(DeliverableData.id, 49)">Approve draft</button>
    </div>
    
    <!-- Is approved (49) -->
    <div v-if="props.StateData[0].state_type === 6">
      <button class="button primary">Download deliverable</button>
    </div>

  </section>
</template>

<script setup>

const props = defineProps(['StateData', 'DeliverableData']);

import useDeliverables from '~/composables/useDeliverables';
const { updateDeliverableWorkflowState } = useDeliverables();
const loading = ref(false);

import { useDeliverableStore } from '~/stores/deliverable';
const deliverableStore = useDeliverableStore();

async function handleState(stateId, stateType) {
  loading.value = true;
  try {
    console.log(stateId, stateType);
    
    await updateDeliverableWorkflowState(stateId, stateType);
    
    // Set the deliverable state in the store
    console.log('Setting deliverable state:', stateType);
    deliverableStore.setDeliverableState(props.DeliverableData.id, stateType);
    
    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

/* 

Standard workflow is:

[
  43, // Getting started (new)
  44, // Gathering information (research)
  45, // Outline (outline)
  46, // Outline Review (outline review)
  47, // Writing (writing)
  48, // Draft Review (writing review)
  49  // Approved (approved)
]

StateTypes reference:

1. new
2. outline review
3. outline
4. writing
5. draft review
6. approved
7. research
8. holding

Each state type has a different set of buttons that we should show at appropriate times

1. "Getting Started" should show "Get Started"
2. "Gathering Information" should show "Start Outline"
3. "Outline" should show "Send for Review" and "Back to Research"
4. "Review" should show "Approve Outline" and "Send back to Writer"
5. "Writing" should show "Send for Review"
6. "Review" should show "Approve Draft" and "Send back to Writer"
7. "Approved" should show "Download"

*/

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.state-buttons div {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: $spacing-sm;
  padding: $spacing-sm 0;
  background: rgba($white, 0.1);
  backdrop-filter: blur(10px);
}

</style>