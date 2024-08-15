<template>
  <aside class="project-overview">
    <!-- {{ client }} -->
    <!-- <img :src="props.client.logo_url" :alt="props.client.name" /> -->
    {{ project }}
    <!-- <div>
      <h3>{{ project.name }}</h3>
      <p>{{ project.description }}</p>
    </div> -->
  </aside>
</template>

<script setup>

const props = defineProps(['project', 'creator', 'client'])

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.project-overview {
  width: 100%;
  padding: $spacing-md;
  border-bottom: 1px solid rgba($black, 0.1);
  background-color: rgba($white-dark, 0.25);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-md;
}

</style>