<template>
  <Loading class="on-top" :hasLogo="true" v-if="loading" />
  <div id="vewrite">
    <div class="app" v-if="HasUser">
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
const { createProfile, fetchSingleProfile, ProfileData, ProfileError } = useProfile()
  
const HasUser = ref(false)

// Watch for changes in the user object
watch(user, async (newUser) => {
  console.log("User changed", newUser);
  if (newUser) {
    await fetchSingleProfile(user.value.id);
    HasUser.value = true;
    userStore.setUser(ProfileData.value);
    loading.value = false;
  } else {
    loading.value = false;
    HasUser.value = false;
  }
});


// Call the user store and set the user using the Supabase user
onMounted(async () => {

  if (user.value) {
    await fetchSingleProfile(user.value.id);

    if (ProfileData.value === null) {
      await createProfile(user.value);
    } else {
      console.log("Setting user store", ProfileData.value);
      userStore.setUser(ProfileData.value);
    }

    loading.value = false;
  } else {
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

#DevDrawer {
  position: fixed;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(10px);
  color: white;
  z-index: 1000;
  border-radius: $br-lg 0 0 0;
}

</style>