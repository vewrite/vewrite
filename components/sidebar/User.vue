<template>
  <Loading v-if="loading" type="small" />
  <router-link to="/account" class="button clear side-bar-user" v-if="!loading">
    <div class="user-identity">
      <Avatar :uuid="user.id" size="large" />
      <p>{{ ProfileData.username }}</p>
    </div>
    <Icon name="fluent:chevron-right-16-regular" size="1.5rem" />
  </router-link>
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
  width: 100%;

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