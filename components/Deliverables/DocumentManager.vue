<template>
  <section class="document-content">
    <!-- <pre>{{ props.DeliverableData }}</pre> -->
    <TipTapEditor v-if="props.DeliverableData && props.DeliverableData.content.hasRequirements" :deliverable="props.DeliverableData" :type="'requirements'" />
<TipTapEditor v-if="props.DeliverableData && props.DeliverableData.content.hasOutline" :deliverable="props.DeliverableData" :type="'outline'" />
<TipTapEditor v-if="props.DeliverableData && props.DeliverableData.content.hasDraft" :deliverable="props.DeliverableData" :type="'draft'" />
<TipTapEditor v-if="props.DeliverableData && props.DeliverableData.content.hasResearch" :deliverable="props.DeliverableData" :type="'research'" />
  </section>
</template>

<script setup>

const props = defineProps(['DeliverableData', 'StateData']);

/*

What I'm actually looking for here:

1. A way to display the:
  - Requirements
  - Outline
  - Deliverable + Review comments
2. Per-state to show the:
  - Assigned user
  - Due date
  - Current state
  - Button to move to the next state
  - Gate access to editing certain sections, e.g.:
      - In the NEW state, only the Requirements are editable
      - in the OUTLINE state, only the Outline is editable
      - In the WRITING state, the Deliverable is editable, but also the OUTLINE
      - in the REVIEW state, the Deliverable is editable, but you can also add comments

*/

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.document-content {
  display: flex;
  gap: $spacing-sm;
  flex-direction: column;
}

</style>