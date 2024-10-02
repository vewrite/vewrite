<template>
  <div id="DeleteWorkflowModal">
    <div class="modal-body">
      <p>This is an irreversible action. All data associated with this project, <strong>{{ project.name }}</strong>, will be permanently deleted.</p>
      <br><br>
      <p><strong>These deliverables will also be deleted</strong></p>
      <ul>
        <li v-for="deliverable in deliverables" :key="deliverable.id">{{ deliverable.title }}</li>
      </ul>
    </div>
    
    <div class="buttons">
      <span class="modal-confirmation">I understand that all data will be lost.</span>
      <button @click="deleteProject(projectId)" class="primary red">Delete</button>
    </div>
  </div>
</template>

<script setup>

// Project composable
import useProject from '~/composables/useProject';
const { deleteProject, getProjectDetails, projectData, projectError } = useProject();

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { fetchProjectDeliverables } = useDeliverables();

const project = ref({});
const deliverables = ref([]);

// Get the project id from the route
import { useRoute } from 'vue-router';
const route = useRoute();
const projectId = route.params.id;

onMounted(async () => {
  project.value = await getProjectDetails(projectId);
  deliverables.value = await fetchProjectDeliverables(projectId);
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