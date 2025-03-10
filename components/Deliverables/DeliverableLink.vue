<template>
  <div class="form-input">
    <Loading class="load" v-if="saving" type="tiny" />
    <label for="l">External link</label>
    <input id="l" type="text" v-model="localLink" placeholder="Paste a link here" @input="updateLink" />
  </div>
</template>

<script setup>

import { ref, watch } from 'vue';

import useDeliverables from '~/composables/useDeliverables';
const { saveDeliverableContent } = useDeliverables();

const props = defineProps({
  deliverable: {
    type: Object,
    default: () => ({}),
  },
  link: {
    type: String,
    default: '',
  },
  select: {
    type: String,
    default: '',
  },
});

const saving = ref(false);

// Create a local copy of the prop
const localLink = ref(props.link);
const localDeliverable = ref(props.deliverable);

function debounce(func, wait) {
  let timeout;
  
  const debouncedFunction = (...args) => {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  // Add cleanup method
  debouncedFunction.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debouncedFunction;
}

console.log('props.select', props.select);

watch(() => localLink.value, (newValue) => {
  console.log(props.select);

  switch (props.select) {
    case 'content.draft':
      localDeliverable.value.content.draft = newValue;
      break;
    case 'content.outline':
      localDeliverable.value.content.outline = newValue;
      break;
    case 'content.research':
      localDeliverable.value.content.research = newValue;
      break;
    case 'content.requirements':
      localDeliverable.value.content.requirements = newValue;
      break;

    default:
      break;
  }
});

const debouncedSaveLink = debounce(async () => {
  try {
    saving.value = true;
    // console.log('updatedDeliverable:', updatedDeliverable.value);
    await saveDeliverableContent(localDeliverable.value);
  } catch (error) {
    console.error('Error saving content:', error);
  } finally {
    saving.value = false;
  }
}, 250);

watch(localLink, () => {
  debouncedSaveLink();
});

</script> 

<style scoped lang="scss">

@use 'assets/variables' as *;

.form-input {
  position: relative;

  .load {
    position: absolute;
    right: $spacing-sm;
    top: $spacing-sm;
    width: fit-content !important;
    height: fit-content !important;
  }
}

</style>