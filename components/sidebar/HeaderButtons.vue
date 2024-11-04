<template>
  <div id="HeaderButtons">
    <router-link class="button primary" to="/account">Account</router-link>  
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#HeaderButtons {
  display: flex;
  flex-direction: row;
  gap: $spacing-xs;
}

</style>