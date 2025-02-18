<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <div class="button primary" @click="createProjectModal()" v-if="personaState == 'manager'">Create project</div>
    </template>
    <template v-slot:body>
      <ProjectsList />
    </template>
  </AppPanel>
</template>

<script setup>

import useProject from '~/composables/useProject';
const { createProjectModal } = useProject();

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

// Pull personaState from the middleware auth.js
const personaState = useState('personaState');

</script>