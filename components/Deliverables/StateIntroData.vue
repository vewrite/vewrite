<template>
  <section class="state-intro-data">
    <!-- <div class="intro-data-row" v-if="ProjectData">
      <p>Project</p>
      <p>{{ ProjectData.name }}</p>
    </div> -->
    <div class="intro-data-row" v-if="TeamMembersData">
      <div class="members">
        <div class="single-member" v-if="assignedTeam" v-for="(uuid, role) in assignedTeam" :key="role">
          <Avatar :uuid="uuid" :hasName="true" size="small" />
          <div class="members-role">
            <div class="assigned-to" v-if="DeliverableData.assigned_to == uuid">Currently assigned</div>
            {{ role }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>

const props = defineProps(['project', 'DeliverableData']);
const ProjectData = ref(null);

import useProject from '~/composables/useProject';
const { getProjectDetails } = useProject();

import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers, TeamMembersData } = useTeamMembers();

const assignedTeam = ref(null);

onMounted(async () => {
  try {
    ProjectData.value = await getProjectDetails(props.project);
    assignedTeam.value = props.DeliverableData.role_assignments;
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
      width: 100%;

      .single-member {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: $spacing-sm;
        width: 100%;
        border-bottom: $border;
        padding-bottom: $spacing-xs;

        &:last-child {
          border-bottom: none;
        }

        .members-role {
          font-size: $font-size-xs;
          font-weight: bold;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: $spacing-xs;

          .assigned-to {
            font-size: $font-size-xxs;
            color: $brand;
            background: rgba($brand, 0.1);
            padding: 2px $spacing-xs;
            border-radius: $br-lg;
          }
        }
      }
    }
  }
}

</style>