// export default defineNuxtRouteMiddleware((to, from) => {
//   const supabase = useSupabaseClient()
//   const user = useSupabaseUser();

//   // console.log('middleware user', user);

//   if (!user && to.path === '/app') {
//     return navigateTo('/')
//   } else {
//     return navigateTo('/app')
//   }

// })