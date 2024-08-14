<template>
  <div :class="['icon', type]"></div>
</template>

<script setup>

defineProps({
  type: String
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.icon {
  width: 24px;
  height: 24px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  &.approve {
    background-image: url('/icons/approve.svg');
  }

  &.chart {
    background-image: url('/icons/chart.svg');
  }

  &.client {
    background-image: url('/icons/client.svg');
  }

  &.doc {
    background-image: url('/icons/doc.svg');
  }

  &.folder {
    background-image: url('/icons/folder.svg');
  }

  &.grid {
    background-image: url('/icons/grid.svg');
  }

  &.list {
    background-image: url('/icons/list.svg');
  }

  &.rightArrow {
    background-image: url('/icons/right-arrow.svg');
  }

  &.star {
    background-image: url('/icons/star.svg');
  }

  &.wallet {
    background-image: url('/icons/wallet.svg');
  }

  &.workflow {
    background-image: url('/icons/workflow.svg');
  }
}

</style>