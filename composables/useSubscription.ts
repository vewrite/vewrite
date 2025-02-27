// composables/useSubscription.ts
import { ref, computed } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';

export default function useSubscription() {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  
  const subscription = ref(null);
  const loading = ref(true);
  const error = ref(null);
  
  // Computed properties for subscription status
  const isSubscribed = computed(() => {
    return subscription.value?.status === 'active' || 
           subscription.value?.status === 'trialing';
  });
  
  const subscriptionEndsAt = computed(() => {
    return subscription.value?.current_period_end || null;
  });
  
  const currentPlan = computed(() => {
    return subscription.value?.price_id || null;
  });
  
  // Fetch subscription from Supabase
  async function fetchSubscription() {
    if (!user.value) return null;
    
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: err } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.value.id)
        .single();
      
      if (err) throw err;
      
      subscription.value = data;
      return data;
    } catch (err) {
      console.error('Error fetching subscription from Supabase:', err);
      error.value = err;
      return null;
    } finally {
      loading.value = false;
    }
  }
  
  // Verify subscription status with Stripe
  async function verifySubscriptionStatus() {
    if (!user.value) return false;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('/api/stripe/check-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`
        },
        body: JSON.stringify({
          userId: user.value.id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check subscription');
      }
      
      const data = await response.json();

      console.log('Subscription status:', data);
      
      // Update local subscription state
      if (subscription.value) {
        subscription.value.status = data.status;
        subscription.value.current_period_end = data.currentPeriodEnd;
      }
      
      return data.active;
    } catch (err) {
      console.error('Error verifying subscription with Stripe:', err);
      error.value = err;
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  // Get auth token for API requests
  async function getAuthToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || '';
  }
  
  // Check if user has access to a specific feature
  function hasAccess(featureLevel = 'basic') {
    if (!isSubscribed.value) return false;
    
    // Implement your logic based on subscription plan
    if (featureLevel === 'basic') return true;
    
    if (featureLevel === 'pro') {
      return currentPlan.value === 'price_def456'; // Your Pro plan price ID
    }
    
    return false;
  }
  
  return {
    subscription,
    loading,
    error,
    isSubscribed,
    subscriptionEndsAt,
    currentPlan,
    fetchSubscription,
    verifySubscriptionStatus,
    hasAccess
  };
}