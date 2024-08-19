<template>
  <div class="project-deliverables-status">
    <div class="progress-status">
      <span>Progress</span>
      <span>{{ project.complete }} / {{ project.deliverables.length }}</span>
    </div>
    <div class="progress-content">
      <div class="empty-deliverables" v-if="project.deliverables.length == 0">
        <span>No deliverables</span>
      </div>
      <div class="deliverables" v-else>
        <div class="progress-bar">
          <div class="progress" :style="{ width: (project.complete / project.deliverables.length) * 100 + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.project-deliverables-status {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: absolute;
  bottom: $spacing-md;
  width: calc(100% - #{$spacing-md * 2});
  transition: bottom 0.2s ease;

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
        background-color: $purple;
      }

    }
  }
}


</style>