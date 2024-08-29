<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
    </template>
    <template v-slot:body>
      Settings
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

// TODO: deal with hiding create project button if there are no projects

</script>

<style scoped>

@import 'assets/_variables.scss';

</style>