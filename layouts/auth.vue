<template>
  <main id="Login">
    <slot />
  </main>
</template>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#Login {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

</style>