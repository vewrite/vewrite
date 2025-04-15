<template>
  <div id="AddImageModal">
    <div class="modal-body">
      <Loading class="loading" v-if="loading" type="small" />
      Add an image to your deliverable
    </div>
    
    <div class="buttons">
      <button @click="handleCreateDeliverable()" class="primary large">Add Image</button>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const loading = ref(false);

// For the approval, I need to load the deliverable data, which will give me the id, the name of the deliverable, and the workflow state
// I will want to tell the user that what they are doing is not reversible and that they should be sure they want to approve the deliverable

async function handleAddImage() {
  try {
    loading.value = true;
    
  
    useModal().toggleVisibility();
    useModal().reset();
  } catch (error) {
    console.error(error);
  }
}

onMounted(async() => {
  try {
    loading.value = true;
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#AddImageModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .modal-body {
    width: 100%;
    padding: 0 $spacing-md $spacing-md;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;

    .loading {
      margin: $spacing-lg auto;
    }

    p {
      margin: 0;
    }

  }

  
}

</style>