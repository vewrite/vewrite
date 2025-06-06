<template>
  <div :class="[ 'dropdown', isOpen ? 'open' : '', props.position ]">
    <div @click="toggleDropdown" :class="['button', props.primary ? 'primary' : '', props.vertical ? 'vertical' : '', props.clear ? 'clear' : '', props.white ? 'white' : '', props.typeselect ? 'type-select' : '']">
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
const props = defineProps(['position', 'primary', 'vertical', 'clear', 'white', 'typeselect']);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

</script>

<style lang="scss">

@use 'assets/variables' as *;


@keyframes scaleBounce {
  0% {
    transform: scale(0.5);
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
  display: inline-flex;
  flex-direction: row;

  .button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: $spacing-xxs;

    &.type-select {
      justify-content: space-between;
      min-width: 140px;
    }

    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;
      gap: $spacing-xxs;
      width: 100%;
    }

    &.vertical {
      flex-direction: column;
      align-items: flex-start;
      padding: $spacing-xs $spacing-md;
      height: 100%;
      gap: 0;
    }
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: rgba($white, 0.65);
    backdrop-filter: blur(20px);
    min-width: 240px;
    box-shadow: $soft-shadow;
    z-index: 100;
    right: 0;
    padding: $spacing-xxs;
    border-radius: $br-lg;
    animation: scaleBounce 0.4s ease;
    transform-origin: top right;
    height: auto;
  }

  &.top {
    .dropdown-content {
      bottom: 100%;
      transform-origin: bottom right;
    }
  }

  &.left {
    .dropdown-content {
      left: 0;
      right: auto;
      transform-origin: top left;
      top: 100%;
    }
  }

  &.center {
    .dropdown-content {
      left: auto;
      right: 0;
      transform-origin: top center;
      top: 100%;
    }
  }

  &.open {
    .dropdown-content {
      display: flex;
      flex-direction: column;
      gap: $spacing-xxs;
      animation: scaleBounce 0.4s ease;
      top: 100%;
    }
  }
}

.dropdown-item {
  padding: $spacing-xs $spacing-sm;
  cursor: pointer !important;
  border-radius: $br-md;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-xs;
  color: $black;
  font-weight: bold;

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

.dropdown-header {
  padding: $spacing-xs $spacing-xs 0;
  font-size: $font-size-xxs;
  color: rgba($black, 0.5);
  font-weight: bold;
  text-transform: uppercase;
}

.dropdown-divider {
  width: 100%;
  height: 1px;
  background-color: rgba($black, 0.1);
  margin: $spacing-xxs $spacing-xxs 0;
}

.blur {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
}

</style>