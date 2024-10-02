<template>
  <div class="state">
    <div class="icon">{{ stateDetails(props.state).icon }}</div>
    {{ stateDetails(props.state).name }}
  </div>
</template>

<script setup>

const props = defineProps(['state'])

function stateDetails(stateId) {
  const details = {};

  switch (stateId) {
    case 1:
      details.icon = '🚀';
      details.name = 'In Progress';
      break;
    case 2:
      details.icon = '🚦';
      details.name = 'Pending';
      break;
    case 3:
      details.icon = '🏁';
      details.name = 'Completed';
      break;
    default:
      details.icon = '❓';
      details.name = 'Unknown';
  }

  return details;
}

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

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba($black, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

</style>