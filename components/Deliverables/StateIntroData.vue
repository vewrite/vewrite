<template>
  <section class="state-intro-data">
    <div class="intro-data-row" v-if="project">
      <div class="members">
        <div class="single-member" v-if="projectManager">
          <Avatar :uuid="projectManager" :hasName="true" size="small" :secondarytext="'Project Manager'" />
        </div>
        <div class="single-member" v-if="assignedProjectMembers" v-for="(uuid, role) in assignedProjectMembers" :key="role" :class="DeliverableData.assigned_to == uuid ? 'assigned' : ''">
          <Avatar :uuid="uuid" :hasName="true" size="tiny" />
          <div class="members-role">
            <div class="assigned-to" v-if="DeliverableData.assigned_to == uuid">{{ role }} is assigned</div>
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

import { useRoute } from 'vue-router';
const route = useRoute();

const projectManager = route.meta.roles.projectManager;

const assignedProjectMembers = ref(null);

onMounted(async () => {
  try {
    ProjectData.value = await getProjectDetails(props.project);
    assignedProjectMembers.value = props.DeliverableData.role_assignments;
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
      flex-direction: row;
      align-content: flex-end;
      width: 100%;

      .single-member {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: $spacing-sm;
        display: none;

        &.assigned {
          background: $white;
          display: flex;
        }

        .members-role {
          font-size: $font-size-xxs;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: $spacing-xs;

          .assigned-to {
            font-size: $font-size-xxs;
            color: $brand;
            background: rgba($white, 0.5);
            border: 1px solid rgba($brand, 0.5);
            padding: 2px $spacing-xs;
            border-radius: $br-lg;
          }
        }
      }
    }
  }
}

</style>