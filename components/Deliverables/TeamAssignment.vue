<template>
  <section class="team-assignment">
    <div class="members">
      <div class="members-title">Team member role assignment</div>
      <div class="member" v-for="member in TeamMembersData" :key="member.id">
        <Avatar :uuid="member.user_id" :hasName="true" size="small" />
      </div>
      <div class="member" v-for="member in TeamMembersData" :key="member.id">
        <Avatar :uuid="member.user_id" :hasName="true" size="small" />
      </div>
      <div class="member" v-for="member in TeamMembersData" :key="member.id">
        <Avatar :uuid="member.user_id" :hasName="true" size="small" />
      </div>
      <div class="member" v-for="member in TeamMembersData" :key="member.id">
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
  border-radius: $br-lg;
  min-height: 300px;
  max-height: 300px;
  overflow-y: auto;
  background: rgba($gray-light, .25);

  .members {
    display: flex;
    flex-direction: column;
    border-radius: $br-lg;
    position: relative;

    .members-title {
      font-size: $font-size-xs;
      color: rgba($black, 0.65);
      padding: $spacing-sm;
      background: linear-gradient(to bottom, rgba($white, 1), rgba($white, 0.85));
      backdrop-filter: blur(5px);
      position: sticky;
      top: 0;
      z-index: 1;

    }

    .member {
      padding: $spacing-sm;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: $spacing-xs;
      border-bottom: $border;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

</style>