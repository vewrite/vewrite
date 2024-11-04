<template>
  <tr class="profile-row" :class="[type]">
    <td class="profile-image">
      <Avatar :uuid="uuid" size="large" />
    </td>
    <td class="profile-info">
      <p v-if="ProfileData">{{ ProfileData.username }}</p>
      <p v-if="ProfileError">{{ ProfileError }}</p>
      <Role v-if="RoleData" :role="RoleData.role" :user="uuid" :team="team" />
    </td>
    <td class="profile-actions">
      <slot name="actions"></slot>
    </td>
  </tr>
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

@import 'assets/_variables.scss';

.profile-row {
  display: flex;
  flex-direction: row;
  gap: $spacing-sm;
  align-items: center;
  padding: $spacing-xxxs $spacing-sm;
  border-bottom: 1px solid rgba($brand, 0.15);
  transition: all 0.2s ease;
  width: 100%;

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