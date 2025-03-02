import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey);
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey);
  
  const { sessionId, userId } = await readBody(event);

  console.log('Received request:', { sessionId, userId });
  
  // Get subscription info from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  if (!session?.subscription) {
    return createError({ statusCode: 400, message: 'No subscription found' });
  }
  
  // Get full subscription details
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription.toString()
  );

  let subscriptionExists = false;
  
  async function checkIfSubscriptionExists() {
    console.log('Checking if subscription exists for user:', userId);

    // from subscriptions, go check if the user_id is equal to the userId
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!data) {
      console.log('No subscription found for user:', userId);
      subscriptionExists = false;
    } else {
      console.log('Subscription found for user:', userId);
      subscriptionExists = true;
    }
    
  }

  async function updateSubscription() {
    try {
      await checkIfSubscriptionExists();
    } catch (error) {
      console.error('Error checking if subscription exists:', error);
      return createError({ statusCode: 500, message: 'Error checking if subscription exists' });
    }

    try {
      if(subscriptionExists === false) {
        console.log('No subscription, so creating subscription for user:', userId);
        // Save subscription details in database if there is not already a record for this user
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer.toString(),
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('user_id', userId);

        // Update user profile to pro
        console.log('Updating user profile to pro:', userId);
        await supabase
          .from('profiles')
          .update({ subscription: { status: 'pro' } })
          .eq('id', userId);
        
        return { success: true };
      } else {
        return createError({ statusCode: 400, message: 'Subscription already exists' });
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      return createError({ statusCode: 500, message: 'Error updating subscription' });
    }
  }

  await updateSubscription();
});