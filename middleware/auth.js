import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Define public routes
  const publicRoutes = ['/login', '/login/new-password', '/login/reset', '/auth/callback']
  
  // Check if route is public
  if (publicRoutes.includes(to.path)) {
    // If user is already authenticated and tries to access public route
    if (authStore.user) {
      return navigateTo('/')
    }
    return // Allow access to public route
  }

  if (!authStore) {
    return navigateTo('/login')
  }
})