<template>
  <main id="Modal" :class="visibleClass">
    <div class="shade" @click="close()"></div>
    <div class="modal-body" :class="[visibleClass, typeClass]">
      <div class="header">
        <h3>{{ header }}</h3>
        <div class="button modal-close" @click="close">
          <Icon name="fluent-mdl2:chrome-close" size="1rem" />
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
import CreateProjectModal     from '~/components/Projects/CreateProjectModal.vue'
import DeleteProjectModal     from '~/components/Projects/DeleteProjectModal.vue'

// Deliverable modals
import CreateDeliverableModal from '~/components/Projects/CreateDeliverableModal.vue'
import DeleteDeliverableModal from '~/components/Projects/DeleteDeliverableModal.vue'
import ChangeAssignmentsModal from '~/components/Deliverables/ChangeAssignmentsModal.vue'
import ApprovalModal          from '~/components/Deliverables/ApprovalModal.vue'

// Workflow modals
import CreateWorkflowModal    from '~/components/Workflows/CreateWorkflowModal.vue'
import DeleteWorkflowModal    from '~/components/Workflows/DeleteWorkflowModal.vue'

// Client modals
import CreateClientModal      from '~/components/Clients/CreateClientModal.vue'
import DeleteClientModal      from '~/components/Clients/DeleteClientModal.vue'

// Team modals
import CreateTeamModal        from '~/components/Teams/CreateTeamModal.vue'
import DeleteTeamModal        from '~/components/Teams/DeleteTeamModal.vue'

// Team Members modals
import AddTeamMemberModal     from '~/components/TeamMembers/AddTeamMemberModal.vue'

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
    'DeleteDeliverableModal': DeleteDeliverableModal,
    'CreateWorkflowModal': CreateWorkflowModal,
    'DeleteWorkflowModal': DeleteWorkflowModal,
    'CreateClientModal': CreateClientModal,
    'DeleteClientModal': DeleteClientModal,
    'CreateTeamModal': CreateTeamModal,
    'DeleteTeamModal': DeleteTeamModal,
    'AddTeamMemberModal': AddTeamMemberModal,
    'ChangeAssignmentsModal': ChangeAssignmentsModal,
    'ApprovalModal': ApprovalModal
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
    background-color: rgba($brand, 0.05);
    backdrop-filter: blur(10px);
  }

  &.visible {
    opacity: 1;
    pointer-events: all;
  }

  .modal-body {
    border-radius: $br-lg;
    overflow: auto;
    width: 100%;
    height: 100%;
    background-color: rgba($white, 1);
    box-shadow: $big-shadow;

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