<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <!-- <router-link to="/project/create" class="button primary">Create project</router-link> -->
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