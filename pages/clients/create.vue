<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/clients/" class="button primary">Back</router-link>
    </template>
    <template v-slot:body>
      <NewClient />
    </template>
  </AppPanel>
</template>

<script>
import AppPanel from '~/components/AppPanel.vue';
import NewClient from '~/components/Clients/NewClient.vue';

export default {
  components: {
    AppPanel,
    NewClient
  }
}
</script>

<style scoped>
/* Your styles here */
</style>