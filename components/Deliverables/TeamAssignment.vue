<template>
  <section class="team-assignment">
    <div class="members">
      <div class="members-image" v-for="member in TeamMembersData" :key="member.id">
        <Avatar :uuid="member.user_id" :hasName="true" size="small" />
      </div>
    </div>
  </section>
</template>

<script setup>

const props = defineProps(['team']);

import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers, TeamMembersData } = useTeamMembers();

onMounted(async () => {
  try {
    await fetchTeamMembers(props.team);
  } catch (error) {
    console.error(error);
  }
});

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.team-assignment {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: $border;
  border-radius: $br-md;
  padding: $spacing-sm;

  .members {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }
}

</style>