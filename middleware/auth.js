import { useRoute } from 'vue-router';

export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const route = useRoute();
  const magiclink = route.query.magiclink;
  const hasAccessToken = route.hash.includes('access_token');
  
  if (magiclink === 'true' || hasAccessToken) {
    return navigateTo("/confirm");
  }

  if (to.path === '/login' || to.path === '/login/reset' || to.path === '/login/new-password' || to.path === '/confirm') {
    return
  }

  if (to.path === '/verify') {
    return navigateTo("/confirm");
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})