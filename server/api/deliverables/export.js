import { defineEventHandler, getQuery, send, createError } from 'h3';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { id, type } = query;

  console.log('id:', id);
  console.log('type:', type);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id parameter',
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('deliverables')
    .select('*')
    .eq('id', id)
    .single();

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

  // Ensure fileContent is a string
  let fileContent = typeof data.content.draft === 'string' ? data.content.draft : JSON.stringify(data.content.draft);

  // Remove double quotes from the beginning and end of the content string
  fileContent = fileContent.replace(/^"|"$/g, '');

  let fileName = '';

  // // Simple condition to test if the block runs
  // if (type === 'html') {
  //   console.log('HTML export');
  //   fileName = `vewrite-export-html-${id}.html`;
  // } else {
  //   console.log('Default export');
  //   fileName = `vewrite-export-${id}.md`;
  // }

  // Set the response headers
  event.res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  event.res.setHeader('Content-Type', 'text/plain');

  // Send the file content
  return send(event, fileContent);
});