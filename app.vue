<template>
  <div class="app-wrapper">
    <Marketing v-if="!user" />
    <Vewrite v-else />
  </div>
</template>

<script setup>

// Get Supabase user
const user = useSupabaseUser()

// User store
import { useUser } from '@/stores/user'
const userStore = useUser()

// Call the user store and set the user using the Supabase user
userStore.setUser(user.value)

</script>

<style lang="scss">

@import 'assets/_variables.scss';

.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  
}

</style>