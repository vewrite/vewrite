<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <div class="button primary" @click="createTeamModal()" v-if="personaState == 'manager'">Create team</div>
    </template>
    <template v-slot:body>
      <TeamsList v-if="personaState == 'manager'" />
      <AccessDenied v-else />
    </template>
  </AppPanel>
</template>

<script setup>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

// Pull personaState from the middleware auth.js
const personaState = useState('personaState');

import useTeam from '~/composables/useTeam';
const { createTeamModal } = useTeam();

</script>