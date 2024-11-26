<template>
  <Dropdown :size="small">
    <template v-slot:trigger>
      <Loading v-if="loading" type="small" />
      <Avatar v-else :uuid="user.id" size="small" />
    </template>
    <template v-slot:menu>
       <router-link to="/account" class="dropdown-item">Account</router-link>
    </template>
  </Dropdown>
</template>

<script setup>

const user = useSupabaseUser()
const loading = ref(true)

import useProfile from '~/composables/useProfile'
const { fetchSingleProfile, ProfileData } = useProfile()

onMounted(async () => {
  if (user.value) {
    await fetchSingleProfile(user.value.id);
    loading.value = false;
  }
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.side-bar-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-xs;
  gap: $spacing-xs;

  .user-identity {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: $spacing-xs;

    p {
      margin: 0;
      color: $black;
    }
  }
  
  .iconify {
    color: $brand;
  }
}

</style>