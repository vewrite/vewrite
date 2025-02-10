// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    async logout() {
      const { error } = await useSupabaseClient().auth.signOut()
      if (error) {
          console.error("Logout error", error)
      }
      this.user = null
      navigateTo('/login')
    }
  },
  persist: true,
})