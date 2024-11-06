<template>
  <div id="Sidebar">
    <div class="sidebar-header">
      <Logo />
    </div>
    <div class="sidebar-content">
      <!-- {{ user.id }} -->
      <div class="link-group">
        <div class="title">Work</div>
        <router-link to="/projects" class="link"><Icon type="folder" /> Projects</router-link>
        <router-link to="/workflows" class="link"><Icon type="workflow" /> Workflows</router-link>
      </div>
      <div class="link-group">
        <div class="title">People</div>
        <router-link to="/teams" class="link"><Icon type="approve" /> Teams</router-link>
        <!-- <router-link to="/members" class="link"><Icon type="star" /> Members</router-link> -->
      </div>
      <div class="link-group">
        <div class="title">Business</div>
        <router-link to="/clients" class="link"><Icon type="client" /> Clients</router-link>
        <!-- <router-link to="/payments" class="link"><Icon type="wallet" /> Payments</router-link> -->
        <!-- <router-link to="/invoices" class="link"><Icon type="doc" /> Invoices</router-link> -->
        <!-- <router-link to="/analytics" class="link"><Icon type="chart" /> Analytics</router-link> -->
      </div>
    </div>
    <div class="user-section">
      <!-- <aside class="tier-type">
        <div class="tier">
          <p>You are on the Free tier</p>
        </div>
        <router-link to="" class="button green">Upgrade</router-link>
      </aside> -->
      <router-link to="/account" class="button user" v-if="userStore">
        <div class="user-identity">
          <Avatar :uuid="userStore.uuid" />
          <p class="user">{{ userStore.username }}</p>
        </div>
        <Icon type="rightArrow" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// User store
import { useUser } from '@/stores/user'
const userStore = useUser()

// Setup the User for the app
const fetchUser = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)

  if (error) {
    console.error('Error fetching user:', error.message)
    return
  }

  userStore.setUser(data[0])
}

onMounted(() => {
  fetchUser()
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#Sidebar {
  height: 100%;
  min-width: 340px;
  transition: min-width 0.3s ease;
  position: relative;
  background: $white;
  box-shadow: inset -1px 0px 1px rgba($brand, 0.025), inset -4px 0px 4px rgba($brand, 0.025), inset -10px 0px 20px rgba(0, 0, 0, 0.01);

  @media (max-width: 1024px) {
    min-width: 260px;
  }

  @media (max-width: 768px) {
    display: none;
  }

  .sidebar-header {
    color: $white;
    padding: 0 0 0 $spacing-sm;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 54px;
  }

  .sidebar-content {
    padding: $spacing-sm;
    display: flex;
    flex-direction: column;
    gap: 2px;
    height: calc(100% - 54px);
    overflow-y: auto;

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
        color: $black;
        font-size: $font-size-sm;
        font-family: $font-family-main;
        font-weight: 400;
        text-decoration: none;
        transition: all 0.2s ease;

        .icon {
          transition: transform 0.18s ease;
        }

        &:hover,
        &.router-link-active,
        &.router-link-exact-active {
          background-color: rgba($brand, 0.05);
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
        color: rgba($black,0.5);
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
      padding: $spacing-xxs;
      box-shadow: $soft-shadow;
      background-color: $white;

      &:hover {
        border-color: $brand;

        p.user {
          color: $brand;
        }
      }
    }

    p.user {
      font-size: $font-size-sm;
      font-family: $font-family-main;
      font-weight: 400;
      margin:0 0 0 $spacing-sm;
      text-transform: capitalize;
      transition: color 0.22s ease-in-out;
    }

    .user-identity {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &:hover {
      
      p.user {
        color: $black;
      }
    }
  }
}

</style>