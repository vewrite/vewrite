<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <!-- <router-link to="/clients/create" class="button primary">Create client</router-link> -->
      <div class="button primary" @click="createClientModal()">Create client</div>
    </template>
    <template v-slot:body>
      <ClientsList />
    </template>
  </AppPanel>
</template>

<script setup>

// Clients composable
import useClient from '~/composables/useClient';
const { createClientModal } = useClient();



</script>

<style scoped>
/* Your styles here */
</style>