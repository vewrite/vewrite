import { defineEventHandler, getQuery, send } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { id } = query;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id parameter',
    });
  }

  const fileContent = `${id}`;
  const fileName = `vewrite-export-${id}.md`;

  // Set the response headers
  event.res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  event.res.setHeader('Content-Type', 'text/plain');

  // Send the file content
  return send(event, fileContent);
});