<template>
  <main id="Modal" :class="visibleClass">
    <div class="shade" @click="close()"></div>
    <div class="modal-body" :class="[visibleClass, typeClass]">
      <div class="header">
        <h3>{{ header }}</h3>
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

// Project modals
import CreateProjectModal from '~/components/Projects/CreateProjectModal.vue'
import DeleteProjectModal from '~/components/Projects/DeleteProjectModal.vue'

// Delivery modals
import CreateDeliverableModal from '~/components/Projects/CreateDeliverableModal.vue'

// Workflow modals
import CreateWorkflowModal from '~/components/Workflows/CreateWorkflowModal.vue'
import DeleteWorkflowModal from '~/components/Workflows/DeleteWorkflowModal.vue'

// Client modals
import CreateClientModal from '~/components/Clients/CreateClientModal.vue'
import DeleteClientModal from '~/components/Clients/DeleteClientModal.vue'

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
    'CreateProjectModal': CreateProjectModal,
    'DeleteProjectModal': DeleteProjectModal,
    'CreateDeliverableModal': CreateDeliverableModal,
    'CreateWorkflowModal': CreateWorkflowModal,
    'DeleteWorkflowModal': DeleteWorkflowModal,
    'CreateClientModal': CreateClientModal,
    'DeleteClientModal': DeleteClientModal,
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

@keyframes rightSlide {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  60% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(0);
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

    &.large {
      width: 1000px;
      height: auto;
    }

    &.right {
      width: 600px;
      height: 100%;
      border-radius: 0;
      align-self: flex-end;

      &.visible {
        animation: rightSlide 0.4s both 0.2s;
      }
    }

    &.visible {
      animation: scaleBounce 0.4s both 0.2s;
    }

    .header {
      background: rgba($brand, 0.025) linear-gradient(125deg, rgba($brand, 0.05) 0%, rgba($brand, 0.015) 10%);
      border-bottom: 1px solid rgba($brand, 0.15);
      color: $brand;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 66px;
      width: 100%;
      padding: 0 $spacing-md;
      position: relative;

      h3 {
        margin: 0;
        font-size: $font-size-md;
      }

      .modal-close {
        cursor: pointer;
        position: absolute;
        right: $spacing-md;
        top: 50%;
        transform: translateY(-50%);
        color: $brand;
        
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
      height: calc(100% - 66px);
      overflow-y: auto;
      position: relative;

      .padded-loader {
        padding: $spacing-xxl;
      }
    }
  }
}

</style>