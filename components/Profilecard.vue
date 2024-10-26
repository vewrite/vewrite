<template>
  <div class="profile-card">
    <div class="profile-image">
      <Avatar :uuid="uuid" size="large" />
    </div>
    <div class="profile-info">
      <p v-if="ProfileData">{{ ProfileData.username }}</p>
      <p v-else-if="ProfileError">{{ ProfileError }}</p>
    </div>
    <div class="profile-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import useProfile from '~/composables/useProfile';

const props = defineProps(['uuid']);
const { fetchSingleProfile, ProfileData, ProfileError } = useProfile();

onMounted(async () => {
  try {
    console.log('Fetching profile:', props.uuid);
    await fetchSingleProfile(props.uuid);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    ProfileError.value = error.message;
  }
});

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.profile-card {
  display: flex;
  flex-direction: row;
  gap: $spacing-sm;
  align-items: center;
  margin-top: $spacing-sm;
  padding: $spacing-sm ;
  border-radius: $br-lg;
  background: $white;
  box-shadow: $soft-shadow;

  .profile-image {
    width: 40px;
  }

  .profile-info {
    width: 100%;

    p {
      margin: 0;
    }
  }
}

</style>