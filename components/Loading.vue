<template>
  <main id="Loading" :class="[zeroHeight]">
    <Logo v-if="hasLogo" />
    <div :class="['spinner', type]"></div>
  </main>
</template>

<script setup>

const props = defineProps(['type', 'hasLogo', 'zeroHeight'])
const { path } = toRefs(props)

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#Loading {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  z-index: 10;

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