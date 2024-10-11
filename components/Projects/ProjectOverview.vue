<template>
  <aside class="project-overview">
    <div class="project-summary">
      <h2>{{ project.name }}</h2>
      <p>{{ project.description }}</p>
    </div>
    <div class="client-summary">
      <ClientImage :client="client" size="medium" table="logos" />
    </div>
  </aside>
</template>

<script setup>

// Supabase
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const loading = ref(true);

const props = defineProps(['project', 'creator', 'client', 'deliverables'])
const { client } = toRefs(props)

// TODO - project.name and project.description should be editable

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

    h2 {
      font-family: $font-family-secondary;
      font-weight: 500;
      margin: 0;
    }

    p {
      font-size: $font-size-sm;
      font-weight: 400;
      margin: 0;
    }
  }
}

</style>