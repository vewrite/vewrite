<template>
  <main id="Modal" :class="visibleClass">
    <div class="shade" @click="close()"></div>
    <div class="modal-body" :class="[visibleClass, typeClass]">
      <div class="header">
        <h3>{{ header }}</h3>
        <div class="button modal-close" @click="close">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.35355 1.35355C9.54882 1.15829 9.54882 0.841708 9.35355 0.646446C9.15829 0.451184 8.84171 0.451184 8.64645 0.646446L4.99999 4.2929L1.35355 0.646455C1.15829 0.451193 0.841705 0.451193 0.646442 0.646455C0.45118 0.841717 0.45118 1.1583 0.646442 1.35356L4.29289 5.00001L0.646441 8.64645C0.451179 8.84171 0.451178 9.1583 0.646441 9.35356C0.841703 9.54882 1.15829 9.54882 1.35355 9.35356L4.99999 5.70711L8.64645 9.35357C8.84171 9.54883 9.15829 9.54883 9.35355 9.35357C9.54882 9.15831 9.54882 8.84172 9.35355 8.64646L5.7071 5.00001L9.35355 1.35355Z" fill="black" fill-opacity="0.3"/>
          </svg>
        </div>
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

// Team modals
import CreateTeamModal from '~/components/Teams/CreateTeamModal.vue'
import DeleteTeamModal from '~/components/Teams/DeleteTeamModal.vue'

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
    'CreateTeamModal': CreateTeamModal,
    'DeleteTeamModal': DeleteTeamModal,
  }
  return components[modal.content]
})

const close = () => {
  modal.toggleVisibility()
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
    border-radius: $br-lg;
    overflow: auto;
    width: 100%;
    height: 100%;
    box-shadow: $main-shadow;
    background: $white linear-gradient(-135deg, rgba($brand, 0.15) 0%, rgba($brand, 0.025) 35%);
    box-shadow: inset 0 0 20px white, 0 0 10px 0 rgba($black, 0.1);

    .inner-container {
      padding: 0 !important;
    }

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

    &.full {
      width: 100%;
      height: 100%;
      border-radius: 0;

      .body {
        max-width: 1000px;
        margin: 0 auto;
      }
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
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 88px;
      width: 100%;
      padding: 0 $spacing-md 0 $spacing-md;
      position: relative;

      h3 {
        margin: 0;
        font-size: $font-size-lg;
      }

      .modal-close {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 50%;
        color: $brand;
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
      height: calc(100% - 88px);
      overflow-y: auto;
      position: relative;

      .padded-loader {
        padding: $spacing-xxl;
      }
    }
  }
}

</style>