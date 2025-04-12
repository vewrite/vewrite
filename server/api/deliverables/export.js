import { defineEventHandler, getQuery, send, createError } from 'h3';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  // Get query parameters
  const query = getQuery(event);
  const { id, type } = query;
  
  console.log('id:', id);
  console.log('type:', type);
  
  // Validate required parameters
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id parameter',
    });
  }
  
  // Initialize Supabase client
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials:', { supabaseUrl, supabaseKey });
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error',
    });
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Query the database
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', id)
      .single();
    
    console.log('Supabase query result:', { data, error });
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching deliverable content',
        data: error.message,
      });
    }
    
    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Deliverable content not found',
      });
    }
    
    // Process content
    let fileContent;
    if (!data.content || !data.content.draft) {
      fileContent = '';
      console.warn('Empty content in deliverable:', id);
    } else {
      fileContent = typeof data.content.draft === 'string' 
        ? data.content.draft 
        : JSON.stringify(data.content.draft);
      
      // Remove double quotes if needed
      fileContent = fileContent.replace(/^"|"$/g, '');
    }
    
    // Generate filename
    const fileName = `deliverable-${id}-${type || 'default'}.txt`;
    
    // Set headers and send response
    event.res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    event.res.setHeader('Content-Type', 'text/plain');
    
    return send(event, fileContent);
  } catch (err) {
    console.error('Unexpected error:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error processing request',
      data: err.message,
    });
  }
});