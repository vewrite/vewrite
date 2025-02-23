import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // I'm going to want to get the user's subscription status here via the object in the column 'subscription' in the 'profiles' table
  const subscriptionStatus = useState('subscriptionStatus', () => ({}));
  const personaState = useState('personaState', () => ({}));

  // Set subscription status and persona state for use in the app
  if (user.value) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error.message)
    } else {
      subscriptionStatus.value = data.subscription
      personaState.value = data.persona
    }
  }

  // Define public routes
  const publicRoutes = ['/login', '/login/new-password', '/login/reset', '/auth/callback', '/auth/confirm']
  
  // Check if route is public
  if (publicRoutes.includes(to.path)) {
    // If user is already authenticated and tries to access public route
    if (authStore.user) {
      return navigateTo('/')
    }
    return // Allow access to public route
  }

})