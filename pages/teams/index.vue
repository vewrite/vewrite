<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <div class="button primary" @click="createTeamModal()">Create team</div>
    </template>
    <template v-slot:body>
      <TeamsList />
    </template>
  </AppPanel>
</template>

<script setup>

// Clients composable
import useTeam from '~/composables/useTeam';
const { createTeamModal } = useTeam();



</script>

<style scoped>
/* Your styles here */
</style>