export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // 1. Allow root assets, logos, styles, etc.
  if (path === '/' || path.includes('.')) {
    return context.next();
  }

  // 2. Allow any private client quote: /[Client]/[date] or /[client]/[date]
  // e.g. /Rebecca/261020 or /rebecca/261020 or /P/261020
  const match = path.match(/^\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/?$/);
  if (match) {
    const folder = match[1];
    const file = match[2];

    // Attempt to serve the HTML file matching folder and filename
    const targetUrl = new URL(`/${folder}/${file}.html`, url.origin);
    const assetResponse = await context.env.ASSETS.fetch(targetUrl);
    
    if (assetResponse.status === 200) {
      return assetResponse;
    }
  }

  // 3. Block anyone guessing directories or browsing publicly
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Ivory Events</title>
      <style>
        body { font-family: 'Georgia', serif; text-align: center; padding: 15vh 1rem; color: #2b2b2b; background: #faf9f6; }
        h1 { font-weight: normal; margin-bottom: 0.5rem; }
        p { font-family: sans-serif; color: #6e655f; font-size: 0.95rem; }
      </style>
    </head>
    <body>
      <h1>Ivory Events</h1>
      <p>Quotations are shared privately by link.</p>
    </body>
    </html>`,
    {
      status: 403,
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    }
  );
}
