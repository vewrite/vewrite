<template>
  <div id="Sidebar">
    <div class="sidebar-header">
      <Logo />
    </div>
    <div class="sidebar-content">
      <div class="link-group">
        <div class="title">Work</div>
        <router-link to="/" class="link"><Icon type="folder" /> Projects</router-link>
        <router-link to="/workflows" class="link"><Icon type="workflow" /> Workflows</router-link>
      </div>
      <div class="link-group">
        <div class="title">People</div>
        <router-link to="/talent" class="link"><Icon type="star" /> Talent</router-link>
        <router-link to="/stakeholders" class="link"><Icon type="approve" /> Stakeholders</router-link>
      </div>
      <div class="link-group">
        <div class="title">Business</div>
        <router-link to="/clients" class="link"><Icon type="client" /> Clients</router-link>
        <router-link to="/payments" class="link"><Icon type="wallet" /> Payments</router-link>
        <router-link to="/invoices" class="link"><Icon type="doc" /> Invoices</router-link>
        <router-link to="/analytics" class="link"><Icon type="chart" /> Analytics</router-link>
      </div>
    </div>
    <div class="user-section">
      <router-link to="/account" class="button">
        <div class="user-identity">
          <Avatar :uuid="uuid" to="/account" />
          <p>{{ user.username }}</p>
        </div>
        <Icon type="rightArrow" />
      </router-link>
    </div>
  </div>
</template>

<script setup>

const user = useSupabaseUser();
const uuid = ref(user.value?.id);

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#Sidebar {
  height: 100%;
  min-width: 340px;
  transition: min-width 0.3s ease;
  position: relative;

  @media (max-width: 1024px) {
    min-width: 260px;
  }

  @media (max-width: 768px) {
    display: none;
  }

  .sidebar-header {
    background-color: $purple;
    background: linear-gradient(130.9deg, #540095 -13.18%, $purple 47.75%);
    color: white;
    padding: 0 $spacing-md;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-right: 1px solid rgba($purple-light, 1);
    height: 75px;
  }

  .sidebar-content {
    padding: $spacing-lg $spacing-md;
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-right: 1px solid rgba($black, 0.1);
    height: calc(100% - 75px - 116px);
    overflow-y: auto;

    .link-group {
      display: flex;
      flex-direction: column;
      gap: $spacing-xxs;
      margin-bottom: $spacing-md;

      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-xs;
        padding: $spacing-xs;
        border-radius: $br-md;
        transition: background-color 0.18s ease;
        color: $black;
        font-size: $font-size-md;
        font-family: $font-family-secondary;
        font-weight: 400;
        text-decoration: none;

        &:hover,
        &.router-link-active,
        &.router-link-exact-active {
          background-color: rgba($purple, 0.05);
          color: $purple;
        }
      }

      .title {
        font-size: $font-size-xs;
        font-family: $font-family-main;
        font-weight: 600;
        text-transform: uppercase;
        color: $gray-dark;
        margin-bottom: $spacing-xs;
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
    height: 116px;

    .button {
      width: 100%;
    }

    p {
      font-size: $font-size-md;
      font-family: $font-family-secondary;
      font-weight: 400;
      color: $black;
      margin:0 0 0 $spacing-sm;
    }

    .user-identity {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}

</style>