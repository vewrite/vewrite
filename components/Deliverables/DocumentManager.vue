<template>
  <section class="document-content">
    <pre>{{ props.DeliverableData }}</pre>
    <pre>{{ props.StateData }}</pre>
  </section>
</template>

<script setup>

const props = defineProps(['DeliverableData', 'StateData']);

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.document-content {
  display: flex;
  flex-direction: row;
  gap: $spacing-sm;
  height: 100%;
  padding: $spacing-sm;
  overflow: auto;
  scrollbar-width: thin;

}

</style>