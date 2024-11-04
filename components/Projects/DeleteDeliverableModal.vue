<template>
  <div id="DeleteDeliverableModal">
    <div class="modal-body" v-if="DeliverableData">
      <p>This is an irreversible action. All data associated with this deliverable, <strong>{{ DeliverableData.title }}</strong>, will be permanently deleted.</p>
    </div>
    
    <div class="buttons">
      <span class="modal-confirmation">I understand that all data will be lost.</span>
      <button @click="deleteDeliverable(deliverableId, DeliverableData.project)" class="primary red">Delete</button>
    </div>
  </div>
</template>

<script setup>

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { fetchSingleProjectDeliverable, deleteDeliverable, DeliverableData, DeliverableError } = useDeliverables();

// Get the project id from the route
import { useRoute } from 'vue-router';
const route = useRoute();
const deliverableId = route.params.id;

onMounted(async () => {
  try {
    await fetchSingleProjectDeliverable(deliverableId);
  } catch (error) {
    console.error(error);
  }
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#DeleteDeliverableModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  width: 100%;

  .modal-body {
    padding: $spacing-md;
    width: 100%;

    p {
      margin: 0;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-sm;
      color: $red;
    }
  }
}

</style>