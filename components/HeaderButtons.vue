<template>
  <div id="HeaderButtons">
    <router-link class="button dark" to="/account">Account</router-link>
    <button class="dark" @click="logout">Logout</button>
  </div>
</template>

<script setup>

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


</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#HeaderButtons {
  display: flex;
  flex-direction: row;
  gap: $spacing-xs;
}

</style>