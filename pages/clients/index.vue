<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <div class="button primary" @click="createClientModal()">Create client</div>
    </template>
    <template v-slot:body>
      <ClientsList />
    </template>
  </AppPanel>
</template>

<script setup>

import useClient from '~/composables/useClient';
const { createClientModal } = useClient();

</script>