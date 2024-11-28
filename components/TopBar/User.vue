<template>
  <Dropdown class="top-bar-user">
    <template v-slot:trigger>
      <Avatar :uuid="user.id" />
      {{ loading ? 'Loading' : ProfileData.username }}
      <Icon name="fluent:chevron-down-16-regular" size="1.5rem" />
    </template>
    <template v-slot:menu>
      <section class="dropdown-header">
        {{ loading ? 'Loading' : ProfileData.username }}
        <section class="dropdown-plan">
          <span>Using the free plan</span>
          <button class="button green">Upgrade</button>
        </section>
      </section>
      <hr class="dropdown-divider" />
      <router-link to="/account" class="dropdown-item"><Icon name="solar:user-linear" size="1.5rem" /> Account</router-link>
      <div class="dropdown-item" @click="logout"><Icon name="fluent:arrow-exit-20-regular" size="1.5rem" /> Logout</div>
    </template>
  </Dropdown>
</template>

<script setup>

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
  display: flex;
  align-items: flex-start;
  
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
  }
}

</style>