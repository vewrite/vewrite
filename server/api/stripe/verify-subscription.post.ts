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
  
  // Save subscription details in database
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
    });

  await supabase
    .from('profiles')
    .update({ subscription: { status: 'pro' } })
    .eq('id', userId);
  
  return { success: true };
});