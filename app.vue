<template>
  <div id="vewrite">
    <Loading class="on-top" :hasLogo="true" v-if="loading" />
    <div class="app" v-if="user">
      <main v-if="userStore.firstTime == false">
        <section class="zoom">
          <Sidebar />
          <NuxtPage />
        </section>
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

console.log('App.vue')

import FirstTime from '~/components/Onboarding/Firsttime.vue'

// Supabase setup
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)

// User store
import { useUser } from '@/stores/user'
const userStore = useUser()

// Profile composable
import useProfile from '~/composables/useProfile'
const { createProfile } = useProfile()

// Group composable
import useGroup from '~/composables/useGroup'
const { createGroup, GroupData, GroupError } = useGroup()

console.log(user.value)
if (user.value) {
  const group = ref({owner_id: user.value.id})
} else {
  const group = ref(null)
}


// Pull the user state from the database, then pass that into the user store
const fetchUser = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)

  if (error) throw error

  if(data.length == 0) {
    createProfile(user.value)
    createGroup(group)
    return
  }
  userStore.setUser(data[0])
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
    perspective: 1000px;

    .zoom {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
    }
  }
}

.zoom {
  transition: all 0.42s ease-in-out;
}

.no-scroll {
  overflow: hidden;

  .zoom {
    transform: scale(0.88);
  }
}

</style>