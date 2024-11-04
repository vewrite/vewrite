import { useRoute } from 'vue-router';

// export default defineNuxtRouteMiddleware(() => {
//   const route = useRoute();
//   const magiclink = route.query.magiclink;

//   const user = useSupabaseUser()

//   if (magiclink === true) {
//     return navigateTo("/confirm");
//   } else if (user.value) {
//     return navigateTo("/projects")
//   }
  
// })

export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const route = useRoute();
  const magiclink = route.query.magiclink;
  
  if (magiclink === 'true') {
    console.log('magiclink', magiclink)
    return navigateTo("/confirm");
  }

  // Allow access to login and confirm pages
  if (to.path === '/login' || to.path === '/confirm') {
    return
  }

  // Redirect to login if there's no user
  if (!user.value) {
    return navigateTo('/login')
  }
})