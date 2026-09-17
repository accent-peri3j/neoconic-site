# Curaçao analytics release

## Configuration

- Existing public GA4 measurement ID: `G-ZSFS09L41L`, verified from the original production JavaScript and Google tag configuration on September 17, 2026.
- Regional Google Analytics runs only on `neoconic.com` and `www.neoconic.com`, within `/cw` routes, after explicit analytics consent. Local, Cloudflare and Vercel preview hosts do not send regional analytics.
- The tag's existing Enhanced Measurement configuration tracks browser-history page changes. The regional code sends only the initial consented pageview, avoiding the former additional manual router events. No Google Analytics Admin settings were changed.
- `contact_intent` records `contact_method: email` or `copy_email` and `site_region: curacao`. It means a contact control was used, not that an email was sent or a lead was received. No email address or message content is attached to these custom events.
- Google Signals and advertising personalization are disabled; advertising consent stays denied.
- Regional Plausible is disabled. Original global production HTML and JavaScript retain their existing analytics behavior.
- Cookie settings in the regional footer and privacy page reopen the consent controls. Withdrawing consent disables GA, clears its `_ga` cookies and reloads to unload the tag. The essential region preference is preserved.

## Automated checks completed

The portable repository test `tests/analytics.test.mjs` bundles the actual analytics module with the existing esbuild dependency and tests mocked browser state. Run `node --test tests/analytics.test.mjs`. It writes no files by default; an optional explicit report can be produced with `node tests/analytics.test.mjs --report=/chosen/path.json`. Release evidence in `analytics-check-results.json` records ten passing cases: consent absent/invalid, production-host restriction, global-route isolation, single tag load, initial pageview deduplication, bounded contact-event payload, withdrawal/cookie clearing, withdrawal during script loading, and withdrawal when saving the changed preference fails.

These checks verify application behavior; they do not prove receipt in the Google Analytics account.

## Owner's production check

1. Open Google Analytics and select the Neoconic property whose web stream has ID `G-ZSFS09L41L`.
2. Open **Reports → Realtime**.
3. In a fresh browser/private window without an analytics blocker, visit `https://neoconic.com/cw`. Before accepting, no Google Analytics tag should load.
4. Choose **Accept all**. Visit `/cw/work`, `/cw/about`, then `/cw/contact`. Realtime should show the activity and those pages. Consent rejection and ad blockers intentionally suppress measurement.
5. On Contact, use **Copy email**. Realtime's event list should show `contact_intent`. An email-link click also emits it, but an email does not need to be sent.
6. For exact per-event checking, connect **Google Tag Assistant** to the site, then open **Admin → DebugView**. Inspect one `page_view` per route change, correct `page_location`/`page_title`, and `contact_method` on `contact_intent`. Do not enable debug mode for all visitors.
7. Open **Cookie settings**, turn Analytics off, and save. The page reloads. Further navigation should not send regional events. Existing data already collected is not erased by withdrawal.

For reporting, filter page path to **starts with `/cw`**. The site region is a content choice, so visits to `/cw` can originate anywhere; compare actual geographic country separately. Mark `contact_intent` as a key event only if that contact-control action is useful to the business; it is not a completed enquiry.

## Remaining account-side checks

- Confirm Realtime/DebugView receipt with authenticated property access.
- Confirm the web stream's **Enhanced Measurement → Page views → Page changes based on browser history events** remains enabled. Its public tag configuration was enabled at release inspection; the regional implementation relies on that setting.
- The property's retention settings, custom dimensions and key-event configuration were not changed or independently verified.
- If `contact_method` and `site_region` need to appear in longer-term reports, register them as event-scoped custom dimensions in GA Admin.

## References

- [Google: Measure pageviews and avoid duplicate history events](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Google: Set up consent mode](https://developers.google.com/tag-platform/security/guides/consent)
- [Google: Confirm data collection](https://support.google.com/analytics/answer/9333790)
- [Google: Monitor events in DebugView](https://support.google.com/analytics/answer/7201382)
