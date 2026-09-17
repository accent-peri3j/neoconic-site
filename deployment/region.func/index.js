import { decideRegionRoute, preferenceCookie } from './policy.js';

/** Vercel Build Output API Edge middleware, matched to GET/HEAD / only. */
export default function middleware(request) {
  const decision = decideRegionRoute({
    url: request.url,
    method: request.method,
    country: request.headers.get('x-vercel-ip-country'),
    cookieHeader: request.headers.get('cookie'),
  });
  const headers = new Headers(decision.headers);
  if (decision.preferenceToSave) {
    headers.set('Set-Cookie', preferenceCookie(decision.preferenceToSave));
  }
  if (decision.action === 'redirect') {
    headers.set('Location', decision.location);
    return new Response(null, { status: decision.status, headers });
  }
  // Official Build Output API pass-through protocol; serves the preserved root file.
  headers.set('x-middleware-next', '1');
  return new Response(null, { headers });
}
