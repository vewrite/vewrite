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
      .from('profiles')  // Replace with your actual table name if different
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError) {  
      throw createError({
        statusCode: 400,
        statusMessage: `User retrieval error: ${userError.message}`,
      });
    }

    console.log('User data:', userData);

    const user = userData;

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User not found',
      });
    }

    // Next, we have to get the state of the deliverable
    const { data: deliverableData, error: deliverableError } = await supabase
      .from('deliverables')  // Replace with your actual table name if different
      .select('*')
      .eq('id', deliverable_id)
      .single();

    if (deliverableError) {
      throw createError({
        statusCode: 400,
        statusMessage: `Deliverable retrieval error: ${deliverableError.message}`,
      });
    }

    console.log('Deliverable data:', deliverableData);

    const deliverable = deliverableData;

    if (!deliverable) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Deliverable state not found',
      });
    }

    // We will also want to get the project details
    const { data: projectData, error: projectError } = await supabase
    .from('projects')  
    .select('*')
    .eq('id', project_id)
    .single();

    if (projectError) {
    throw createError({
      statusCode: 400,
      statusMessage: `Project retrieval error: ${projectError.message}`,
    });
    }

    const project = projectData;

    // Then we have to go get the stateinstance of the deliverable
    const { data: stateInstanceData, error: stateInstanceError } = await supabase
      .from('stateinstances')  // Replace with your actual table name if different
      .select('*')
      .eq('id', deliverable.workflow_state)
      .single();

    if (stateInstanceError) {
      throw createError({
        statusCode: 400,
        statusMessage: `State instance retrieval error: ${stateInstanceError.message}`,
      });
    }

    console.log('State instance data:', stateInstanceData);

    const state_instance = stateInstanceData;
    
    // Next, we have to build the template of what we'll send to the user
    const template = {
      project: project,
      deliverable: deliverable,
      state_instance: state_instance,
      user: user,
    };

    const html = `<div style="max-width: 600px; margin: 0 auto; width: 100%;">
                    <img src="https://dev.vewrite.com/images/logo-email.png" alt="Vewrite Logo" style="width: 120px; height: auto;">
                  </div>
                  <hr style="max-width: 600px; border: none; border-top: 1px solid #eaeaea; margin: 40px auto;">
                  <div style="max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; font-family: Arial, sans-serif;">
                    <h3 style="margin: 0;">Here's an update on your project, ${template.project.name}</h3>
                    <div>Your deliverable, <a href="${process.env.APP_ENVIRONMENT}/deliverable/${template.deliverable.id}">${template.deliverable.title}</a>, has moved from state <strong>${template.state_instance.instance_name}</strong>.</div>
                    <a href="${process.env.APP_ENVIRONMENT}/deliverable/${template.deliverable.id}" style="background: #1864DA; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 20px;">View Deliverable</a>
                  </div>
                  `;


    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Vewrite <noreply@vewrite.com>',
      to: [user.email],
      // subject: `${template.deliverable.title} is now in state ${template.state_instance.name}`,
      subject: `A deliverable in ${template.project.name} has changed state`,
      html: html,
    });
  
    if (error) {
      return console.error({ error });
    }
  
    console.log({ data });
    
    return {
      success: true,
      message: `Invitation sent to ${user.email}`,
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