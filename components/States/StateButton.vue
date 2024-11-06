<template>
  <button class="button">
    <Loading v-if="loading" type="small" />
    <span v-if="StateInstanceData && !loading">
      {{ StateInstanceData[0].instance_name }}
    </span> 
  </button>
</template>

<script setup>

const props = defineProps(['state']);

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance, StateInstanceData, StateInstanceError } = useWorkflowStateInstances();

const loading = ref(true);

onMounted(async () => {
  await fetchSingleStateInstance(props.state);
  loading.value = false;
});

</script>