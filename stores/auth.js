// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    githubUser: null
  }),
  actions: {
    setUser(user) {
      this.user = user
      console.log('User set:', user)
    },
    async logout() {
      const { error } = await useSupabaseClient().auth.signOut()
      if (error) {
          console.error("Logout error", error)
      }
      this.user = null
      navigateTo('/login')
      console.log('Logged out.')
    },
    clearUser() {
      this.user = null
    }
  },
  persist: true,
})