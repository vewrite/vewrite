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
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  border: 1px solid rgba($black, 0.1);
  border-radius: $br-md;

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba($black, 0.1);
  }
}

</style>