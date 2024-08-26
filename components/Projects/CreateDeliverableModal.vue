<template>
  <div id="CreateDeliverableModal">
    <div class="modal-body">
      <p>{{ projectId }}</p>
    </div>
    
    <div class="buttons">
      <button @click="createDeliverable(projectId, deliverable)" class="primary">Create</button>
    </div>
  </div>
</template>

<script setup>

// Project composable
// import useProject from '~/composables/useProject';
// const { deleteProject, getProjectDetails, projectData, projectError } = useProject();

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { createDeliverable } = useDeliverables();

const project = ref({});

// Get the project id from the route
import { useRoute } from 'vue-router';
const route = useRoute();
const projectId = route.params.id;

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#CreateDeliverableModal {
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