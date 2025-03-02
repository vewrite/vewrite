<template>
  <main class="verify-subscription">
    <Loading v-if="loading" />
    <div class="verified" v-else>
      <h1>Subscription Verified</h1>
      <p>Your subscription has been verified. You can now access all pro features.</p>
      <nuxt-link to="/subscriptions" class="button large primary">Manage Subscription</nuxt-link>
    </div>
  </main>
</template>

<script setup>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

import { useRoute } from 'vue-router';

const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const loading = ref(true);

onMounted(() => {
  verifySubscription();
});

async function verifySubscription() {
  try {
    // Get session ID and user ID from URL
    const sessionId = route.query.session_id;
    const userId = route.query.user_id || user.value?.id;
    
    // Call API to verify subscription
    const response = await fetch('/api/stripe/verify-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      },
      body: JSON.stringify({ sessionId, userId })
    });
    
    await response.json();
    // Subscription verified and saved in database
  } catch (error) {
    console.error('Error verifying subscription:', error);
  } finally {
    loading.value = false;
  }
}

async function getAuthToken() {
  const { data } = await useSupabaseClient().auth.getSession();
  return data.session?.access_token || '';
}
</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.verify-subscription {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  text-align: center;
  width: 100%;

  h1 {
    font-size: $font-size-xl;
    margin:0;
  }

  p {
    font-size: $font-size-md;
    margin:0;
    opacity: 0.5;
  }

  .verified {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
  }
}

</style>