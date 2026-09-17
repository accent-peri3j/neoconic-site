import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { test, after } from 'node:test';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';

const candidate = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(`${candidate}/package.json`);
const { buildSync } = require('esbuild');
const code = buildSync({
  entryPoints: [`${candidate}/src/lib/analytics.ts`], bundle: true, write: false,
  platform: 'node', format: 'cjs', define: { 'import.meta.env.VITE_GA_ID': '""' },
}).outputFiles[0].text;
const id = 'G-ZSFS09L41L';
const key = 'neoconic-cookie-consent';
const results = [];

function harness({host = 'neoconic.com', path = '/cw', consent = null} = {}) {
  let value = consent;
  const scripts = [], cookieWrites = [], emitted = [];
  let reloads = 0;
  const localStorage = {getItem: () => value, setItem: (_, next) => {value = next;}};
  const location = {hostname: host, pathname: path, search: '', href: `https://${host}${path}`, reload: () => {reloads++;}};
  const document = {
    title: 'Branding, Marketing & Design in Curaçao — Neoconic',
    get cookie() {return '_ga=abc; _ga_ZSFS09L41L=xyz; neoconic-region=cw';},
    set cookie(v) {cookieWrites.push(v);},
    createElement: () => ({remove() {this.removed = true;}}),
    head: {appendChild: script => scripts.push(script)},
    querySelector: () => null,
  };
  const window = {location, dispatchEvent: event => emitted.push(event)};
  const module = {exports: {}};
  runInNewContext(code, {window, document, localStorage, module, exports: module.exports, Event, Date});
  return {api: module.exports, scripts, cookieWrites, window, location, localStorage,
    reloads: () => reloads,
    events: () => (window.dataLayer || []).map(args => Array.from(args)),
  };
}

function check(name, run) {
  test(name, () => { run(); results.push({name, status: 'pass'}); });
}

check('No tag before positive consent, even if caller passes true', () => {
  const h = harness(); h.api.setRegionalAnalyticsConsent(true); assert.equal(h.scripts.length, 0);
});
check('Invalid stored consent never permits analytics', () => {
  for (const consent of ['broken', '{}', '{"analytics":"true"}', '{"analytics":false}']) {
    const h = harness({consent}); h.api.setRegionalAnalyticsConsent(true); assert.equal(h.scripts.length, 0);
  }
});
check('Analytics disabled on all previews and local hosts', () => {
  for (const host of ['localhost','127.0.0.1','mrs-tractor-firefox-eagles.trycloudflare.com','candidate.vercel.app','neoconic.com.evil.test']) {
    const h = harness({host, consent: '{"analytics":true}'}); h.api.setRegionalAnalyticsConsent(true); assert.equal(h.scripts.length, 0);
  }
});
check('Regional loader does not affect original global routes', () => {
  for (const path of ['/', '/contact', '/privacy-policy', '/cwhat']) {
    const h = harness({path, consent: '{"analytics":true}'}); h.api.setRegionalAnalyticsConsent(true); assert.equal(h.scripts.length, 0);
  }
});
check('Production consent loads exactly one verified tag with advertising disabled', () => {
  const h = harness({consent: '{"analytics":true}'});
  h.api.setRegionalAnalyticsConsent(true); h.api.setRegionalAnalyticsConsent(true);
  assert.equal(h.scripts.length, 1); assert.ok(h.scripts[0].src.endsWith(`id=${id}`));
  const config = h.events().find(e => e[0] === 'config');
  assert.equal(config[1], id); assert.equal(config[2].send_page_view, false);
  assert.equal(config[2].allow_google_signals, false); assert.equal(config[2].allow_ad_personalization_signals, false);
  const initialConsent = h.events()[0]; assert.equal(initialConsent[0], 'consent');
  assert.equal(initialConsent[2].ad_storage, 'denied'); assert.equal(initialConsent[2].ad_user_data, 'denied');
});
check('One initial pageview, no manual pageview on later consent or route updates', () => {
  const h = harness({consent: '{"analytics":true}'}); h.api.setRegionalAnalyticsConsent(true);
  h.scripts[0].onload(); h.scripts[0].onload();
  h.location.pathname = '/cw/contact'; h.api.setRegionalAnalyticsConsent(true);
  const views = h.events().filter(e => e[0] === 'event' && e[1] === 'page_view');
  assert.equal(views.length, 1); assert.equal(views[0][2].page_path, '/cw');
});
check('Contact intent sends only bounded event fields and never personal email content', () => {
  const h = harness({consent: '{"analytics":true}'}); h.api.setRegionalAnalyticsConsent(true);
  h.api.trackContactIntent('email'); h.api.trackContactIntent('copy_email');
  const events = h.events().filter(e => e[1] === 'contact_intent'); assert.equal(events.length, 2);
  assert.deepEqual(Object.keys(events[0][2]).sort(), ['contact_method','send_to','site_region']);
  assert.equal(events[0][2].contact_method, 'email'); assert.equal(events[1][2].contact_method, 'copy_email');
});
check('Withdrawal disables GA, clears only GA cookies, and reloads to unload listeners', () => {
  const h = harness({consent: '{"analytics":true}'}); h.api.setRegionalAnalyticsConsent(true); h.scripts[0].onload();
  h.localStorage.setItem(key, '{"analytics":false}'); h.api.setRegionalAnalyticsConsent(false);
  assert.equal(h.window[`ga-disable-${id}`], true); assert.equal(h.reloads(), 1);
  assert.ok(h.cookieWrites.length >= 4); assert.ok(h.cookieWrites.every(v => /^_ga(?:_|=)/.test(v)));
  assert.ok(h.cookieWrites.every(v => v.includes('Max-Age=0')));
  const before = h.events().length; h.api.trackContactIntent('email'); h.scripts[0].onload(); assert.equal(h.events().length, before);
});
check('Consent withdrawal while script is loading prevents the initial pageview', () => {
  const h = harness({consent: '{"analytics":true}'}); h.api.setRegionalAnalyticsConsent(true);
  h.localStorage.setItem(key, '{"analytics":false}'); h.api.setRegionalAnalyticsConsent(false); h.scripts[0].onload();
  assert.equal(h.events().filter(e => e[0] === 'event').length, 0);
});
check('Withdrawal blocks queued events even if saving the new preference fails', () => {
  const h = harness({consent: '{"analytics":true}'}); h.api.setRegionalAnalyticsConsent(true);
  h.api.setRegionalAnalyticsConsent(false); h.scripts[0].onload(); h.api.trackContactIntent('email');
  assert.equal(h.window[`ga-disable-${id}`], true); assert.equal(h.reloads(), 0);
  assert.equal(h.events().filter(e => e[0] === 'event').length, 0);
});

after(() => {
  const reportArg = process.argv.find(arg => arg.startsWith('--report='));
  if (reportArg) {
    writeFileSync(reportArg.slice('--report='.length), JSON.stringify({verifiedAt: new Date().toISOString(), checks: results}, null, 2));
  }
});
