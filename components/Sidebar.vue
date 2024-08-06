<template>
  <div id="Sidebar">
    <div class="sidebar-header">
      <Logo />
      <!-- <HeaderButtons /> -->
    </div>
    <div class="sidebar-content">
      <div class="link-group">
        <div class="title">Work</div>
        <router-link to="/" class="link">Projects</router-link>
        <router-link to="/workflows" class="link">Workflows</router-link>
      </div>
      <div class="link-group">
        <div class="title">People</div>
        <router-link to="/talent" class="link">Talent</router-link>
        <router-link to="/stakeholders" class="link">Stakeholders</router-link>
      </div>
      <div class="link-group">
        <div class="title">Business</div>
        <router-link to="/clients" class="link">Clients</router-link>
        <router-link to="/payments" class="link">Payments</router-link>
        <router-link to="/invoices" class="link">Invoices</router-link>
        <router-link to="/analytics" class="link">Analytics</router-link>
      </div>
    </div>
    <div class="user-section">
      <router-link class="button" to="/account">Account</router-link>  
    </div>
  </div>
</template>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#Sidebar {
  height: 100%;
  min-width: 340px;
  transition: min-width 0.3s ease;
  position: relative;
  background-color: $white-light;

  @media (max-width: 1024px) {
    min-width: 260px;
  }

  @media (max-width: 768px) {
    display: none;
  }

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
    padding: $spacing-lg $spacing-md;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    border-right: 1px solid rgba($black, 0.1);
    height: calc(100% - 75px - 90px);
    overflow-y: auto;

    .link-group {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      margin-bottom: $spacing-lg;

      .title {
        font-size: $font-size-sm;
        font-family: $font-family-main;
        font-weight: 500;
        text-transform: uppercase;
        color: $gray-dark;
      }
    }

    .link {
      color: $black;
      font-size: $font-size-lg;
      font-family: $font-family-secondary;
      font-weight: 400;
      text-decoration: none;

      &:hover,
      &.router-link-active,
      &.router-link-exact-active {
        color: $purple;
      }
    }
  }

  .user-section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: $spacing-md;
    border-right: 1px solid rgba($black, 0.1);
    backdrop-filter: blur(10px);
    position: absolute;
    bottom: 0;
    width: 100%;

    .button {
      width: 100%;
    }
  }
}

</style>