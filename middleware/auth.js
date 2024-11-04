import { useRoute } from 'vue-router';

export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const route = useRoute();
  const magiclink = route.query.magiclink;
  const hasAccessToken = route.hash.includes('access_token');

  console.log('hasProviderToken', hasAccessToken)
  
  if (magiclink === 'true' || hasAccessToken) {
    console.log('magiclink', magiclink)
    return navigateTo("/confirm");
  }

  if (to.path === '/login' || to.path === '/confirm') {
    return
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})