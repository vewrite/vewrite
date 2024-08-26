<template>
  <div id="DeleteProjectModal">
    <div class="modal-body">
      <p>This is an irreversible action. All data associated with this project, <strong>{{ project.name }}</strong>, will be permanently deleted.</p>
      {{ deliverables }}
    </div>
    
    <div class="buttons">
      <span class="modal-confirmation">I understand that all data will be lost.</span>
      <button @click="deleteProject" class="primary red">Delete</button>
    </div>
  </div>
</template>

<script setup>

// Project composable
import useProject from '~/composables/useProject';
const { deleteProject, getProjectDetails, projectData, projectError } = useProject();

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { fetchProjectDeliverable } = useDeliverables();

const project = ref({});
const deliverables = ref([]);

// Get the project id from the route
import { useRoute } from 'vue-router';
const route = useRoute();
const projectId = route.params.id;

onMounted(async () => {
  project.value = await getProjectDetails(projectId);
  // deliverables.value = await fetchProjectDeliverable(projectId);
});

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#DeleteProjectModal {
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