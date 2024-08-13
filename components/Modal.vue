<template>
  <main id="Modal" :class="visibleClass">
    <div class="modal-body" :class="visibleClass">
      <div class="header">
        <slot name="header"></slot>
        <div class="modal-close" @click="close"></div>
      </div>
      <div class="body">
        <slot name="body"></slot>
        {{ visibleClass }}
      </div>
    </div>
  </main>
</template>

<script setup>

import { useModal } from '~/stores/modal'

const modal = useModal()

const visibleClass = computed(() => {
  return modal.visible ? 'visible' : ''
})

const close = () => {
  modal.visible = false
}

computed(() => {
  if (modal.visible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

</script>

<style lang="scss" scoped>

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

#Modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: $spacing-md;
  background-color: rgba($white, .2);
  backdrop-filter: blur(8px);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease-in-out;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }

  .modal-body {
    background-color: $white;
    border: 1px solid #EFE5FD;
    border-radius: $br-xl;
    overflow: auto;
    width: 100%;
    height: 100%;
    box-shadow: $main-shadow;

    &.visible {
      animation: scaleBounce 0.4s both 0.2s;
    }

    .header {
      background-color: rgba($white-dark, 0.25);
      color: $black;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 75px;
      width: 100%;
      padding: 0 $spacing-md;
      position: relative;
      font-size: $font-size-lg;
      font-family: $font-family-secondary;
      font-weight: 400;

      .modal-close {
        cursor: pointer;
        position: absolute;
        right: $spacing-md;
        top: 50%;
        transform: translateY(-50%);
        
        &:before {
          content: '×';
          font-size: $font-size-xl;
        }
      }

      .app-panel-header-buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: $spacing-xs;
      }
    }

    .body {
      height: calc(100% - 75px);
      overflow-y: auto;
      position: relative;
      padding: $spacing-lg;
    }
  }
}

</style>