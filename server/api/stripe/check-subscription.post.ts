import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2025-01-27.acacia'
  });
  
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  
  try {
    // Get request body
    const body = await readBody(event);
    const { userId } = body;
    
    // Authorization check
    const { req } = event.node;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized'
      });
    }
    
    // Get subscription info from Supabase
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();
    
    if (!subData || !subData.stripe_subscription_id) {
      return { active: false };
    }
    
    // Check current status directly from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      subData.stripe_subscription_id
    );
    
    // Update subscription in Supabase
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);
    
    return { 
      active: subscription.status === 'active' || subscription.status === 'trialing',
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return createError({
      statusCode: 500,
      message: 'Failed to check subscription status'
    });
  }
});