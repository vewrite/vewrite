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

async function checkUser() {
  if (user.value) {
    await fetchSingleProfile(user.value.id);
    // console.log('Current ProfileData:', ProfileData.value);
    if (ProfileData.value === undefined) {
      // console.log("Creating profile because ProfileData was undefined");
      await createProfile(user.value);
      await checkUser();
    } else {
      // console.log("ProfileData found. Setting user store with ProfileData", ProfileData.value);
      userStore.setUser(ProfileData.value);
      HasUser.value = true;
    }
    loading.value = false;
  } else {
    HasUser.value = false;
    loading.value = false;
  }
}

// Watch for changes in the user object
watch(user, async (newUser) => {
  console.log('User changed', newUser);
  if (newUser) {
    await checkUser();
  } else {
    HasUser.value = false;
    loading.value = false;
  }
});

onMounted(async () => {
  await checkUser();
});

// const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//     if (event === 'SIGNED_IN') {
//         console.log("User signed in:", session);
//         // Update your app's state or store user data here
//     } else if (event === 'SIGNED_OUT') {
//         console.log("User signed out");
//         // Handle any clean-up or redirects here
//     } else if (event === 'TOKEN_REFRESHED') {
//         console.log("Token refreshed:", session);
//         // Update token/session state here to keep user logged in
//     } else if (event === 'USER_UPDATED') {
//         console.log("User data updated:", session);
//         // Useful if user profile or permissions change
//     }
// });

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