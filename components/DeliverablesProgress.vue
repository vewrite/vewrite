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
  flex-direction: column-reverse;
  gap: $spacing-xxs;
  justify-content: flex-start;
  width: calc(100% - #{$spacing-md * 2});
  transition: bottom 0.2s ease;
  margin: $spacing-md $spacing-md 0;

  .progress-status { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    span {
      font-size: $font-size-xxs;
      color: rgba($black, 0.25);
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
      box-shadow: $main-shadow;

      .progress {
        height: 6px;
        border-radius: $br-md;
        background: linear-gradient(to right, $mint-light, $mint-light 80%, $brand 100%);
        transition: width 0.42s ease-in-out;

        &.completed {
          background: $mint-light;
        }
      }

    }
  }
}


</style>