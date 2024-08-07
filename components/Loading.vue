<template>
  <main id="Loading">
    <div :class="['spinner', type]"></div>
  </main>
</template>

<script setup>

const props = defineProps(['type'])
const { path } = toRefs(props)

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
  
  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 4px solid $purple;
    border-top-color: transparent;
    animation: spin .5s linear infinite;
    display: block;
    padding: 0;

    &.small {
      width: 20px;
      height: 20px;
      border: 2px solid $purple;
      border-top-color: transparent;
    }

    &.header {
      width: 20px;
      height: 20px;
      border: 2px solid $white;
      border-top-color: transparent;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}

</style>