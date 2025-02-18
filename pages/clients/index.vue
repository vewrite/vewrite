<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <div class="button primary" @click="createClientModal()" v-if="personaState == 'manager'">Create client</div>
    </template>
    <template v-slot:body>
      <ClientsList v-if="personaState == 'manager'" />
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

import useClient from '~/composables/useClient';
const { createClientModal } = useClient();

</script>