<!-- pages/payment/success.vue -->
<template>
  <div class="success-container">
    <div v-if="loading" class="loading">
      <p>Verifying your subscription...</p>
    </div>
    <div v-else-if="error" class="error">
      <h1>Something went wrong</h1>
      <p>{{ error }}</p>
      <button @click="verifySubscription" class="retry-button">Try Again</button>
    </div>
    <div v-else class="success">
      <h1>Subscription Successful!</h1>
      <p>Thank you for subscribing. Your payment has been processed successfully.</p>
      <p>Your subscription is now active and you can access all the features.</p>
      <NuxtLink to="/account" class="back-button">Go to Your Account</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// import { useSupabaseUser } from '#imports';

const route = useRoute();
const user = useSupabaseUser();

const loading = ref(true);
const error = ref(null);

onMounted(() => {
  verifySubscription();
});

async function verifySubscription() {
  loading.value = true;
  error.value = null;
  
  try {
    // Get the session ID from the URL
    const sessionId = route.query.session_id;
    const userId = route.query.user_id || user.value?.id;
    
    if (!sessionId || !userId) {
      throw new Error('Missing session ID or user ID');
    }
    
    // Verify the subscription with the server
    const response = await fetch('/api/stripe/verify-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      },
      body: JSON.stringify({
        sessionId,
        userId
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify subscription');
    }
    
    // Subscription verified successfully
  } catch (err) {
    console.error('Error verifying subscription:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Get auth token for API requests
async function getAuthToken() {
  const { data } = await useSupabaseClient().auth.getSession();
  return data.session?.access_token || '';
}
</script>

<style scoped>
.success-container {
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  padding: 2rem;
}

.loading, .error, .success {
  padding: 2rem;
}

.back-button, .retry-button {
  display: inline-block;
  background-color: #4f46e5;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  margin-top: 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover, .retry-button:hover {
  background-color: #4338ca;
}

.error {
  color: #ef4444;
}
</style>