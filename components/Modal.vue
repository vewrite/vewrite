<template>
  <main id="Modal" :class="visibleClass">
    <div class="modal-body" :class="[visibleClass, typeClass]">
      <div class="header">
        <!-- <slot name="header"></slot> -->
         {{ header }}
        <div class="modal-close" @click="close"></div>
      </div>
      <div class="body">
        <component :is="contentComponent" />
      </div>
    </div>
  </main>
</template>

<script setup>

import { useModal } from '~/stores/modal'

import DeleteProjectModal from '~/components/Projects/DeleteProjectModal.vue'

const modal = useModal()

const visibleClass = computed(() => {
  return modal.visible ? 'visible' : ''
})

const typeClass = computed(() => {
  return modal.type
})

const header = computed(() => {
  return modal.header
})

const contentComponent = computed(() => {
  const components = {
    'DeleteProjectModal': DeleteProjectModal
  }
  return components[modal.content]
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
  background-color: rgba($black, .2);
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
    border-radius: $br-xl;
    overflow: auto;
    width: 100%;
    height: 100%;
    box-shadow: $main-shadow;

    &.small {
      width: 400px;
      height: auto;
    }

    &.visible {
      animation: scaleBounce 0.4s both 0.2s;
    }

    .header {
      background-color: rgba($purple, 1);
      color: $white;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 74px;
      width: 100%;
      padding: 0 $spacing-md;
      position: relative;
      font-size: $font-size-sm;
      font-weight: 600;

      .modal-close {
        cursor: pointer;
        position: absolute;
        right: $spacing-md;
        top: 50%;
        transform: translateY(-50%);
        color: $white;
        
        &:before {
          content: '×';
          font-size: $font-size-lg;
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
    }
  }
}

</style>