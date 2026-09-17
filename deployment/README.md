# Neoconic regional production release

## Preserved global baseline

`production-static/` contains the public files captured from the existing production deployment `neoconic-site-pbne10fbg-accent-peri3js-projects.vercel.app`, commit `f287f93b41263ad849a0170b5e83da717572caab`. `global-baseline-manifest.json` records their SHA-256 values and the verified global routes. Treat this snapshot as frozen. The original source remains at the repository root for reference; the release packaging process deliberately does not rebuild that global version.

## Reproducible build

The regional source and lockfile live in `regional/`. After installing its locked dependencies, run:

```sh
node regional/scripts/build-regional-release.mjs .regional-build
node scripts/package-release.mjs
node scripts/validate-release.mjs
node --test scripts/release-lib.test.mjs
```

The packager accepts an optional build-directory argument, followed by an optional SEO-module path, both resolved against the repository root. By default those are `.regional-build` and `regional/src/app/seo/curacao-seo.mjs`.

Output is Vercel Build Output API v3 under `.vercel/output`. A non-public validation report is written to `.vercel/release-validation.json`. The build is suitable for `vercel deploy --prebuilt` after authenticating to the correct existing Neoconic project. There is no deploy command in the packaging script and no token, environment file or project credential in this source.

The packager publishes only the verified global snapshot, generated regional documents, regional bundles, and reviewed Edge middleware. It excludes source, tests, dependency directories, source maps, backups and hidden files. It rejects common private-key/API-token patterns and checks all preserved global bytes. The only intentional existing-file change is `sitemap.xml`: existing URLs/fields stay intact; regional entries and reciprocal `en`/`en-CW`/`x-default` annotations are added by the regional SEO module.

## Routing

- `/`: root GET/HEAD middleware chooses explicit query preference, then saved preference, then Vercel IP country `CW`, otherwise global. Regional decisions use HTTP 307; all root decisions are private/no-store.
- `/?region=global`: serves the existing global document and stores the explicit choice. The regional Global control must use a real document link, not a client-router transition.
- `/?region=curacao`: stores an explicit regional choice and redirects to `/cw`.
- `/cw`, `/cw/work`, `/cw/about`, `/cw/contact`, `/cw/privacy-policy`: distinct prerendered regional documents. Direct access works regardless of country/preference. Canonical trailing-slash and `/index.html` variants redirect once to the corresponding clean URL.
- Unknown `/cw/...`: HTTP 404 with `noindex, follow`, never a global SPA page.
- All original global deep links, SPA fallback and asset cache rules are retained.
- The internal middleware URL `/_region` is explicitly mapped to the original global SPA document before filesystem routing, avoiding a publicly invoked middleware endpoint.

The cookie is `__Host-neoconic_region`, with `Secure; HttpOnly; SameSite=Lax; Path=/` and a 180-day lifetime. Only manual choice sets it. There is no country-test override, cross-site destination, external geolocation lookup, or stored location history. Known campaign parameters remain on regional redirects.

Regional pages receive `nosniff`, `frame-ancestors 'self'`, and `strict-origin-when-cross-origin`; this does not alter global page headers. The CSP only constrains who may frame a regional page, preserving existing media/analytics behaviour.

## Verify before promotion

1. Confirm Vercel preview returns the expected regional HTML and clean canonical URLs, and unknown regional URLs return actual 404s.
2. Verify the Global link and cookie across real navigation; test explicit Curaçao choice and a later root request. Confirm private/no-store and cookie attributes in responses.
3. Compare live global root/assets with the frozen SHA-256 baseline. Compare original sitemap entries/fields as well.
4. Verify direct regional pages, assets, media and analytics consent in the browser.
5. Actual country detection still needs a visitor or network genuinely located in Curaçao; offline header injection proves policy logic only.
6. Keep the previous production deployment available for Vercel rollback until launch acceptance.

Official specifications used: [Build Output configuration](https://vercel.com/docs/build-output-api/configuration), [Edge middleware](https://vercel.com/docs/build-output-api/features#routing-middleware), [Edge function files](https://vercel.com/docs/build-output-api/primitives#functions-with-edge-runtime), [country headers](https://vercel.com/docs/headers/request-headers#x-vercel-ip-country).
