<template>
  <Loading type="small" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: "auth",
})

const supabase = useSupabaseClient()
const router = useRouter()
const authStore = useAuthStore()
const user = useSupabaseUser()
const loading = ref(true)

// Initialize auth state
onMounted(async () => {
  try {
    // Get initial session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    // console.log('Session:', session)

    if (error) throw error
    
    if (session) {
      // console.log('User is logged in, setting user:', session.user)
      authStore.setUser(session.user)
      await router.push('/')
    } else {
      // console.log('User is not logged in')
      await router.push('/login')
    }
  } catch (error) {
    console.error('Error:', error.message)
    // await router.push('/login')
  } finally {
    loading.value = false
  }
})

// Watch for auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    authStore.setUser(session.user)
    await router.push('/')
  } else if (event === 'SIGNED_OUT') {
    authStore.clearUser()
    await router.push('/login')
  }
})
</script>