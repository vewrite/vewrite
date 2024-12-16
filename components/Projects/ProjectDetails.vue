<template>
  <section id="ProjectDetails">
    <TeamMembers :team="team" />
    <!-- <ClientImage :client="client" size="small" table="logos" /> -->
  </section>
</template>

<script setup>

import TeamMembers from '~/components/TeamMembers/TeamMembers.vue'

const props = defineProps(['team', 'client'])

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#ProjectDetails {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

</style>