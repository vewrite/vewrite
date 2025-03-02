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
    
    // Find the Stripe customer ID
    const { data } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();
    
    if (!data || !data.stripe_customer_id) {
      return createError({
        statusCode: 404,
        message: 'No associated Stripe customer found'
      });
    }
    
    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${req.headers.origin}/account`
    });
    
    return { url: session.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    return createError({
      statusCode: 500,
      message: 'Failed to create customer portal session'
    });
  }
});