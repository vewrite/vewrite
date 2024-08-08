<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <div class="app-panel-header">Account</div>
      <button class="dark" @click="logout">Logout</button>
    </template>
    <template v-slot:body>
      <AccountContent />
    </template>
  </AppPanel>
</template>

<script>
import AppPanel from '~/components/AppPanel.vue';
import AccountContent from '~/components/AccountContent.vue';

export default {
  setup() {
    const supabase = useSupabaseClient()

    const loading = ref(false)

    async function logout() {
        try {
            loading.value = true
            let { error } = await supabase.auth.signOut()
            if (error) throw error
            user.value = null
        } catch (error) {
            alert(error.message)
        } finally {
            loading.value = false
        }
    }

    return {
      logout
    }
  },
  components: {
    AppPanel
  }
}
</script>

<style scoped>
/* Your styles here */
</style>~~/components/user/AccountContent.vue