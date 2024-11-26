<template>
  <section id="MobileNav">
    <div class="mobile-bar">
      <div class="button clear toggle-sidebar" @click="toggleMobile">
        <span class="menu-icon" :class="menu ? 'active' : ''"></span>
      </div>
    </div>
    <nav :class="menu ? 'active' : ''">
      <div class="sidebar-content">
        <div class="link-group">
          <router-link @click="toggleMobile" to="/projects" class="link"><Icon name="fluent:folder-16-regular" size="1.5rem" /> Projects</router-link>
          <router-link @click="toggleMobile" to="/workflows" class="link"><Icon name="fluent:flow-16-regular" size="1.5rem" /> Workflows</router-link>
          <router-link @click="toggleMobile" to="/teams" class="link"><Icon name="fluent:people-16-regular" size="1.5rem" /> Teams</router-link>
          <router-link @click="toggleMobile" to="/clients" class="link"><Icon name="fluent:star-16-regular" size="1.5rem" /> Clients</router-link>
        </div>
      </div>
    </nav>
    <div @click="toggleMobile" class="blur" :class="menu ? 'active' : ''"></div>
  </section>
</template>

<script setup>

import User from '~/components/Sidebar/User.vue'

const menu = ref(false)

function toggleMobile() {
  menu.value = !menu.value
}

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#MobileNav {
  display: none;

  @media (max-width: 960px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .mobile-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: $spacing-xs;
      padding: 0 $spacing-sm 0 0;
      height: 44px;
      width: 44px;
      position: fixed;
      bottom: $spacing-sm;
      left: $spacing-sm;
      z-index: 9999;
      background: $white;
      border: $border;
      border-radius: $br-md;
      justify-content: space-between;

      .toggle-sidebar {

        .menu-icon {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;

          &.active {
            &::before {
              top: 12px;
              transform: rotate(45deg);
            }

            &::after {
              bottom: 11px;
              transform: rotate(-45deg);
            }
          }

          &::before,
          &::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 1px;
            background: $black;
            transition: all 0.15s;
            left: 0;
            transform-origin: center center;
          }

          &::before {
            top: 4px;
          }

          &::after {
            bottom: 4px;
          }
        }

      }

    }

    nav {
      position: fixed;
      width: 100%;
      max-width: 300px;
      top: 0px;
      left: -100vw;
      bottom: 0;
      height: 100%;
      background: linear-gradient(to right, rgba($brand-dark, 1) 70%, rgba($brand-dark, 0.86) 100%);
      backdrop-filter: blur(10px);
      z-index: 9998;
      transition: all .3s ease;

      &.active {
        left: 0;
      }

      .sidebar-content {
        padding: $spacing-sm;
        display: flex;
        flex-direction: column;
        gap: 2px;
        height: calc(100% - 54px);
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
            color: rgba($white, 0.85);
            font-size: $font-size-sm;
            font-family: $font-family-main;
            font-weight: 400;
            text-decoration: none;

            &:hover,
            &.router-link-active,
            &.router-link-exact-active {
              background-color: rgba($brand, 1);
              color: $white;

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
            color: lighten($brand,20%);
            margin-bottom: $spacing-xs;
          }
        }
      }
    }
  }

  .blur {
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(25, 60, 115, 0.1);
    backdrop-filter: blur(10px);
    z-index: 9997;
    opacity: 0;
    pointer-events: none;
    transition: all .3s ease;

    &.active {
      opacity: 1;
      pointer-events: all;
    }
  }
  
}

</style>