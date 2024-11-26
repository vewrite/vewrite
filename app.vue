<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>   
</template>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#vewrite {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  .app, main {
    width: 100%;
    height: 100%;
    display: flex;
    perspective: 1000px;

    .zoom {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
    }
  }
}

.zoom {
  transition: all 0.42s ease-in-out;
}

.no-scroll {
  overflow: hidden;

  .zoom {
    transform: scale(0.88);
  }
}

#DevDrawer {
  position: fixed;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(10px);
  color: white;
  z-index: 1000;
  border-radius: $br-lg 0 0 0;
}

</style>