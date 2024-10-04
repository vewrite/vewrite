<template>
  <main id="Modal" :class="visibleClass">
    <div class="shade" @click="close()"></div>
    <div class="modal-body" :class="[visibleClass, typeClass]">
      <div class="header">
         {{ header }}
        <div class="modal-close" @click="close"></div>
      </div>
      <div class="body">
        <Loading v-if="loading" type="small" class="padded-loader" />
        <component v-if="!loading" :is="contentComponent" />
      </div>
    </div>
  </main>
</template>

<script setup>

import { useModal } from '~/stores/modal'

import DeleteProjectModal from '~/components/Projects/DeleteProjectModal.vue'
import CreateDeliverableModal from '~/components/Projects/CreateDeliverableModal.vue'
import CreateWorkflowModal from '~/components/Workflows/CreateWorkflowModal.vue'
import DeleteWorkflowModal from '~/components/Workflows/DeleteWorkflowModal.vue'

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

const loading = computed(() => {
  return modal.loading
})

const contentComponent = computed(() => {
  const components = {
    'DeleteProjectModal': DeleteProjectModal,
    'CreateDeliverableModal': CreateDeliverableModal,
    'CreateWorkflowModal': CreateWorkflowModal,
    'DeleteWorkflowModal': DeleteWorkflowModal
  }
  return components[modal.content]
})

const close = () => {
  modal.visible = false
  modal.reset()
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
  z-index: 1000;
  opacity: 0;
  pointer-events: none;

  .shade {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($black, .2);
    backdrop-filter: blur(8px);
  }

  &.visible {
    opacity: 1;
    pointer-events: all;
  }

  .modal-body {
    background-color: $white;
    border-radius: $br-md;
    overflow: auto;
    width: 100%;
    height: 100%;
    box-shadow: $main-shadow;

    &.small {
      width: 400px;
      height: auto;
    }

    &.medium {
      width: 600px;
      height: auto;
    }

    &.visible {
      animation: scaleBounce 0.4s both 0.2s;
    }

    .header {
      background-color: rgba($brand, 1);
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

      .padded-loader {
        padding: $spacing-xxl;
      }
    }
  }
}

</style>