import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'
import useProfile from '~/composables/useProfile'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // I'm going to want to get the user's subscription status here via the object in the column 'subscription' in the 'profiles' table
  const subscriptionStatus = useState('subscriptionStatus', () => ({}));
  const personaState = useState('personaState', () => ({}));

  const { createProfile, ProfileData } = useProfile()


  async function handleProfileInserts(payload) {
    const { new: profile } = payload
    subscriptionStatus.value = profile.subscription
    personaState.value = profile.persona
  }

  async function handleProfileUpdates(payload) {
    const { new: profile } = payload
    subscriptionStatus.value = profile.subscription.status
    personaState.value = profile.persona
  }

  async function initProfile() {

    console.log('Initializing profile...')

    try {
      
      if (!user.value) {
        console.log('User is not authenticated')
        return
      }

      // Fetch the user's profile from the database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .maybeSingle();

      console.log('Fetched profile:', data)

      if (error) { throw error }

      // if there are zero rows returned, create a new profile
      if (data === undefined || data === null) {
        console.log('No profile found for this user')
        await createProfile(user.value)

        // Go get that new profile
        const { data: newProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.value.id)
          .single()

        if (error) { throw error }

        console.log('Created new profile:', newProfile)

        // recursively call initProfile to get the new profile
        await initProfile()
        return

      } else {
        subscriptionStatus.value = data.subscription
        personaState.value = data.persona
      }


    } catch (error) {
      console.error('Error fetching user profile:', error.message)
    }
  }

  

  // Set subscription status and persona state for use in the app
  if (user.value) {
    // subscription
    const subscription = supabase
      .channel('profiles')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, handleProfileInserts)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, handleProfileUpdates)
      .subscribe();

    await initProfile()

    onUnmounted(() => {
      supabase.removeChannel(subscription);
    });

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