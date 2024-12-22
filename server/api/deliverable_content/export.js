import { defineEventHandler, getQuery, send } from 'h3';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { id } = query;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id parameter',
    });
  }

  const { data, error } = await supabase
    .from('deliverable_content')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'God dammit, error fetching deliverable content',
    });
  }

  // const { data, error } = await $fetch('/api/deliverable_content/fetchSingle?id=' + id);
  // const { data, error } = await $fetch('/api/deliverable_content/fetchSingle', {
  //   method: 'POST',
  //   body: JSON.stringify({ id }),
  // });

  // console.log(data);
  // console.log(error);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'God dammit, error fetching deliverable content',
    });
  }

  // Ensure fileContent is a string
  let fileContent = typeof data.content.content === 'string' ? data.content.content : JSON.stringify(data.content.content);

  // Remove double quotes from the beginning and end of the content string
  fileContent = fileContent.replace(/^"|"$/g, '');

  const fileName = `vewrite-export-${id}.md`;

  // Set the response headers
  event.res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  event.res.setHeader('Content-Type', 'text/plain');

  // Send the file content
  return send(event, fileContent);
});