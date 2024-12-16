<template>
  <section class="project-overview">
    <ClientImage :client="client" size="small" table="logos" />
    <aside class="object-overview no-border">
      <div class="object-summary">
        <input class="object-title-input" v-model="project.name" @input="debouncedUpdateProjectName(project.id, $event.target.value)" />
        <input class="object-description-input" v-model="project.description" @input="debouncedUpdateProjectDescription(project.id, $event.target.value)" placeholder="Add a project description" />
      </div>
    </aside>
    <TeamMembers :team="team" />
  </section>
</template>

<script setup>

const props = defineProps(['project', 'creator', 'client', 'deliverables', 'team'])
const { client, project, team } = toRefs(props)

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

@use 'assets/variables' as *;

.project-overview {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: $spacing-sm;
}

</style>