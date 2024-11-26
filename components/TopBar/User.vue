<template>
  <Dropdown class="top-bar-user" :size="small">
    <template v-slot:trigger>
      <Avatar :uuid="user.id" size="small" />
      {{ loading ? 'Loading' : ProfileData.username }}
      <Icon name="fluent:chevron-down-16-regular" size="1rem" />
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

<style lang="scss">

@use 'assets/variables' as *;

.top-bar-user {
  height: 40px;

    .button {
      border-color: transparent;
    }

}

</style>