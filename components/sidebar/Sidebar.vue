<template>
  <div id="Sidebar" :class="collapsed ? 'collapsed' : ''">
    <div class="button clear toggle-sidebar" @click="toggleSidebar">
      <Icon name="fluent:chevron-left-16-regular" size="1rem" v-if="!collapsed" />
      <Icon name="fluent:chevron-right-16-regular" size="1rem" v-if="collapsed" />
    </div>
    <div class="sidebar-content">
      <div class="link-group">
        <router-link to="/projects" class="link"><Icon name="fluent:folder-16-regular" size="1.5rem" /> Projects</router-link>
        <router-link to="/workflows" class="link"><Icon name="fluent:flow-16-regular" size="1.5rem" /> Workflows</router-link>
        <router-link to="/teams" class="link"><Icon name="fluent:people-16-regular" size="1.5rem" /> Teams</router-link>
        <router-link to="/clients" class="link"><Icon name="fluent:star-16-regular" size="1.5rem" /> Clients</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>

const collapsed = ref(false)

function toggleSidebar() {
  collapsed.value = !collapsed.value
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#Sidebar {
  height: 100%;
  min-width: 240px;
  transition: all 0.2s ease;
  position: relative;
  background: $white;
  padding-right: $spacing-sm;
  background-color: rgba($brand, 0.02);

  &.collapsed {
    min-width: 88px;

    .sidebar-header { 
      display: none;
    }

    .sidebar-content {
      padding: $spacing-xs;
      opacity: 0;

      .link-group {

        .title {
          text-align: center;
        }

        .link {
          font-size: 0;
          gap: 0;
          align-items: center;
          justify-content: center;
          margin-bottom: $spacing-xxs;
        }
      }

      .link {
        font-size: 0;
        gap: 0;
        align-items: center;
        justify-content: center;
      }
    }

  }

  @media (max-width: 1024px) {
    min-width: 260px;
  }

  @media (max-width: 960px) {
    display: none;
  }

  .sidebar-header {
    color: $brand;
    padding: 0 $spacing-md;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 60px;

    svg {
      animation: fadeIn 0.8s ease forwards;
      opacity: 0;
    }

  }

  .toggle-sidebar {
    height: 100%;
    color: $black;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;
    padding: 0;
    z-index: 1000;
    border-left: $border;

    &:hover {
      color: $brand;
    }
  }

  .sidebar-content {
    padding: $spacing-sm;
    display: flex;
    flex-direction: column;
    gap: 2px;
    height: calc(100% - 60px);
    overflow-y: auto;
    animation: fadeIn 0.8s ease forwards;
    opacity: 0;
    overflow: hidden;

    .link-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: $spacing-md;

      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-xs;
        padding: $spacing-xxs $spacing-xs;
        border-radius: $br-md;
        transition: background-color 0.18s ease;
        color:$black;
        font-size: $font-size-xs;
        font-family: $font-family-main;
        font-weight: 400;
        text-decoration: none;

        &:hover,
        &.router-link-active,
        &.router-link-exact-active {
          background-color: rgba($brand, 0.1);
          color: $brand;

          .icon {
            transform: scale(1.15);
          }
        }
      }

      .title {
        font-size: $font-size-xxs;
        text-transform: uppercase;
        font-family: $font-family-main;
        font-weight: bold;
        color: rgba($black, 0.5);
        margin-bottom: $spacing-xs;
      }
    }
  }

  .user-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: $spacing-sm;
    position: absolute;
    bottom: 0;
    width: 100%;

    .tier-type {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: $spacing-xs;
      margin-bottom: $spacing-xs;
      justify-content: space-between;
      width: 100%;
      background-color: rgba($mint, 0.25);
      padding: $spacing-xs;
      border-radius: $br-lg;

      p {
        font-size: $font-size-sm;
        font-family: $font-family-main;
        font-weight: 400;
        color: $mint-dark;
        margin: 0 0 0 $spacing-sm;
      }

      button {
        width: auto;
        display: inline-block;
      }
    }

    .button.user {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      padding: $spacing-xs $spacing-sm;
    }

    p.user {
      margin:0 0 0 $spacing-sm;
      text-transform: capitalize;
    }

    .user-identity {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}

</style>