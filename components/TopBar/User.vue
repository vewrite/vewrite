<template>
  <Dropdown class="top-bar-user">
    <template v-slot:trigger>
      <Avatar :uuid="user.id" />
      {{ loading ? 'Loading' : ProfileData.username }}
      <Icon name="fluent:chevron-down-16-regular" size="1.5rem" />
    </template>
    <template v-slot:menu>
      <section class="dropdown-header">
        <span class="user-name">{{ loading ? 'Loading' : ProfileData.username }}</span>
        <PlanStatus />
      </section>
      <hr class="dropdown-divider" />
      <router-link to="/account" class="dropdown-item"><Icon name="solar:user-linear" size="1.5rem" /> Account</router-link>
      <router-link v-if="personaState == 'manager'" to="/subscriptions" class="dropdown-item"><Icon name="solar:lock-linear" size="1.5rem" /> Subscriptions</router-link>
      <div class="dropdown-item" @click="logout"><Icon name="fluent:arrow-exit-20-regular" size="1.5rem" /> Logout</div>
    </template>
  </Dropdown>
</template>

<script setup>

import PlanStatus from '~/components/TopBar/PlanStatus.vue' 

// Pull personaState from the middleware auth.js
const personaState = useState('personaState');

const user = useSupabaseUser()
const loading = ref(true)

import useProfile from '~/composables/useProfile'
const { fetchSingleProfile, ProfileData } = useProfile()

onMounted(async () => {
  if (user.value) {
    await fetchSingleProfile(user.value.id);
    loading.value = false;
  }
})

const supabase = useSupabaseClient()

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  navigateTo('/login')
}

</script>

<style lang="scss">

@use 'assets/variables' as *;

.top-bar-user {
  align-items: flex-start;

  .user-name {
    font-weight: bold;
    margin-bottom: $spacing-xxs;
  }
  
  .button:not(.green) {
    background: transparent;
  }

  .dropdown-header {
    padding: $spacing-xs;
    display: flex;
    flex-direction: column;
    gap: $spacing-xxs;

    .dropdown-plan {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      color: rgba($black, 0.5);
      font-size: $font-size-xs;
    }
  }

  hr {
    width: calc(100% + 2 * $spacing-xs);
    margin-left: -$spacing-xs;
    height: 1px;
    border: none;
    background-color: $gray-light;
    box-shadow: 1px 0 1px rgba(white, 0.5);
  }
}

</style>