<template>
  <div class="profile-card" :class="[type]">
    <div class="profile-image">
      <Avatar :uuid="uuid" size="large" />
    </div>
    <div class="profile-info">
      <p v-if="ProfileData">{{ ProfileData.username }}</p>
      <p v-if="ProfileError">{{ ProfileError }}</p>
    </div>
    <div class="profile-actions">
      <Role v-if="useRole && RoleData" :role="RoleData.role" :user="uuid" :team="team" />
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>

import { onMounted } from 'vue';

import useProfile from '~/composables/useProfile';
import Role from '~/components/Roles/Role.vue';

import useRoles from '~/composables/useRoles';
const { fetchUserTeamRole, RoleData } = useRoles();

/*
  uuid    - The user's UUID
  type    - The type of profile card to display
  team    - The team the user is a part of, MUST USE team_id
  useRole - Whether to display the user's role. This is used in the TeamAssignment component since we 
            don't want the user to set the role at the team level, but at the deliverable level.
*/
const props = defineProps(['uuid', 'type', 'team', 'useRole']);

const { fetchSingleProfile, ProfileData, ProfileError } = useProfile();

onMounted(async () => {
  try {
    await fetchSingleProfile(props.uuid);
    await fetchUserTeamRole(props.uuid, props.team);
  } catch (error) {
    console.error(error);
  }
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.profile-card {
  display: flex;
  flex-direction: row;
  gap: $spacing-sm;
  align-items: center;
  padding: $spacing-sm ;
  border-radius: $br-md;
  border: 1px solid rgba($brand, 0.15);
  transition: all 0.2s ease;
  box-shadow: $soft-shadow;
  width: 100%;

  &.list {
    border-color: transparent;
    box-shadow: none;
    border-radius: 0;

    &:hover {
      border-color: transparent;
    }
  }

  .profile-image {
    width: 40px;
  }

  .profile-info {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: $spacing-sm;
    align-items: center;
    justify-content: space-between;

    p {
      margin: 0;
    }
  }

  .profile-actions {
    display: flex;
    flex-direction: row;
    gap: $spacing-sm;
    transition: all 0.2s ease;
  }
}

</style>