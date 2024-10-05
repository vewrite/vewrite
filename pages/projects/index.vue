<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <div class="button primary" @click="createProjectModal()">Create project</div>
    </template>
    <template v-slot:body>
      <ProjectsList />
    </template>
  </AppPanel>
</template>

<script setup>

import useProject from '~/composables/useProject';
const { createProjectModal } = useProject();

</script>