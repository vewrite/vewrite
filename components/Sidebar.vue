<template>
  <div id="Sidebar">
    <div class="sidebar-header">
      <Logo />
      <HeaderButtons />
    </div>
    <div class="sidebar-content">
      <router-link to="/account" class="button block">test</router-link>
      <!-- <router-link to="/test" class="button block">test</router-link> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#Sidebar {
  height: 100%;
  min-width: 340px;

  .sidebar-header {
    background-color: $purple;
    color: white;
    padding: 0 $spacing-md;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-right: 1px solid rgba($purple-dark, 0.9);
    height: 75px;
  }

  .sidebar-content {
    padding: $spacing-md;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba($black, 0.1);
    height: calc(100% - 75px);
  }
}

</style>