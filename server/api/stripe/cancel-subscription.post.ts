import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {

  interface Subscription {
    stripe_subscription_id: string;
  }

  interface SupabaseResponse {
    data: Subscription[];
    error: any;
  }

  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey);
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey);
  
  const { userId } = await readBody(event);

  // For cancellations, I need to go get the subscription ID from the database for this user from the subscriptions table
  // Then I can cancel the subscription in Stripe using the subscription ID
  // Then I can update the subscription record in the database to reflect the new status
  console.log('Cancelling subscription for user:', userId);

  let subscriptionId = '';

  async function getSubscription() {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId);
    if (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
    subscriptionId = data[0].stripe_subscription_id;
    console.log("The user's subscription ID:", subscriptionId);
  }

  async function cancelSubscription(subscription: string): Promise<void> {
    console.log('Cancelling subscription:', subscription, 'with Stripe', stripe);
    await stripe.subscriptions.cancel(subscription);
  }

  await getSubscription();
  await cancelSubscription(subscriptionId);

});