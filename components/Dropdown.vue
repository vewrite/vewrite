<template>
  <div :class="[ 'dropdown', size, isOpen ? 'open' : '' ]">
    <div @click="toggleDropdown" class="button">
      <slot name="trigger"></slot>
    </div>
    <div class="dropdown-content" @click="toggleDropdown">
      <slot name="menu"></slot>
    </div>
    <div class="blur" v-if="isOpen" @click="toggleDropdown"></div>
  </div>
</template>

<script setup>

import { ref } from 'vue';

const props = defineProps('size');

const isOpen = ref(false);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

</script>

<style lang="scss">

@use 'assets/variables' as *;


@keyframes scaleBounce {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  60% {
    transform: scale(1.005);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.dropdown {
  position: relative;
  display: inline-block;

  .button {
    display: flex;
    align-items: center;
    gap: $spacing-xxs;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: $white;
    min-width: 240px;
    box-shadow: $big-shadow;
    z-index: 2;
    right: 0;
    padding: $spacing-xs;
    border-radius: $br-md;
    animation: scaleBounce 0.3s ease;
  }

  &.open {
    .dropdown-content {
      display: flex;
      flex-direction: column;
      gap: $spacing-xxs;
      animation: scaleBounce 0.3s ease;
    }
  }
}

.dropdown-item {
  padding: $spacing-xxs $spacing-xs;
  cursor: pointer !important;
  border-radius: $br-md;
  text-decoration: none;

  &.active {
    background-color: rgba($brand, 1);
    color: $white;
  }

  &:hover {
    background-color: rgba($brand, 0.05);

    &.active {
      background-color: rgba($brand, 0.9);
    }
  }
}

.blur {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

</style>