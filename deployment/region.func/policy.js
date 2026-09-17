/** Root-only region policy. No network, credentials, tracking, or arbitrary destinations. */
export const REGION_COOKIE = '__Host-neoconic_region';
export const PREFERENCE_MAX_AGE = 60 * 60 * 24 * 180;
const ALLOWED_REGIONS = new Set(['global', 'curacao']);
export const PRIVATE_HEADERS = Object.freeze({
  'Cache-Control': 'private, no-store',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  Vary: 'Cookie, X-Vercel-IP-Country',
});

function readPreference(cookieHeader) {
  const values = String(cookieHeader ?? '').split(';').map(part => part.trim())
    .filter(part => part.slice(0, part.indexOf('=')) === REGION_COOKIE);
  // Duplicate cookies or unknown values cannot influence the selected experience.
  if (values.length !== 1) return null;
  try {
    const value = decodeURIComponent(values[0].slice(values[0].indexOf('=') + 1));
    return ALLOWED_REGIONS.has(value) ? value : null;
  } catch {
    return null;
  }
}

/** Pure policy is shared by the deployable Edge adapter and offline tests. */
export function decideRegionRoute({ url, country, cookieHeader, method = 'GET' }) {
  const next = (reason, region = null, preferenceToSave = null, root = false) => ({
    action: 'next', reason, region, preferenceToSave,
    ...(root ? { headers: { ...PRIVATE_HEADERS } } : {}),
  });

  if (!['GET', 'HEAD'].includes(method.toUpperCase())) return next('method-excluded');

  let requestUrl;
  try {
    requestUrl = new URL(url, 'https://neoconic.com');
  } catch {
    return next('invalid-url');
  }
  if (!['http:', 'https:'].includes(requestUrl.protocol)) return next('invalid-url');
  if (requestUrl.pathname !== '/') return next('direct-path');

  const choices = requestUrl.searchParams.getAll('region');
  const explicit = choices.length === 1 && ALLOWED_REGIONS.has(choices[0])
    ? choices[0] : null;
  const saved = readPreference(cookieHeader);
  const fromCountry = typeof country === 'string' && country.trim().toUpperCase() === 'CW'
    ? 'curacao' : 'global';
  const region = explicit ?? saved ?? fromCountry;
  const reason = explicit ? 'manual-choice' : saved ? 'saved-preference'
    : fromCountry === 'curacao' ? 'country-cw' : 'global-fallback';

  // Keep the manual Global query in the URL so this escape works without cookies too.
  // The existing root document supplies its own canonical URL.
  if (region === 'global') return next(reason, region, explicit, true);

  requestUrl.searchParams.delete('region');
  const query = requestUrl.searchParams.toString();
  return {
    action: 'redirect', reason, region, preferenceToSave: explicit,
    status: 307,
    location: `/cw${query ? `?${query}` : ''}${requestUrl.hash}`,
    headers: { ...PRIVATE_HEADERS },
  };
}

export function preferenceCookie(region) {
  if (!ALLOWED_REGIONS.has(region)) throw new TypeError('Invalid region preference');
  return `${REGION_COOKIE}=${region}; Max-Age=${PREFERENCE_MAX_AGE}; Path=/; Secure; HttpOnly; SameSite=Lax`;
}
