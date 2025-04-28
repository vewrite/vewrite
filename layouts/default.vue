<template>
  <Loading v-if="loading" />
  <Firsttime v-if="!loading && isNewUser == true" @closeOnboarding="close" />
  <main id="Vewrite" v-if="!loading && isNewUser == false">
    <div class="mobile-warning">
      <Icon name="fluent:warning-12-regular" size="4rem" />
      <h2>Warning</h2>
      <p>Vewrite is not optimized for mobile devices. Please use a desktop or laptop for the best experience.</p>
    </div>
    <TopBar />
    <section class="go">
      <main>
        <slot />
      </main>
      <Modal />
    </section>
  </main>
</template>

<script setup>

import useProfile from '~/composables/useProfile'
const { createProfile, ProfileData } = useProfile()

import { useUser } from '@/stores/user'
const userStore = useUser()

const supabase = useSupabaseClient()
const user = useSupabaseUser()

import { useRouter } from 'vue-router';
const router = useRouter();

// This covers users who aren't logged in and solves all of the issues in https://github.com/vewrite/vewrite/issues/97
if (user.value == null) {
  router.push('/login')
}

const isNewUser = ref(false)
const hasPersonalClient = ref(false)
const loading = ref(true)

async function checkUser() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (error) { throw error }

    if (!data || data.first_time === true) {
      isNewUser.value = true
      userStore.setFirstTime(data)
    } 
    loading.value = false

  } catch (error) {
    isNewUser.value = true
    loading.value = false
  }
}

// This is a check for if the user already has a "personal" column in the results of the clients. If not, we'll go and create it.
async function checkClient() {
  console.log("Checking for personal client")
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('created_by', user.value.id)

    if (error) { throw error }

    // I need to check if there is at least one personal client in the data
    let personalClient = false


    data.forEach((client) => {
      if (client.personal === true) {
        personalClient = true
      } 
    })

    if (!personalClient) {
      await createPersonalClient(user.value)
      hasPersonalClient.value = true
    } else {
      hasPersonalClient.value = true
    }

  } catch (error) {
    console.error(error)
    loading.value = false
  }
}

async function createPersonalClient() {
  const { data, error } = await supabase
    .from('clients')
    .insert([
      {
        personal: true,
        name: 'My Personal Projects',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: user.value.id,
        logo_url: ''
      }
    ])
  if (error) throw error
}

function close () {
  isNewUser.value = false
}

onMounted(() => {
  checkUser()
  checkClient()
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.mobile-warning {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($white, 0.6);
  backdrop-filter: blur(50px);
  color: $black;
  font-size: $font-size-sm;
  padding: $spacing-xl;
  z-index: 9999;

  h2 {
    font-size: $font-size-lg;
    margin: 0;
  }

  @media (max-width: 960px) {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: $font-size-xs;
  }
}

#Vewrite {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  @media (max-width: 960px) {
    flex-direction: column;
  }

  .app, main {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .go {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}

</style>