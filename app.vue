<template>
  <div class="container" id="vewrite">
      <Account v-if="user" />
      <Auth v-else />
  </div>
</template>

<script setup>
const user = useSupabaseUser()
</script>

<style lang="scss">

@import 'assets/_variables.scss';

#vewrite {
  background: $black;
}

</style>