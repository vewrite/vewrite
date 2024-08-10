<template>
  <div id="vewrite">
    <Sidebar />
    <NuxtPage />
    <Modal />
  </div>
</template>

<script setup>

import { useModal } from '~/stores/modal'



</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#vewrite {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

</style>