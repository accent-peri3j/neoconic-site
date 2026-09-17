# Production release: global + Curaçao

Vercel runs `npm run build:release` as configured in `vercel.json`. It installs only the locked dependencies under `regional/` and emits Vercel Build Output API v3.

- Edit **`regional/src/`** for the approved `/cw` experience.
- **`production-static/`** is the verified, frozen original global website. Its files are checked byte-for-byte during every release; only the generated sitemap is extended.
- The original global source at the repository root remains available for future intentional global work. Changing it alone does not change this preserved production snapshot.
- Run `npm run test:release` after a release build for analytics, SEO, routing and preservation checks.
- See [deployment and rollback instructions](deployment/README.md) and [analytics verification](deployment/ANALYTICS-VERIFICATION.md).

No credentials or environment files belong in the repository. Keep the prior Vercel production deployment available until launch validation is complete.

---
