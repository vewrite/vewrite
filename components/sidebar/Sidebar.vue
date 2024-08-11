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
      <router-link to="/account" class="button" v-if="userStore">
        <div class="user-identity">
          <Avatar :uuid="userStore.uuid" />
          <p>{{ userStore.username }}</p>
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
    color: $black;
    padding: 0 0 0 $spacing-md;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 135px;
  }

  .sidebar-content {
    padding: 0 0 $spacing-lg $spacing-md;
    display: flex;
    flex-direction: column;
    gap: 2px;
    height: calc(100% - 135px - 116px);
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
        font-size: $font-size-sm;
        font-family: $font-family-main;
        font-weight: 500;
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