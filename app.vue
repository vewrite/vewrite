<template>
  <div id="vewrite">
    <Loading class="on-top" :hasLogo="true" v-if="loading" />
    <div class="app" v-if="user">
      <main v-if="userStore.firstTime == false">
        <Sidebar />
        <NuxtPage />
        <Modal />
      </main>
      <main v-else>
        <FirstTime v-if="!loading && userStore.firstTime == true" />
      </main>
    </div>
    <div class="app" v-else>
      <Auth />
    </div>
  </div>
</template>

<script setup>

import FirstTime from '~/components/Onboarding/Firsttime.vue'

// Supabase setup
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)

// User store
import { useUser } from '@/stores/user'
const userStore = useUser()

// Pull the user state from the database, then pass that into the user store
const fetchUser = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)

  if (error) throw error
  
  userStore.setUser(data[0])
}

// Call the user store and set the user using the Supabase user
onMounted(() => {
  if (user.value) {
    fetchUser()
    loading.value = false
  } else {
    loading.value = false
  }
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#vewrite {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  .app, main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }
}

</style>