import { defineEventHandler, getQuery, send } from 'h3';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  
  // Initialize Supabase client
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const query = getQuery(event);
  const { id } = query;

  const { data, error } = await supabase
    .from('deliverable_content')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Oof, error fetching deliverable content',
    });
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Deliverable content not found',
    });
  }

  return send(event, data);

});