<template>
  <section id="ProjectDetails">
    <TeamMembers :team="team" />
    <ClientImage :client="client" size="small" table="logos" />
  </section>
</template>

<script setup>

import TeamMembers from '~/components/TeamMembers/TeamMembers.vue'

const props = defineProps(['team', 'client'])

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#ProjectDetails {
  background-color: $white;
  margin: 0 $spacing-md $spacing-md;
  padding: $spacing-xxs;
  border: $border;
  border-radius: $br-lg;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: $main-shadow;
}

</style>