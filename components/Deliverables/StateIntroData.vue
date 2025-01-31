<template>
  <section class="state-intro-data">
    <div class="intro-data-row" v-if="ProjectData">
      <p>Project</p>
      <p>{{ ProjectData.name }}</p>
    </div>
    <div class="intro-data-row" v-if="TeamMembersData">
      <p>Assigned Team</p>
      <!-- <p>{{ TeamMembersData }}</p> -->
      <div class="members">
        <div class="members-image" v-for="member in TeamMembersData" :key="member.id">
          <Avatar :uuid="member.user_id" :hasName="true" size="small" />
        </div>
      </div>
    </div>
    <div class="intro-data-row" v-if="DeliverableData">
      <p>Requirements</p>
      <p v-html="DeliverableData.content.requirements"></p>
    </div>
  </section>
</template>

<script setup>

const props = defineProps(['project', 'DeliverableData']);
const ProjectData = ref(null);
const AssignedTeam = ref(null);

import useProject from '~/composables/useProject';
const { getProjectDetails } = useProject();

import useTeams from '~/composables/useTeam';
const { fetchSingleTeam } = useTeams();

import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers, TeamMembersData } = useTeamMembers();

onMounted(async () => {
  try {
    ProjectData.value = await getProjectDetails(props.project);
    // AssignedTeam.value = await fetchSingleTeam(ProjectData.value.assigned_team);
    await fetchTeamMembers(ProjectData.value.assigned_team);
  } catch (error) {
    console.error(error);
  }
});

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.state-intro-data {
  display: flex;
  flex-direction: column;
  width: 100%;

  .intro-data-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: $spacing-md;
    width: 100%;
    padding: $spacing-sm 0;
    border-bottom: $border;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      border-bottom: none;
    }

    p {
      margin: 0;

      &:first-child {
        font-weight: bold;
        width: 200px;
      }
    }

    .members {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
    }
  }
}

</style>