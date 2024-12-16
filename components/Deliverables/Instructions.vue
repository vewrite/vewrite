<template>
  <section :class="['instructions', showInstructions ? 'show' : 'hide']">
    <div class="notification small">
      <Icon :name="props.icon" size="2rem" />
      <div class="instruction-set">
        <p>{{ props.content }}</p>
      </div>
      <button class="button small" @click="toggleInstructions">
        <Icon name="fluent-mdl2:chrome-close" size="1rem" />
      </button>
    </div>
    <button class="button small toggle-instruction-button" @click="toggleInstructions">
      <Icon :name="props.icon" size="2rem" />
    </button>
  </section>
</template>

<script setup>

const props = defineProps(['icon', 'title', 'content']);
const showInstructions = ref(true);

function toggleInstructions() {
  showInstructions.value = !showInstructions.value;
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.instructions {
  margin: 0 $spacing-sm;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;
  background: rgba($brand, 0.05);
  border-radius: $br-xl;
  backdrop-filter: blur(6px);
  
  &.show .notification {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: $spacing-sm;
    gap: $spacing-xxs; 

    .iconify {
      width: 2rem;
    }
    
    .instruction-set {
      display: flex;
      flex-direction: column;
      gap: $spacing-xxxs;
      
      h3 {
        font-size: $font-size-xs;
        font-weight: bold;
        margin: 0;
      }
      
      p {
        font-size: $font-size-xs;
        margin: 0;
      }
    }
  }

  &.hide .notification {
    display: none;
  }

  &.show .toggle-instruction-button {
    display: none;
  }

  &.hide .toggle-instruction-button {
    display: block;
    position: absolute;
    bottom: 2px;
    right: 2px;
    left: reset;
    z-index: 2;
    background: rgba($brand, 0.05);
    border-radius: $br-xl;
    color: $brand;
    padding: $spacing-sm;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
  }
}

</style>