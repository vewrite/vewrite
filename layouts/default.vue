<template>
  <main id="Vewrite">
    <Sidebar />
    <main>
      <slot />
    </main>
  </main>
</template>

<script setup>

import Sidebar from '~/components/Sidebar/Sidebar.vue'

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#Vewrite {
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