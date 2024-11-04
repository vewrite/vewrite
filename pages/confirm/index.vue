
<template>
  <Loading />
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'auth',
});


const user = useSupabaseUser()
 
// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value
 
watch(user, () => {
  if (user.value) {
      // Clear cookie
      useCookie(`${cookieName}-redirect-path`).value = null
      // Redirect to path
      return navigateTo(redirectPath || '/projects'); 
  }
}, { immediate: true })
</script>