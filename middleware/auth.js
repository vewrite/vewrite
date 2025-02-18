import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'

import useProfile from '~/composables/useProfile'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // I'm going to want to get the user's subscription status here via the object in the column 'subscription' in the 'profiles' table
  const subscriptionStatus = useState('subscriptionStatus', () => ({}));

  if (user.value) {
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription')
      .eq('id', user.value.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error.message)
    } else {
      subscriptionStatus.value = data
    }
  }

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

  if (!authStore || user.value == null) {
    return navigateTo('/login')
  }
})