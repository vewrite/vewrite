// server/api/invite-user.ts
import { defineEventHandler, getQuery, createError, readBody } from 'h3';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  // Get request parameters - prefer body for POST requests
  const body = await readBody(event).catch(() => ({}));
  const query = getQuery(event);
  
  const email = body.email || query.email;
  const project_id = body.project_id || query.project_id;
  
  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing email parameter',
    });
  }
  
  if (!project_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing project_id parameter',
    });
  }
  
  // Create Supabase client with SERVICE ROLE key (not anon key)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: Missing service role key',
    });
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Create the invited profile in database
  const invited_profile = {
    email: email,
    team_id: team_id,
  };
  
  try {
    // Invite the user via email
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);
    
    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invitation error: ${error.message}`,
      });
    }
    
    const { error: profileError } = await supabase
      .from('invited_profiles')  // Replace with your actual table name if different
      .insert([invited_profile]);
    
    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw createError({
        statusCode: 400,
        statusMessage: `Profile creation error: ${profileError.message}`,
      });
    }
    
    return {
      success: true,
      message: `Invitation sent to ${email}`,
      data
    };
  } catch (error) {
    console.error('Server error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to invite user',
    });
  }
});