<template>
  <main id="Loading" :class="[zeroHeight, saving]">
    <Logo v-if="hasLogo" />
    <div :class="['spinner', type]"></div>
  </main>
</template>

<script setup>

const props = defineProps(['type', 'hasLogo', 'zeroHeight', 'saving'])

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#Loading {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  z-index: 10;

  &.saving {
    padding: $spacing-xxxs;
    height: 32px;
    width: 32px;
    position: absolute;
    top: $spacing-xxs;
    right: $spacing-xxs;
    z-index: 9999;
    background: rgba($white, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 50%;
  }

  &.zero-height {
    height: auto;
    padding: $spacing-lg;
  }

  &.on-top {
    position: fixed;
    z-index: 9999;
    background-color: rgba($white, 1);
    width: 100%;
    height: 100%;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 4px solid rgba($brand, .1);
    border-top-color: $brand;
    animation: spin .5s linear infinite;
    display: block;
    padding: 0;

    &.button {
      width: 16px;
      height: 16px;
      border: 1px solid rgba($white, .1);
      border-top-color: $white;
    }

    &.tiny {
      width: 16px;
      height: 16px;
      border: 1px solid rgba($brand, .1);
      border-top-color: $brand;
    }

    &.small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba($brand, .1);
      border-top-color: $brand;
    }

    &.header {
      width: 20px;
      height: 20px;
      border: 4px solid rgba($white, .1);
      border-top-color: $white;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}

</style>