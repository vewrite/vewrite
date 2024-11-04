<template>
  <div class="profile-card" :class="[type]">
    <div class="profile-image">
      <Avatar :uuid="uuid" size="large" />
    </div>
    <div class="profile-info">
      <p v-if="ProfileData">{{ ProfileData.username }}</p>
      <p v-if="ProfileError">{{ ProfileError }}</p>
      <Role v-if="RoleData" :role="RoleData.role" :user="uuid" :team="team" />
    </div>
    <div class="profile-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import useProfile from '~/composables/useProfile';
import Role from '~/components/Roles/Role.vue';

import useRoles from '~/composables/useRoles';
const { fetchUserTeamRole, RoleData, RoleError } = useRoles();
const supabase = useSupabaseClient();
const props = defineProps(['uuid', 'type', 'team']);
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

    p {
      margin: 0;
    }
  }

  .profile-actions {
    display: flex;
    flex-direction: row;
    gap: $spacing-sm;
    opacity: 0;
    transition: all 0.2s ease;
  }

  &:hover {
    border: 1px solid $brand;

    .profile-actions {
      opacity: 1;
    }
  }
}

</style>