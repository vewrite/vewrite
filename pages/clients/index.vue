<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <router-link to="/clients/create" class="button primary">Create a client</router-link>
    </template>
    <template v-slot:body>
      <ClientsList />
    </template>
  </AppPanel>
</template>

<script>
import AppPanel from '~/components/AppPanel.vue';

export default {
  components: {
    AppPanel
  }
}
</script>

<style scoped>
/* Your styles here */
</style>