<template>
  <aside class="project-overview">
    <div class="project-summary">
      <h2>{{ project.name }}</h2>
      <!-- <p>Created by: {{ creator.username }}</p> -->
    </div>
    <div class="client-summary">
      <ClientImage :client="client" size="medium" table="logos" />
    </div>
    <!-- {{ client }} -->
    <!-- <img :src="client.logo_url" :alt="client.name" /> -->
    <!-- {{ project }} -->
    <!-- {{ deliverables }} -->
    <!-- <div>
      <h3>{{ project.name }}</h3>
      <p>{{ project.description }}</p>
    </div> -->
    <!-- {{ creator }} -->
  </aside>
</template>

<script setup>

// Supabase
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const loading = ref(true);

const props = defineProps(['project', 'creator', 'client', 'deliverables'])
const { client } = toRefs(props)

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.project-overview {
  width: calc(100% - 2 * $spacing-md);
  margin: $spacing-md;
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