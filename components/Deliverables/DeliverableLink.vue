<template>
  <div class="form-input">
    <label for="link">External link</label>
    <input id="link" type="text" v-model="localLink" placeholder="Paste a link here" @input="updateLink" />
    <!-- <span class="form-required" v-if="formErrors.title != ''">{{ formErrors.title }}</span> -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  link: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:link']);

// Create a local copy of the prop
const localLink = ref(props.link);

// When the local value changes, emit an event
function updateLink() {
  emit('update:link', localLink.value);
}

// When the prop changes from the parent, update the local value
watch(() => props.link, (newValue) => {
  localLink.value = newValue;
});
</script> 