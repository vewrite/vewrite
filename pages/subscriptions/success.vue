<template>
  <main class="verify-subscription">
    <Loading v-if="loading" />
    <div class="verified" v-else>
      <svg width="61" height="58" viewBox="0 0 61 58" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M54.1735 3.94478C57.6037 5.92519 58.779 10.3114 56.7985 13.7415L35.2834 51.0069C33.303 54.4371 28.9168 55.6123 25.4866 53.6319V53.6319C22.0564 51.6515 20.8812 47.2654 22.8616 43.8352L44.3767 6.56981C46.3572 3.13963 50.7433 1.96436 54.1735 3.94478V3.94478Z" fill="url(#paint0_linear_1_4)"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7682 6.56997C11.7878 3.13979 7.40164 1.96452 3.97146 3.94494C0.541276 5.92535 -0.633991 10.3115 1.34643 13.7417L22.8616 51.0071C24.842 54.4372 29.2282 55.6125 32.6583 53.6321C34.0713 52.8163 35.1017 51.5923 35.6864 50.1951L42.9562 37.6382C42 38.5945 39.5138 40.7938 37.2188 41.9413C35.8353 42.633 34.3823 41.6219 33.2369 40.2907L13.7682 6.56997Z" fill="url(#paint1_linear_1_4)"/>
        <defs>
        <linearGradient id="paint0_linear_1_4" x1="58.734" y1="15.4057" x2="17.138" y2="38.3553" gradientUnits="userSpaceOnUse">
        <stop offset="0.0897277" stop-color="#C3D5AD"/>
        <stop offset="0.776664" stop-color="#BFCDFF"/>
        </linearGradient>
        <linearGradient id="paint1_linear_1_4" x1="5.66326" y1="24.012" x2="24.3097" y2="54.8504" gradientUnits="userSpaceOnUse">
        <stop stop-color="#9AB1FD"/>
        <stop offset="1" stop-color="#6C8DFB"/>
        </linearGradient>
        </defs>
      </svg>
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