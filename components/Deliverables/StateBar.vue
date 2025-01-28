<template>
  <section class="state-buttons">
    <div v-if="props.StateData[0].state_type === 1">
      <button class="button primary">Get Started</button>
    </div>
    <div v-if="props.StateData[0].state_type === 7">
      <button class="button primary">Start Outline</button>
    </div>
    <div v-if="props.StateData[0].state_type === 3">
      <button class="button">Back to Research</button>
      <button class="button primary">Send for Review</button>
    </div>
    <div v-if="props.StateData[0].state_type === 5">
      <button class="button">Send back to Writer</button>
      <button class="button primary">Approve</button>
    </div>
    <div v-if="props.StateData[0].state_type === 4">
      <button class="button primary">Send for Review</button>
    </div>
    <div v-if="props.StateData[0].state_type === 6">
      <button class="button primary">Download</button>
    </div>
  </section>
</template>

<script setup>

const props = defineProps(['StateData']);

/* 

Standard workflow is:

[
  43, // Getting started (new)
  44, // Gathering information (research)
  45, // Outline (outline)
  46, // Review (outline review)
  47, // Writing (writing)
  48, // Review (writing review)
  49  // Approved (approved)
]

StateTypes reference:

1. new
2. ready
3. outline
4. writing
5. review
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
  flex-direction: row;
  justify-content: flex-end;
  gap: $spacing-sm;
  padding: $spacing-sm;
  background: rgba($white, 0.1);
  backdrop-filter: blur(10px);
}

</style>