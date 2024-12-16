<template>
  <div id="DeleteTeamModal">
    <div class="modal-body">
      <p>This is an irreversible action. All data associated with this team will be permanently deleted.</p>
      {{ route.params.id }}
      <!-- <br><br> -->
      <!-- <p><strong>These deliverables will also be deleted</strong></p> -->
      <!-- <ul>
        <li v-for="deliverable in deliverables" :key="deliverable.id">{{ deliverable.title }}</li>
      </ul> -->
    </div>
    
    <div class="buttons">
      <span class="modal-confirmation">I understand that all data will be lost.</span>
      <button @click="deleteTeam(teamId)" class="primary red">Delete</button>
    </div>
  </div>
</template>

<script setup>

// Project composable
import useTeam from '~/composables/useTeam';
const { deleteTeam } = useTeam();

const team = ref(null);

// Get the project id from the route
import { useRoute } from 'vue-router';
const route = useRoute();
const teamId = route.params.id;

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#DeleteTeamModal {
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
      font-size: $font-size-xs;
      color: $red;
    }
  }
}

</style>