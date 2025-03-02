import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Initialize Stripe with proper error handling
  let stripe;
  try {
    stripe = new Stripe(config.stripeSecretKey, {
      apiVersion: '2025-01-27.acacia'
    });
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    return createError({
      statusCode: 500,
      message: 'Error initializing payment provider'
    });
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  
  try {
    // Get request body
    const body = await readBody(event);
    const { priceId, userId } = body;
    
    // Log inputs for debugging
    console.log('Received request:', { priceId, userId });
    
    if (!priceId) {
      return createError({
        statusCode: 400,
        message: 'Price ID is required'
      });
    }
    
    if (!userId) {
      return createError({
        statusCode: 400,
        message: 'User ID is required'
      });
    }
    
    // Authorization check
    const { req } = event.node;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized'
      });
    }
    
    // Get user email from Supabase
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);
      
    if (!user) {
      return createError({
        statusCode: 404,
        message: 'User not found'
      });
    }
    
    // Create or retrieve the Stripe customer
    const { data: userData } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();
    
    let customerId;
    
    if (userData && userData.stripe_customer_id) {
      customerId = userData.stripe_customer_id;
      console.log('Using existing customer:', customerId);
    } else {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUid: userId
        }
      });
      
      customerId = customer.id;
      console.log('Created new customer:', customerId);
      
      // Store the customer ID in Supabase
      await supabase.from('subscriptions').insert({
        user_id: userId,
        stripe_customer_id: customerId,
        status: 'incomplete',
        created_at: new Date().toISOString()
      });
    }
    
    // Create the checkout session
    console.log('Creating checkout session for customer:', customerId);
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId, // This should be a price ID, not a product ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${config.public.appUrl}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.appUrl}/subscriptions`,
      metadata: {
        userId: userId
      },
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto'
      },
      payment_method_types: ['card'],
    });
    
    console.log('Checkout session created:', session.id);
    
    // Return the URL to redirect the user to
    return {
      url: session.url
    };
    
  } catch (error) {
    console.error('Checkout session error:', error);
    return createError({
      statusCode: 500,
      message: 'Failed to create checkout session'
    });
  }
});