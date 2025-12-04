export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // 1. Redirect /pages/*.html → /*
  const htmlMatch = path.match(/^\/pages\/([^/]+)\.html$/);
  if (htmlMatch) {
    return Response.redirect(`${url.origin}/${htmlMatch[1]}`, 301);
  }

  // 2. Redirect /pages/* (without .html) → /*
  const cleanMatch = path.match(/^\/pages\/([^/]+)$/);
  if (cleanMatch) {
    return Response.redirect(`${url.origin}/${cleanMatch[1]}`, 301);
  }

  // 3. Try to serve normally
  const response = await context.next();

  // 4. If the target file DOES NOT EXIST → redirect to root and clean URL
  if (response.status === 404) {
    return Response.redirect(`${url.origin}/`, 301);
  }

  return response;
}
