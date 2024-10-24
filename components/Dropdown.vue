<template>
  <div class="dropdown" :class="{ open: isOpen }">
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

const isOpen = ref(false);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

</script>

<style scoped lang="scss">

@import 'assets/_variables.scss';


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

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: $white;
    min-width: 160px;
    box-shadow: $main-shadow;
    z-index: 2;
    right: 0;
    top: 32px;
    padding: $spacing-sm;
    border-radius: $br-lg;
    animation: scaleBounce 0.3s ease;
  }

  &.open {
    .dropdown-content {
      display: block;
      animation: scaleBounce 0.3s ease;
    }
  }
}

.dropdown-item {
  padding: $spacing-xs $spacing-sm;
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