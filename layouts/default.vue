<template>
  <Firsttime v-if="isFirstTime == null || isFirstTime == true" @closeOnboarding="close" />
  <main id="Vewrite" v-else>
    <TopBar />
    <section class="go">
      <Sidebar />
      <main>
        <slot />
      </main>
      <Modal />
    </section>
  </main>
</template>

<script setup>

import TopBar from '~/components/TopBar/TopBar.vue'
import Sidebar from '~/components/Sidebar/Sidebar.vue'
import Firsttime from '~/components/Onboarding/Firsttime.vue'

import { useUser } from '@/stores/user'
const userStore = useUser()

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Check if is first time in the database, if so, show the onboarding. If not, set in the userStore.
const isFirstTime = ref(null)

async function checkFirstTime() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('firstTime')
      .eq('id', user.value.id)
      .single()

    if (error) {
      throw error
    }

    console.log(data)

    if (data) {
      isFirstTime.value = data.firstTime
      userStore.setFirstTime(data.firstTime)
    }
  } catch (error) {
    console.error(error)
  }
}

function close () {
  isFirstTime.value = false
}

onMounted(() => {
  checkFirstTime()
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