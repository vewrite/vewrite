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

const props = defineProps({
  completedDeliverables: Number,
  totalDeliverables: Number,
  deliverables: Array
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.project-deliverables-status {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 $spacing-md $spacing-md;
  border-bottom: $border;
  background: $white linear-gradient(180deg, $white 80%, rgba($brand, 0.05));
  width: calc(100%);
  transition: bottom 0.2s ease;

  .progress-status { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-xxs;
    width: 100%;

    span {
      font-size: $font-size-xs;
      font-weight: 400;
      color: rgba($black, 0.5);
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
      border: $border;
      box-shadow: $soft-shadow;

      .progress {
        height: 6px;
        border-radius: $br-md;
        background: linear-gradient(to right, $brand, $brand, $mint);
        transition: width 0.42s ease-in-out;

        &.completed {
          background: $mint;
        }
      }

    }
  }
}


</style>