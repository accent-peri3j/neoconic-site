import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import middleware from './region.func/index.js';
import { PREFERENCE_MAX_AGE, REGION_COOKIE, preferenceCookie } from './region.func/policy.js';

const request = (path = '/', options = {}) => new Request(`https://neoconic.com${path}`, options);
const checkPrivate = response => {
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('cdn-cache-control'), 'no-store');
  assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store');
  assert.equal(response.headers.get('vary'), 'Cookie, X-Vercel-IP-Country');
};

test('CW GET and HEAD responses redirect without setting a tracking or preference cookie', async () => {
  for (const method of ['GET', 'HEAD']) {
    const response = middleware(request('/?utm_source=billboard', { method, headers: { 'x-vercel-ip-country': 'CW' } }));
    assert.equal(response.status, 307);
    assert.equal(response.headers.get('location'), '/cw?utm_source=billboard');
    assert.equal(response.headers.get('set-cookie'), null);
    assert.equal(response.headers.get('x-middleware-next'), null);
    assert.equal(await response.text(), '');
    checkPrivate(response);
  }
});

test('global fallthrough is private, has the middleware continuation header, and sets no cookie', () => {
  for (const headers of [{}, { 'x-vercel-ip-country': 'NL' }, { 'x-vercel-ip-country': 'CW', cookie: `${REGION_COOKIE}=global` }]) {
    const response = middleware(request('/', { headers }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-middleware-next'), '1');
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('set-cookie'), null);
    checkPrivate(response);
  }
});

test('explicit Global choice works without cookies and persists a host-only secured preference', () => {
  const response = middleware(request('/?region=global', { headers: { 'x-vercel-ip-country': 'CW' } }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-middleware-next'), '1');
  assert.equal(response.headers.get('location'), null);
  assert.equal(response.headers.get('set-cookie'), `${REGION_COOKIE}=global; Max-Age=15552000; Path=/; Secure; HttpOnly; SameSite=Lax`);
  assert.equal(PREFERENCE_MAX_AGE, 180 * 24 * 60 * 60);
  assert.match(REGION_COOKIE, /^__Host-/);
  assert.doesNotMatch(response.headers.get('set-cookie'), /Domain=/i);
  checkPrivate(response);
});

test('explicit Curaçao selection safely redirects and sets only the region cookie', () => {
  const response = middleware(request('/?region=curacao&utm_campaign=local&returnTo=https%3A%2F%2Fevil.example', { headers: { 'x-vercel-ip-country': 'NL' } }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), '/cw?utm_campaign=local&returnTo=https%3A%2F%2Fevil.example');
  assert.equal(response.headers.get('set-cookie'), preferenceCookie('curacao'));
  checkPrivate(response);
});

test('unsafe or duplicate query preferences cannot be written as cookies', () => {
  for (const path of ['/?region=global&region=curacao', '/?region=GLOBAL', '/?region=global%0D%0ASet-Cookie%3Apwned%3D1', '/?region=//evil.example']) {
    const response = middleware(request(path, { headers: { 'x-vercel-ip-country': 'CW' } }));
    assert.equal(response.headers.get('set-cookie'), null);
    assert.equal(response.status, 307);
    assert.match(response.headers.get('location'), /^\/cw(?:\?|$)/);
  }
  assert.throws(() => preferenceCookie('global; unsafe=1'), TypeError);
});

test('injected country query parameters and unrelated proxy headers do not control routing', () => {
  const response = middleware(request('/?country=CW&geo=CW&x-vercel-ip-country=CW', { headers: { 'cf-ipcountry': 'CW', 'x-country': 'CW', 'x-forwarded-for': '1.1.1.1' } }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('location'), null);
  assert.equal(response.headers.get('x-middleware-next'), '1');
});

test('direct regional and global paths are unmodified even if the middleware is accidentally invoked', () => {
  for (const path of ['/cw', '/cw/about', '/cw/privacy-policy', '/work', '/work/better-deals', '/privacy-policy', '/assets/site.js', '/api/contact']) {
    const response = middleware(request(`${path}?region=curacao`, { headers: { 'x-vercel-ip-country': 'CW' } }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-middleware-next'), '1');
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('set-cookie'), null);
    assert.equal(response.headers.get('cache-control'), null);
  }
});

test('mutation and OPTIONS methods are unaffected even if accidentally invoked', () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
    const response = middleware(request('/?region=curacao', { method, headers: { 'x-vercel-ip-country': 'CW' } }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('set-cookie'), null);
  }
});

test('alternating visitors and preferences cannot contaminate a later routing decision', () => {
  const scenarios = [
    [{ 'x-vercel-ip-country': 'CW' }, 307],
    [{ 'x-vercel-ip-country': 'NL' }, 200],
    [{ 'x-vercel-ip-country': 'CW', cookie: `${REGION_COOKIE}=global` }, 200],
    [{ 'x-vercel-ip-country': 'NL', cookie: `${REGION_COOKIE}=curacao` }, 307],
    [{}, 200],
    [{ 'x-vercel-ip-country': 'CW' }, 307],
  ];
  for (const [headers, status] of scenarios) {
    const response = middleware(request('/', { headers }));
    assert.equal(response.status, status);
    checkPrivate(response);
  }
});

test('Build Output middleware route only matches GET/HEAD root, and the function uses Edge runtime', async () => {
  const route = JSON.parse(await readFile(new URL('./middleware-route.json', import.meta.url), 'utf8'));
  const config = JSON.parse(await readFile(new URL('./region.func/.vc-config.json', import.meta.url), 'utf8'));
  const matcher = new RegExp(route.src);
  assert.equal(matcher.test('/'), true);
  for (const path of ['/cw', '/cw/', '/about', '/work', '/assets/a.js', '/_region', '//']) assert.equal(matcher.test(path), false);
  assert.deepEqual(route.methods, ['GET', 'HEAD']);
  assert.equal(route.middlewarePath, '_region');
  assert.equal(route.continue, true);
  assert.deepEqual(config, { runtime: 'edge', entrypoint: 'index.js' });
});
