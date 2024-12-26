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
  padding: $spacing-xxs;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: absolute;
  left: $spacing-xxs;
  bottom: 60px;
  z-index: 1;
  background: linear-gradient(110deg, rgba($brand, 0.1) 0%, rgba($brand, 0) 80%, rgba($mint, 0.2) 100%);
  border: 1px solid rgba($white, 0.8);
  backdrop-filter: blur(6px);
  transition: background 0.5s ease;
  border-radius: $br-xl;
  box-shadow: inset 0 -10px 21px rgba($brand, 0.1);

  .notification {
    color: $brand;

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
   
      button {
        transform: scale(1.15);
        opacity: 0.35;
      }
      
      .instruction-set {
        display: none;
      }
    }
  }
}

</style>