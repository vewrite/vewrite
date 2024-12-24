<template>
  <section :class="['instructions', showInstructions ? 'show' : 'hide']">
    <div class="notification small">
      <button class="button primary" @click="toggleInstructions">
        <Icon name="fluent:question-24-filled" size="1.5rem" />
      </button>
      <div class="instruction-set">
        <p>{{ props.content }}</p>
      </div>
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
  position: absolute;
  left: $spacing-sm;
  bottom: 0;
  z-index: 1000;
  background: rgba($brand, 0.05);
  backdrop-filter: blur(6px);
  transition: background 0.5s ease;
  border-radius: $br-xl;

  .notification {
    button {
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      cursor: pointer;
      padding: 0;
    }
  }
  
  &.show {
  
    .notification {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      padding: 0;
      gap: $spacing-xs; 
      height: 100%;

      .iconify {
        width: 2rem;
      }
      
      .instruction-set {
        display: flex;
        flex-direction: row;
        gap: $spacing-xs;
        
        p {
          font-size: $font-size-xs;
          margin: 0;
        }
      }
    }
  }

  &.hide {
    background: rgba($brand, 0.0);
    transition: background 0.5s ease;
    
    .notification {
      padding: 0;
      
      .instruction-set {
        display: none;
      }
    }
  }
}

</style>