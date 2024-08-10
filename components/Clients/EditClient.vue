<template>
  <main class="client-edit">
    {{ client.id }}
  </main>
</template>

<script setup>

defineProps({
  client: {
    type: Object,
    required: true
  }
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.client-edit {
  width: 100%;
}

</style>