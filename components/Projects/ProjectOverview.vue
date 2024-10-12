<template>
  <aside class="project-overview">
    <div class="project-summary">
      <!-- <h2>{{ project.name }}</h2> -->
      <!-- <p>{{ project.description }}</p> -->
      <input class="project-title-input" v-model="project.name" @input="debouncedUpdateProjectName(project.id, $event.target.value)" />
      <input class="project-title-description" v-model="project.description" @input="debouncedUpdateProjectDescription(project.id, $event.target.value)" />
    </div>
    <div class="client-summary">
      <ClientImage :client="client" size="medium" table="logos" />
    </div>
  </aside>
</template>

<script setup>

const props = defineProps(['project', 'creator', 'client', 'deliverables'])
const { client, project } = toRefs(props)

// useProject composable
import useProject from '~/composables/useProject';
const { updateProjectName, updateProjectDescription } = useProject();

// Manual debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Debounced methods
const debouncedUpdateProjectName = debounce((id, value) => updateProjectName(id, value), 1000);
const debouncedUpdateProjectDescription = debounce((id, value) => updateProjectDescription(id, value), 1000);


</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.project-overview {
  width: calc(100%);
  padding: $spacing-md $spacing-md 0 $spacing-md;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-md;

  .project-summary {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    .project-title-input {
      font-family: $font-family-secondary;
      font-size: $font-size-lg;
      font-weight: 500;
      margin: 0 -0.85rem;
      background-color: transparent;
      width: 100%;
      padding: $spacing-xs;

      &:focus,
      &:active {
        border: 1px solid $brand;
        background: $white;
      }
    }

    .project-title-description {
      font-family: $font-family-main;
      font-size: $font-size-sm;
      color: $gray-dark;
      font-weight: 400;
      margin: -10px -0.85rem 0 -0.85rem;
      background-color: transparent;
      width: 100%;
      padding: $spacing-xs;

      &:focus,
      &:active {
        border: 1px solid $brand;
        background: $white;
        color: $black;
      }
    }
  }
}

</style>