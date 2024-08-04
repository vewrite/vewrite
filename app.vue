<template>
  <div class="app-wrapper">
    <Vewrite v-if="user" />
    <Auth v-else />
      <!-- <Account v-if="user" />
      <Auth v-else /> -->
  </div>
</template>

<script setup>
const user = useSupabaseUser()
</script>

<style lang="scss">

@import 'assets/_variables.scss';

.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

</style>