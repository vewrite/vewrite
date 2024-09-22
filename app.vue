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

console.log("supabase user is: ", user.value)

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

  console.log("fetchUser returns: ", data)

  if (error) throw error
  
  if(data.length == 0) {
    createProfile(user.value)
    return
  }
  userStore.setUser(data[0])
  console.log("fetchUser returns: ", data)
}

async function createProfile(user) {
  try {
    loading.value = true

    const updates = {
      id: user.id,
      email: user.email,
      username: user.email.split('@')[0],
      website: '',
      avatar_url: '',
      tier: 'free',
      firstTime: true,
      persona: '',
      created_at: new Date(),
      updated_at: new Date(),
    }

    let { error } = await supabase.from('clients').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
    })

  } catch (error) {
    console.error('Error creating new user:', error)
  } finally {
    loading.value = false
  }
}

// Call the user store and set the user using the Supabase user
// onMounted(() => {
  
//   if (user.value) {
//     fetchUser()
//     loading.value = false
//   } else {
//     loading.value = false
//   }
// })

// Watch for changes in the user object
watch(user, async (newUser) => {
  if (newUser) {
    await fetchUser();
    loading.value = false;
  }
});

onMounted(async () => {
  if (user.value) {
    await fetchUser();
    loading.value = false;
  } else {
    // because we are not logged in
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
    flex-direction: row;
  }
}

</style>