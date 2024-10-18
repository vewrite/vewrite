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
  
  // console.log('Data:', data)

  if(data.length == 0) {
    createProfile(user.value)
    return
  }
  userStore.setUser(data[0])
}

async function createProfile(user) {

  console.log('Creating new user:', user)

  try {
    loading.value = true

    const newUser = {
      id: user.id,
      email: user.email,
      username: '',
      firstTime: true,
      avatar_url: '',
      website: '',
      persona: '',
    }

    // let { error } = await supabase.from('clients').upsert(updates, {
    //     returning: 'minimal', // Don't return the value after inserting
    // })

    const { data, error } = await supabase
      .from('profiles')
      .insert(newUser)

    if (error) throw error

    return data

  } catch (error) {
    console.error('Error creating new user:', error)
  } finally {
    loading.value = false
  }
}

// Watch for changes in the user object
watch(user, async (newUser) => {
  if (newUser) {
    await fetchUser();
    loading.value = false;
  }
});

// Call the user store and set the user using the Supabase user
onMounted(async () => {
  // console.log('User:', user.value)
  if (user.value) {
    await fetchUser();
    loading.value = false;
  } else {
    // because we are not logged in, and now need to show the auth component
    loading.value = false;
  }
});

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
  }
}

</style>