<template>
  <main id="Vewrite">
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