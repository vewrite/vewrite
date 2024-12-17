<template>
  <div id="Sidebar" :class="collapsed ? 'collapsed' : ''">
    <div class="sidebar-content">
      <div class="link-group">
        <router-link to="/projects" :class="['link', isProjects ? 'router-link-active' : '']"><Icon name="fluent:folder-16-regular" size="1.75rem" /> Projects</router-link>
        <router-link to="/workflows" :class="['link', isWorkflows ? 'router-link-active' : '']"><Icon name="fluent:flow-16-regular" size="1.75rem" /> Workflows</router-link>
        <router-link to="/teams" :class="['link', isTeams ? 'router-link-active' : '']"><Icon name="fluent:people-16-regular" size="1.75rem" /> Teams</router-link>
        <router-link to="/clients" :class="['link', isClients ? 'router-link-active' : '']"><Icon name="fluent:star-16-regular" size="1.75rem" /> Clients</router-link>
      </div>
    </div>
    <div class="button clear toggle-sidebar" @click="toggleSidebar">
      <Icon name="fluent:chevron-left-16-regular" size="1.5rem" v-if="!collapsed" />
      <Icon name="fluent:chevron-right-16-regular" size="1.5rem" v-if="collapsed" />
    </div>
  </div>
</template>

<script setup>

import { useRoute } from 'vue-router';

const route = useRoute();

const collapsed = ref(false)

function toggleSidebar() {
  collapsed.value = !collapsed.value
  localStorage.setItem('collapsed', JSON.stringify(collapsed.value));
}

const isProjects = computed(() => {
  if(route.path.startsWith('/project/') || route.path.startsWith('/deliverable/')) {
    return true;
  }
});

const isWorkflows = computed(() => {
  return route.path.startsWith('/workflow/');
});

const isTeams = computed(() => {
  return route.path.startsWith('/team/');
});

const isClients = computed(() => {
  return route.path.startsWith('/client/');
});

onMounted(() => {
  const savedState = localStorage.getItem('collapsed');
  if (savedState !== null) {
    collapsed.value = JSON.parse(savedState);
  }
});

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
  background: rgba($black, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 $spacing-sm $spacing-sm;

  &.collapsed {
    min-width: 60px;

    .sidebar-header { 
      display: none;
    }

    .sidebar-content {
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
    min-width: 160px;
  }

  @media (max-width: 960px) {
    display: none;
  }

  .toggle-sidebar {
    color: $black;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;
    padding: 0;
    z-index: 1000;
    padding: $spacing-xxs;
    border-radius: $br-lg;
    background: rgba($black, 0.05);

    &:hover {
      color: $brand;
    }
  }

  .sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
    animation: fadeIn 0.8s ease forwards;
    opacity: 0;
    overflow: hidden;

    .link-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: $spacing-md;
      padding-top: 2px;

      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-xs;
        padding: $spacing-xs $spacing-sm;
        border-radius: $br-lg;
        transition: background-color 0.18s ease;
        color: rgba($black, 0.5);
        font-size: $font-size-xs;
        font-family: $font-family-main;
        font-weight: bold;
        text-decoration: none;
        border: 1px solid rgba($brand, 0.0);

        &:hover,
        &.router-link-active,
        &.router-link-exact-active {
          background-color: rgba($black, 0.05);
          border: 1px solid rgba($black, 0.0);
          color: $black;

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
        font-size: $font-size-xs;
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