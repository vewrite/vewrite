<template>
  <aside class="object-overview" v-if="deliverable">
    <div class="object-summary">
      <input class="object-title-input" v-model="props.deliverable.title" @input="updateDeliverable" />
      <input class="object-description-input" v-model="props.deliverable.description" @input="updateDeliverable" />
    </div>
  </aside>
</template>

<script setup>

import useDeliverables from '~/composables/useDeliverables';
const { saveDeliverable } = useDeliverables();

const props = defineProps({
  deliverable: {
    type: Object,
    default: null,
    required: true,
  },
});

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedSaveDeliverable = debounce(() => saveDeliverable(props.deliverable), 1000);

function updateDeliverable() {
  debouncedSaveDeliverable();
}

</script>