<template>
  yay
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