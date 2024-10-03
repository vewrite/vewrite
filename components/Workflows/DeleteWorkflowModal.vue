<template>
  <div id="DeleteWorkflowModal">
    <div class="modal-body" v-if="projects.length > 0">
      <p class="notification warning">The following projects use this workflow and will have the default workflow assigned to them instead.</p>
      <ul>
        <li v-for="project in projects" :key="project.id">{{ project.name }}</li>
      </ul>
    </div>

    <div class="modal-body" v-else>
      <p class="notification info">No projects are using this workflow and it is safe to delete.</p>
    </div>
    
    <div class="buttons">
      <span class="modal-confirmation" v-if="projects.length > 0">I understand deletion may cause workflow issues.</span>
      <span v-else>Are you sure you want to delete this workflow?</span>
      <button @click="deleteWorkflow(workflowId)" class="primary red">Delete</button>
    </div>
  </div>
</template>

<script setup>

// Project composable
import useProject from '~/composables/useProject';
const { getProjectDetails, projectData, projectError } = useProject();

// Deliverables composable
import useWorkflow from '~/composables/useWorkflow';
const { deleteWorkflow, fetchAssociatedProjects } = useWorkflow();

import { useModal } from '~/stores/modal';

const workflowId = ref({});
const projects = ref([]);

onMounted(async () => {
  workflowId.value = useModal().workflowId;
  projects.value = await fetchAssociatedProjects(workflowId);
});

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#DeleteWorkflowModal {
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