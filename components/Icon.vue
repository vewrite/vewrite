<template>
  <div :class="['icon', type]"></div>
</template>

<script setup>

defineProps({
  type: String
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.icon {
  width: 24px;
  height: 24px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  &.rightArrow {
    background-image: url('/icons/right-arrow.svg');
  }
}

</style>