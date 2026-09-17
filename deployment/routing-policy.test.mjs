import test from 'node:test';
import assert from 'node:assert/strict';
import { decideRegionRoute, REGION_COOKIE } from './region.func/policy.js';

const decide = input => decideRegionRoute({ url: 'https://neoconic.com/', ...input });
const cookie = region => `${REGION_COOKIE}=${region}`;

test('CW homepage receives a temporary, private redirect', () => {
  const result = decide({ country: 'CW' });
  assert.equal(result.action, 'redirect');
  assert.equal(result.location, '/cw');
  assert.equal(result.status, 307);
  assert.equal(result.reason, 'country-cw');
  assert.equal(result.preferenceToSave, null);
  assert.equal(result.headers['Cache-Control'], 'private, no-store');
});

for (const country of ['NL', undefined, null, '', 'XX', 'T1', 'UNKNOWN']) {
  test(`country ${String(country)} safely retains global homepage`, () => {
    const result = decide({ country });
    assert.equal(result.action, 'next');
    assert.equal(result.region, 'global');
    assert.equal(result.reason, 'global-fallback');
  });
}

test('manual global choice wins over CW and saved Curaçao', () => {
  const result = decide({ url: '/?region=global', country: 'CW', cookieHeader: cookie('curacao') });
  assert.equal(result.action, 'next');
  assert.equal(result.region, 'global');
  assert.equal(result.reason, 'manual-choice');
  assert.equal(result.preferenceToSave, 'global');
  assert.equal(result.headers['Cache-Control'], 'private, no-store');
});

test('manual Curaçao choice wins over NL and saved global', () => {
  const result = decide({ url: '/?region=curacao', country: 'NL', cookieHeader: cookie('global') });
  assert.equal(result.location, '/cw');
  assert.equal(result.preferenceToSave, 'curacao');
  assert.equal(result.reason, 'manual-choice');
});

test('global manual escape works with cookies unavailable', () => {
  assert.equal(decide({ url: '/?region=global', country: 'CW' }).action, 'next');
});

test('saved global preference overrides CW', () => {
  const result = decide({ country: 'CW', cookieHeader: `other=1; ${cookie('global')}` });
  assert.equal(result.action, 'next');
  assert.equal(result.reason, 'saved-preference');
  assert.equal(result.preferenceToSave, null);
});

test('saved Curaçao preference overrides NL and missing geo', () => {
  for (const country of ['NL', undefined]) {
    const result = decide({ country, cookieHeader: cookie('curacao') });
    assert.equal(result.location, '/cw');
    assert.equal(result.reason, 'saved-preference');
    assert.equal(result.preferenceToSave, null);
  }
});

test('unknown choices and malformed or duplicate cookies fall back safely', () => {
  for (const cookieHeader of [cookie('bogus'), cookie('%E0%A4%A'), `${cookie('global')}; ${cookie('curacao')}`]) {
    assert.equal(decide({ url: '/?region=bogus', country: 'CW', cookieHeader }).reason, 'country-cw');
  }
  assert.equal(decide({ url: '/?region=global&region=curacao', country: 'CW' }).reason, 'country-cw');
});

test('campaign parameters and fragments survive; routing control is removed', () => {
  const result = decide({
    url: '/?region=curacao&utm_source=billboard&utm_campaign=Curacao%20launch&tag=a&tag=b#work',
  });
  const target = new URL(result.location, 'https://neoconic.com');
  assert.equal(target.pathname, '/cw');
  assert.equal(target.searchParams.get('utm_source'), 'billboard');
  assert.equal(target.searchParams.get('utm_campaign'), 'Curacao launch');
  assert.deepEqual(target.searchParams.getAll('tag'), ['a', 'b']);
  assert.equal(target.searchParams.has('region'), false);
  assert.equal(target.hash, '#work');
});

for (const url of ['/cw', '/cw/', '/work/better-deals', '/assets/app.js', '/api/contact', '/unknown']) {
  test(`direct path ${url} is never changed by geo or preference`, () => {
    const result = decide({ url, country: 'CW', cookieHeader: cookie('curacao') });
    assert.equal(result.action, 'next');
    assert.equal(result.reason, 'direct-path');
    assert.equal(result.preferenceToSave, null);
  });
}

test('following the redirect terminates even with persistent CW detection', () => {
  const first = decide({ country: 'CW' });
  const second = decide({ url: first.location, country: 'CW', cookieHeader: cookie('curacao') });
  assert.equal(second.action, 'next');
});

test('direct Curaçao link stays accessible from NL with saved global preference', () => {
  assert.equal(decide({ url: '/cw', country: 'NL', cookieHeader: cookie('global') }).action, 'next');
});

test('POST and other mutation requests are never redirected', () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
    assert.equal(decide({ country: 'CW', method }).reason, 'method-excluded');
  }
  assert.equal(decide({ country: 'CW', method: 'HEAD' }).action, 'redirect');
});

test('user-controlled origins and destination parameters cannot produce open redirects', () => {
  for (const url of [
    'https://evil.example/?region=curacao',
    '//evil.example/?region=curacao',
    '/?region=curacao&next=https%3A%2F%2Fevil.example&returnTo=%2F%2Fevil.example',
    '/?region=https%3A%2F%2Fevil.example',
    '/?region=curacao&next=%0D%0ALocation%3Ahttps%3A%2F%2Fevil.example',
  ]) {
    const result = decide({ url, country: 'CW' });
    assert.equal(result.action, 'redirect');
    assert.match(result.location, /^\/cw(?:[?#]|$)/);
    assert.equal(new URL(result.location, 'https://neoconic.com').origin, 'https://neoconic.com');
    assert.doesNotMatch(result.location, /[\r\n]/);
  }
});

test('invalid URL and non-HTTP schemes never trigger a redirect', () => {
  for (const url of ['https://[invalid', 'javascript:alert(1)', 'data:text/html,test']) {
    assert.equal(decide({ url, country: 'CW' }).reason, 'invalid-url');
  }
});
