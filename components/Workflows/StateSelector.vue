<template>
  <div class="state-selector-row">
    <div class="form-input state-name">
      <label for="state-name">State Name</label>
      <input type="text" v-model="returnedState.name" placeholder="Name your state" />
    </div>
    <div class="form-input state-type">
      <label for="state-name">State Type</label>
      <select v-model="returnedState.type">
        <option v-for="state in states" :value="state.id">{{ state.name }}</option>
      </select>
    </div>
    <button @click="deleteState(state.id)">Delete</button>
  </div>
</template>

<script setup>

import { ref } from 'vue'
import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes'
const { listStates } = useWorkflowStateTypes()

const returnedState = ref({
  name: '',
  type: 1,
})
const states = ref([]);

onMounted(async () => {
  states.value = await listStates();
  console.log(states.value);
})

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.state-selector-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-sm;

  .form-input {
    margin: 0;
  }


  button {
    background-color: $red;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
}

</style>