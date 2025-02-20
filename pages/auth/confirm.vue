<template>
  <Loading type="small" />
</template>

<script setup lang="ts">
const user = useSupabaseUser()
 
// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value
 
console.log('I get to the confirm page.')

watch(user, () => {
  if (user.value) {
      // Clear cookie
      useCookie(`${cookieName}-redirect-path`).value = null
      // Redirect to path
      return navigateTo(redirectPath || '/'); 
  }
}, { immediate: true })
</script>