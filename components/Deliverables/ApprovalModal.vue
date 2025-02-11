<template>
  <div id="ApprovalModal">
    <div class="modal-body">
      <Loading class="loading" v-if="loading" type="small" />
      <pre v-if="modalProps">{{ modalProps }}</pre>
    </div>
    
    <div class="buttons">
      <button @click="handleCreateDeliverable(deliverable, projectId)" class="primary large">Create</button>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { defineProps } from 'vue';
import { useModal } from '~/stores/modal'

// Access the useModal store
const modalStore = useModal();
const modalProps = modalStore.props;

const loading = ref(false);

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#ApprovalModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .modal-body {
    width: 100%;

    .loading {
      margin: $spacing-lg auto;
    }

    p {
      margin: 0;
    }

    #content-requirements {
      height: 180px;
      margin-bottom: 0;
    }
  }

  .due-date {
    border: $border;
    margin-bottom: $spacing-sm;
    padding: $spacing-sm;
    border-radius: $br-lg;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: $font-size-xs;
    color: rgba($black, 0.65);
    background: rgba($gray-light, 0.25);
    min-height: 72px;
  }

  .team-assignment {
      display: flex;
      flex-direction: column;
      width: 100%;
      border: $border;
      border-radius: $br-lg;
      min-height: 300px;
      max-height: 300px;
      overflow-y: auto;
      background: rgba($gray-light, .25);
      position: relative;

      .form-required {
        top: .9rem;
        z-index: 10;
      }

      .members {
        display: flex;
        flex-direction: column;
        border-radius: $br-lg;
        position: relative;

        .members-title {
          font-size: $font-size-xs;
          color: rgba($black, 0.65);
          padding: $spacing-sm;
          background: linear-gradient(to bottom, rgba($white, 1), rgba($white, 0.85));
          backdrop-filter: blur(5px);
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .member {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: $spacing-xs;
          border-bottom: $border;
          padding: $spacing-sm;

          .role-selector {
            display: flex;
            flex-direction: row;
            align-items: center;
            overflow: hidden;
            gap: $spacing-xs;
            cursor: pointer;

            .single-role {
              background: rgba($black, 0.05);
              padding: $spacing-xxs $spacing-sm;
              border-radius: $br-lg;

              &.selected {
                background: rgba($brand, 0.15);
                color: $brand;
              }
            }
          }

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-xs;
      color: $red;
    }
  }
}

</style>