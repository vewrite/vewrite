<template>
  <Loading v-if="loading" />
  <Firsttime v-if="!loading && isNewUser == true" @closeOnboarding="close" />
  <main id="Vewrite" v-if="!loading && isNewUser == false">
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
const { createProfile } = useProfile()

import { useUser } from '@/stores/user'
const userStore = useUser()

const supabase = useSupabaseClient()
const user = useSupabaseUser()

import { useRouter } from 'vue-router';
const router = useRouter();

// This covers users who aren't logged in and solves all of the issues in https://github.com/vewrite/vewrite/issues/97
if(user.value == null) {
  router.push('/login')
}

/*

If the user is new, show the onboarding screen
- Check if the user has a profile
- If not, create one

If the user is not new, show the main app

*/
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
    console.log("There is no profile for this user. Creating now.")
    await createProfile(user.value)
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