<template>
  <div class="deliverables-list">
    <div class="no-deliverables" v-if="deliverables.length == 0">
      <p>No deliverables found for this project</p>
    </div>
    <div v-if="deliverables.length > 0" class="project-deliverables">
      <div class="single-deliverable" v-if="deliverables.length > 0" v-for="deliverable in deliverables">
        <div class="deliverable-details">
          <div class="deliverable-type">
            <Icon v-if="deliverable.content.type == 'link'" name="fluent:open-16-regular" size="1.5rem" />
            <Icon v-if="deliverable.content.type == 'content'" name="fluent:document-16-regular" size="1.5rem" />
          </div>
          <span class="deliverable-id">{{ deliverable.id }}</span>
          <router-link :to="'/deliverable/' + deliverable.id" class="deliverable-title">{{ deliverable.title }}</router-link>
        </div>
        <div class="deliverable-actions">
          <span class="deliverable-state" :class="deliverable.state_name == 'Approved' ? 'approved' : ''"><Icon v-if="deliverable.state_name == 'Approved'" name="fluent:checkmark-16-regular" size="1.5rem" />{{ deliverable.state_name }}</span>
          <Dropdown>
            <template v-slot:trigger>
              Due {{ deliverable.formattedDueDate }}
            </template>
            <template v-slot:menu>
              <VDatePicker :id="'deliverable-calendar-' + deliverable.id" :attributes="deliverable.attrs" v-model="deliverable.selectedDate" @update:modelValue="onDateSelect(deliverable.id, deliverable.selectedDate)" borderless />
            </template>
          </Dropdown>
          <Icon class="right-arrow" name="fluent:chevron-right-16-regular" size="1.5rem" />
        </div>
      </div>
      <div class="no-deliverables" v-if="deliverables.length == 0">
        <p>No deliverables found for this search</p>
      </div>
    </div>
  </div>
</template>

<script setup>

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { onDateSelect } = useDeliverables();

const props = defineProps({
  deliverables: Array,
  project: Object
});

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.deliverables-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1600px;
  margin: $spacing-md auto 0;
  border: $border;
  border-bottom: none;
  border-radius: $br-lg $br-lg 0 0;
  gap: $spacing-sm;
  height: 100%;


  .no-deliverables {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: $gray;
    font-size: $font-size-sm;
    padding: $spacing-sm;

    p {
      margin: 0;
    }
  }

  .project-deliverables {
    display: flex;
    flex-direction: column;
    gap: 2px;
    height: 100%;

    .single-deliverable {
      padding: $spacing-sm;
      width: 100%;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.2s ease;
      border-bottom: $border;

      @media (max-width: 960px) {
        flex-direction: column;
        align-items: flex-end;
        gap: $spacing-xs;
      }

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: rgba($black, 0.025);

        .deliverable-actions {
          .right-arrow {
            width: 18px;
          }
        }
      }

      .deliverable-details {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-xs;
        width: 100%;
        height: 44px;

        .deliverable-id {
          color: $gray-dark;
          font-size: $font-size-xs;
          padding-right: $spacing-xs;
          border-right: $border;
        }

        .deliverable-type {
          display: flex;
          align-items: center;
          justify-content: center;
          color: $gray-dark;
        }

        .deliverable-title {
          color: $black;
          text-decoration: none;
          font-size: $font-size-xs;
          width: 100%;
          line-height: 44px;

          @media (max-width: 960px) {
            line-height: initial;
          }
        }
      }

      .deliverable-title {
        color: $black;
        text-decoration: none;
      }

      .deliverable-actions {
        display: flex;
        align-items: center;
        gap: $spacing-xs;

        .deliverable-state {
          color: $black;
          font-size: $font-size-xs;
          border: $border;
          padding: $spacing-xxxs $spacing-xs;
          border-radius: $br-lg;
          text-wrap: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: $spacing-xxxs;

          &.approved {
            background: rgba($mint, 0.1);
            color: $mint;
            border: 1px solid rgba($mint, 0.2);
          }

        }

        .deliverable-updated-at {
          color: $gray-dark;
          font-size: $font-size-xs;
          text-wrap: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          @media (max-width: 960px) {
            font-size: $font-size-xxs;
          }
        }

        .deliverable-workflow-state {
          position: relative;
          cursor: pointer;
          text-wrap: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          .deliverable-workflow-state-popup {
            position: absolute;
            top: calc(100% + 2px);
            right: 0;
            z-index: 1000;
            display: none;
          }
        }

        .right-arrow {
          width: 0;
          overflow: hidden;
          transition: width 0.2s ease;
        }

        .deliverable-calendar {
          display: flex;
          position: relative;
        
          .deliverable-duedate {
            cursor: pointer;
          }
        }
      }
    }
  }
}

</style>