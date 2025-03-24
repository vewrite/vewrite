<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>   
</template>

<script setup>

const { initialize } = useHotjar()

onMounted(() => {
  initialize()
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

</style>