export async function onRequest() {
  return new Response("404 Not Found", {
    status: 404,
    statusText: "Not Found",
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}
