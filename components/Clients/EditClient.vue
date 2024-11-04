<template>
  <main class="client-edit">
    {{ client.client_id }}
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

@use 'assets/variables' as *;

.client-edit {
  width: 100%;
}

</style>