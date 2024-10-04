<template>
  <div class="project-deliverables-status">
    <div class="progress-status" v-if="totalDeliverables > 0">
      <span>Progress</span>
      <span>{{ completedDeliverables }} / {{ totalDeliverables }}</span>
    </div>
    <div class="progress-content">
      <div class="deliverables" v-if="totalDeliverables > 0">
        <div class="progress-bar">
          <div class="progress" :class="completedDeliverables == totalDeliverables ? 'completed' : ''" :style="{ width: (completedDeliverables / totalDeliverables) * 100 + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const props = defineProps({
  completedDeliverables: Number,
  totalDeliverables: Number,
  deliverables: Array
});

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.project-deliverables-status {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: $spacing-md;
  border-bottom: 1px solid $gray-light;
  width: calc(100%);
  transition: bottom 0.2s ease;
  background-color: rgba($white, 0.65);

  .progress-status { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
    width: 100%;

    span {
      font-size: $font-size-sm;
      font-weight: 400;
      color: $gray-dark;
    }
  }

  .progress-content {
    width: 100%;

    .progress-bar {
      width: 100%;
      padding: 2px;
      min-height: 10px;
      border-radius: $br-md;
      background-color: $white;
      border: 1px solid $gray-light;

      .progress {
        height: 6px;
        border-radius: $br-md;
        background-color: $brand;
        transition: width 0.42s ease-in-out;

        &.completed {
          background-color: $mint;
        }
      }

    }
  }
}


</style>