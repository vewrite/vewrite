export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isSubscribed, fetchSubscription, verifySubscriptionStatus, loading } = useSubscription();
  const user = useSupabaseUser();
  
  // If user is not logged in, redirect to login
  if (!user.value) {
    return navigateTo('/login');
  }
  
  // First try to get subscription from Supabase
  await fetchSubscription();
  
  // If not found or expired, verify with Stripe directly
  if (!isSubscribed.value) {
    await verifySubscriptionStatus();
  }
  
  // Wait for subscription check to complete
  if (loading.value) {
    return;
  }
  
  // If still not subscribed, redirect to pricing page
  if (!isSubscribed.value) {
    return navigateTo('/pricing');
  }
});