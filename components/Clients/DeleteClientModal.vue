<template>
  <div id="DeleteClientModal">
    <div class="modal-body">
      <div class="notification warning">
        <Icon name="fluent:chat-warning-20-filled" size="4rem" />
        <p>This is an irreversible action. All data associated with this client, <strong>{{ client.name }}</strong>, will be permanently deleted.</p>
      </div>
      <br>
      <section v-if="projects.length > 0">
        <p><strong>These projects will also be deleted</strong></p>
        <ul>
          <li v-for="project in projects" :key="project.id">{{ project.name }}</li>
        </ul>
      </section>
      <section v-else>
        <p class="details">No projects found for this client.</p>
      </section>
      <br>
      <section v-if="deliverables.length > 0">
        <p><strong>These deliverables will also be deleted</strong></p>
        <ul>
          <li v-for="deliverable in deliverables" :key="deliverable.id">{{ deliverable[0].title }}</li>
        </ul>
      </section>
      <section v-else>
        <p class="details">No deliverables found for this client.</p>
      </section>
    </div>
    
    <div class="buttons">
      <span class="modal-confirmation">I understand that all data will be lost.</span>
      <button @click="deleteClient(deliverables, projects, clientId)" class="primary red">Delete</button>
    </div>
  </div>
</template>

<script setup>

// Project composable
import useProject from '~/composables/useProject';
const { fetchClientProjects, deleteProject, getProjectDetails, ProjectsData, projectData, ProjectsError, projectError } = useProject();

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { fetchProjectDeliverables } = useDeliverables();

// Client composable
import useClient from '~/composables/useClient';
const { fetchClient, deleteClient, ClientData, ClientError } = useClient();

const client = ref({});
const deliverables = ref([]);
const projects = ref([]);

// Get the client id from the route
import { useRoute } from 'vue-router';
const route = useRoute();
const clientId = route.params.id;

onMounted(async () => {
  client.value = await fetchClient(clientId);
  projects.value = await fetchClientProjects(clientId);
  // project.value = await getProjectDetails(projectId);
  // deliverables.value = await fetchProjectDeliverables(projectId);
  for (let project of projects.value) {
    deliverables.value.push(await fetchProjectDeliverables(project.id));
  }
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#DeleteClientModal {
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