<template>
  <div class="state">
    <div class="icon"></div>
    {{ state }}
  </div>
</template>

<script setup>

const props = defineProps(['state'])


</script>

<style lang="scss" scoped>

@import "./assets/variables.scss";

.state {
  padding: $spacing-sm;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: $spacing-sm;
  border: 1px solid rgba($black, 0.1);
  background: $white;
  border-radius: $br-md;
  min-width: 180px;
  box-shadow: $main-shadow;

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba($black, 0.1);
  }
}

</style>