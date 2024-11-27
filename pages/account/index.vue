<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
      <button @click="logout">Logout</button>
    </template>
    <template v-slot:body>
      <AccountContent />
    </template>
  </AppPanel>
</template>

<script>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

import AppPanel from '~/components/AppPanel.vue';

export default {
  setup() {
    const supabase = useSupabaseClient()

    const logout = async () => {
      const { error } = await supabase.auth.signOut()
      if (error) console.log(error)
      navigateTo('/login')
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