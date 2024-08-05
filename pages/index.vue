<template>
  <AppPanel>
    <template v-slot:header>
      <div class="app-panel-header">Welcome</div>
    </template>
    <template v-slot:body>
      <p>Body Content</p>
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