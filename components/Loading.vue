<template>
  <main id="Loading">
    <div class="spinner"></div>
  </main>
</template>

<script setup>

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#Loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: $spacing-md;
  
  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 4px solid $purple;
    border-top-color: transparent;
    animation: spin .5s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}

</style>