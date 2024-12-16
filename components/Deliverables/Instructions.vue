<template>
  <section class="instructions">
    <div class="notification small">
      <Icon :name="props.icon" size="2rem" />
      <div class="instruction-set">
        <h3>{{ props.title }}</h3>
        <p>{{ props.content }}</p>
      </div>
      <button class="button small">
        <Icon name="fluent-mdl2:chrome-close" size="1rem" />
      </button>
    </div>
  </section>
</template>

<script setup>

const props = defineProps(['icon', 'title', 'content']);

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.instructions {
  margin: 0 $spacing-sm;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  max-width: 400px;
  background: rgba($white, 0.85);
  backdrop-filter: blur(6px);
  border: $border;
  border-radius: $br-md;
  
  .notification {
    display: grid;
    grid-template-columns: 2rem 1fr auto;
    align-items: start;
    gap: $spacing-sm;

    .iconify {
      width: 2rem;
    }
    
    .instruction-set {
      display: flex;
      flex-direction: column;
      gap: $spacing-xxxs;
      
      h3 {
        font-size: $font-size-sm;
        font-weight: bold;
        margin: 0;
      }
      
      p {
        font-size: $font-size-xs;
        margin: 0;
      }
    }
  }
}

</style>