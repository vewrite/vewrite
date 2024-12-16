<template>
  <section class="instructions">
    <div class="notification small">
      <Icon :name="props.icon" size="2rem" />
      <div class="instruction-set">
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
  left: 0;
  z-index: 2;
  background: rgba($white, 0.85);
  backdrop-filter: blur(6px);
  border-top: $border;
  
  .notification {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: $spacing-sm 0 0;
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
}

</style>