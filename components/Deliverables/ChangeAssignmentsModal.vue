<template>
  <div id="ChangeAssignmentModal">
    <div class="modal-body">
      <Loading class="loading" v-if="loading" type="small" />
      <form v-if="!loading" @submit.prevent="createDeliverable(deliverable)">
          <div class="inner-container">

            <!-- <pre v-if="project">{{ project }}</pre>
            <pre v-if="TeamMembersData">{{ TeamMembersData }}</pre> -->

            <!-- Team assignment -->
            <section class="team-assignment">
              <div class="members">
                <div class="members-title">Team member role assignment</div>
                <div class="member" v-if="TeamMembersData" v-for="member in TeamMembersData" :key="member.id">
                  <Avatar :uuid="member.user_id" :hasName="true" size="large" />
                  <div class="role-selector">
                    <div class="single-role" v-if="RolesData" v-for="role in RolesData" :key="role.id" @click="setDeliverableRole(member, role)" :class="{ selected: role_assignments[role.name] == member.user_id }">
                      {{ role.name }}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        
      </form>
    </div>
    <div class="buttons">
      <button @click="updateRoleAssignments(deliverableId, role_assignments)" class="primary large">Assign roles</button>
    </div>
  </div>
</template>

<script setup>

/*

For this modal, I'll need a few things:
- Project object that this deliverable is assigned to
- The deliverable id
- The team members assigned to the project

*/

import { ref, onMounted } from 'vue';

import { useRoute } from 'vue-router';
const route = useRoute();
const deliverableId = route.params.id;
const loading = ref(false);

import useDeliverables from '~/composables/useDeliverables';
const { fetchDeliverable, updateRoleAssignments, DeliverableData } = useDeliverables();

import useProject from '~/composables/useProject';
const { getProjectDetails } = useProject();

import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers, TeamMembersData } = useTeamMembers();

import useRoles from '~/composables/useRoles';
const { fetchRoles, RolesData } = useRoles();

const project = ref(null);

const role_assignments = ref({
  Writer: null,
  Reviewer: null
});

const setDeliverableRole = (member, role) => {
  // Remove the previous role assignment for the user
  for (const [roleName, userId] of Object.entries(role_assignments.value)) {
    if (userId === member.user_id) {
      role_assignments.value[roleName] = null;
    }
  }

  // Assign the new role to the member
  role_assignments.value[role.name] = member.user_id;
}

async function init() {
  loading.value = true;
  await fetchDeliverable(deliverableId);
  project.value = await getProjectDetails(DeliverableData.value.project);
  await fetchTeamMembers(project.value.assigned_team);
  await fetchRoles();
  loading.value = false;
}

onMounted(async() => {
  init();
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#ChangeAssignmentModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .modal-body {
    width: 100%;

    .loading {
      margin: $spacing-lg auto;
    }

    p {
      margin: 0;
    }

    #content-requirements {
      height: 147px;
      margin-bottom: 0;
    }
  }

  .due-date {
    border: $border;
    margin-bottom: $spacing-sm;
    padding: $spacing-sm;
    border-radius: $br-lg;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: $font-size-xs;
    color: rgba($black, 0.65);
    background: rgba($gray-light, 0.25);
  }

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
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: $spacing-xs;
          border-bottom: $border;
          padding: $spacing-sm;

          .role-selector {
            display: flex;
            flex-direction: row;
            align-items: center;
            overflow: hidden;
            gap: $spacing-xs;
            cursor: pointer;

            .single-role {
              background: rgba($black, 0.05);
              padding: $spacing-xxs $spacing-sm;
              border-radius: $br-lg;

              &.selected {
                background: rgba($brand, 0.15);
                color: $brand;
              }
            }
          }

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-xs;
      color: $red;
    }
  }
}

</style>