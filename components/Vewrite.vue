<template>
  <div id="vewrite">
    <main v-if="userStore.firstTime == true">
      <FirstTime />
    </main>
    <main v-else>
      <Sidebar />
      <NuxtPage />
      <Modal />
    </main>
  </div>
</template>

<script setup>

import FirstTime from '~/components/Onboarding/Firsttime.vue'
import { useModal } from '~/stores/modal'

// User store
import { useUser } from '@/stores/user'
const userStore = useUser()

console.log(userStore)

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#vewrite {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }
}

</style>