<template>
  <section :class="['instructions', showInstructions ? 'show' : 'hide']">
    <div class="notification small">
      <Icon :name="props.icon" size="2rem" />
      <div class="instruction-set">
        <p>{{ props.content }}</p>
      </div>
      <button class="button small primary" @click="toggleInstructions">
        Hide
      </button>
    </div>
  </section>
</template>

<script setup>

const props = defineProps(['icon', 'title', 'content']);
const showInstructions = ref(true);

function toggleInstructions() {
  showInstructions.value = !showInstructions.value;
  localStorage.setItem('showInstructions', JSON.stringify(showInstructions.value));
}

onMounted(() => {
  const savedState = localStorage.getItem('showInstructions');
  if (savedState !== null) {
    showInstructions.value = JSON.parse(savedState);
  }
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.instructions {
  padding: $spacing-sm;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: rgba($brand, 0.1);
  
  &.show .notification {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 0;
    gap: $spacing-xxs; 
    height: 100%;

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

  &.hide {
    display: none;
  }

  &.show .toggle-instruction-button {
    display: none;
  }

  &.hide .toggle-instruction-button {
    display: flex;
    background: rgba($brand, 0.05);
    color: $brand;
    justify-content: center;
    align-items: center;
    align-self: flex-end;

    &:hover {
      transform: scale(1);
    }
  }
}

</style>