<template>
  <main id="Vewrite">
    <Mobile />
    <Sidebar />
    <main>
      <slot />
    </main>
    <Modal />
  </main>
</template>

<script setup>

import Sidebar from '~/components/Sidebar/Sidebar.vue'
import Mobile from '~/components/Sidebar/Mobile.vue'

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#Vewrite {
  display: flex;
  flex-direction: row;
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
}

</style>