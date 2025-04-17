import { defineEventHandler, getQuery, createError, readBody } from 'h3';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export default defineEventHandler(async (event) => {
  // Get request parameters - prefer body for POST requests
  const body = await readBody(event).catch(() => ({}));
  const query = getQuery(event);
  
  const project_id = body.project_id || query.project_id;
  const deliverable_id = body.deliverable_id || query.deliverable_id;
  const user_id = body.user_id || query.user_id;
  
  if (!project_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing project_id parameter',
    });
  }

  if (!deliverable_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing deliverable_id parameter',
    });
  }

  if (!user_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing user_id parameter',
    });
  }
  
  // Create Supabase client with SERVICE ROLE key (not anon key) so that we can send emails to the right user with the right information
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: Missing service role key',
    });
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const resend = new Resend(process.env.resendApiKey);

  if (!resend) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: Missing Resend API key',
    });
  }
  
  try {
    // First, we have to get the email of the user_id to send the notification to
    const { data: userData, error: userError } = await supabase
      .from('users')  // Replace with your actual table name if different
      .select('email')
      .eq('id', user_id)
      .single();

    if (userError) {  
      throw createError({
        statusCode: 400,
        statusMessage: `User retrieval error: ${userError.message}`,
      });
    }

    const user = userData;

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User email not found',
      });
    }

    // Next, we have to get the state of the deliverable
    const { data: deliverableData, error: deliverableError } = await supabase
      .from('deliverables')  // Replace with your actual table name if different
      .select('workflow_state')
      .eq('id', deliverable_id)
      .single();

    if (deliverableError) {
      throw createError({
        statusCode: 400,
        statusMessage: `Deliverable retrieval error: ${deliverableError.message}`,
      });
    }

    const deliverable = deliverableData;

    if (!deliverable) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Deliverable state not found',
      });
    }

    // Then we have to go get the stateinstance of the deliverable
    const { data: stateInstanceData, error: stateInstanceError } = await supabase
      .from('stateinstances')  // Replace with your actual table name if different
      .select('id')
      .eq('id', deliverable.workflow_state)
      .single();

    if (stateInstanceError) {
      throw createError({
        statusCode: 400,
        statusMessage: `State instance retrieval error: ${stateInstanceError.message}`,
      });
    }

    const state_instance = stateInstanceData.id;
    
    // Next, we have to build the template of what we'll send to the user
    const template = {
      project_id: project_id,
      deliverable: deliverable,
      state_instance: state_instance,
      user: user,
    };

    const html = "<div>Hi,</div><div>We have a new deliverable for you to review.</div><div>Project ID: ${template.project_id}</div><div>Deliverable ID: ${template.deliverable_id}</div><div>Deliverable State: ${template.deliverable_state}</div><div>User Email: ${template.user_email}</div>";

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Vewrite <noreply@vewrite.com>',
      to: [user.email],
      subject: '${deliverable.title} is now in state ${state_instance.name}',
      html: html,
    });
  
    if (error) {
      return console.error({ error });
    }
  
    console.log({ data });
    
    return {
      success: true,
      message: `Invitation sent to ${email}`,
      data
    };
  } catch (error) {
    console.error('Server error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to notify user',
    });
  }
});