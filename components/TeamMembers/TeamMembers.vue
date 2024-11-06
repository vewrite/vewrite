<template>
  <section class="team-members">
    <Loading v-if="loading" type="small" />
    <section class="team-wrapper" v-if="TeamData">
      <div class="members">
        <div class="members-image" v-for="member in TeamMembersData" :key="member.id">
          <Avatar :uuid="member.user_id" size="large" />
        </div>
      </div>
      <section class="team-info">
        <p class="assigned"><nuxt-link :to="'/team/' + TeamData.id">{{ TeamData.name }}</nuxt-link> assigned</p>
      </section>
    </section>
    <div class="members-image" v-if="!loading && TeamData?.length == 0">
      <img src="/images/team-default.svg" alt="Team avatar" />
    </div>
  </section>
</template>

<script setup>

const props = defineProps(['team'])

const loading = ref(true)

// Team composable
import useTeam from '~/composables/useTeam';
const { fetchSingleTeam, TeamData, TeamError } = useTeam();

// Team members composable
import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers, TeamMembersData, TeamMembersError } = useTeamMembers();

onMounted(async () => {
  try {
    await fetchSingleTeam(props.team);
    await fetchTeamMembers(props.team);
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
  
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.team-members {
  display: flex;
  flex-direction: row;
  align-items: center;

  .team-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-right: $spacing-md;

    .team-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .assigned {
        color: $black;
        margin: 0;
        opacity: 0.5;
        font-size: $font-size-xs;
        text-wrap: nowrap;
      }
    }
  }

  .members {
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;
    height: 40px;

    .members-image {
      position: relative;
      top: 0;
      display: none;
      border-radius: $br-xl;

      .user-avatar {
        border: 2px solid $white;
      }

      &:nth-child(1) {
        z-index: 3;
        left: 0px;
        top: 0px;
        display: block;
      }

      &:nth-child(2) {
        z-index: 2;
        left: -10px;
        top: 0px;
        display: block;
      }

      &:nth-child(3) {
        z-index: 1;
        left: -20px;
        top: 0px;
        display: block;
      }
    }
  }
}

</style>