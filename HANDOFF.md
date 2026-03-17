# Neoconic Portfolio — Production Handoff

> Generated: March 17, 2026
> Status: Frontend prototype — ready for production integration

---

## 1. Project Overview

**Neoconic** is a premium minimal portfolio website for a design studio specializing in fintech and technology branding. The site features a dark color system, large Satoshi typography, cinematic project showcases, and a high-end aesthetic inspired by Apple, Linear, and Porsche websites.

**Tech Stack:**
- React 18.3.1
- React Router 7.13.0 (Data mode / `createBrowserRouter`)
- Tailwind CSS 4.1.12 (v4, PostCSS-based)
- Motion (Framer Motion successor) 12.23.24
- Vite 6.3.5
- TypeScript

---

## 2. Folder Structure

```
/
├── package.json
├── vite.config.ts
├── postcss.config.mjs
├── ATTRIBUTIONS.md
│
├── src/
│   ├── styles/
│   │   ├── fonts.css            # Satoshi font import (Fontshare CDN)
│   │   ├── tailwind.css         # Tailwind v4 directives
│   │   ├── theme.css            # Design tokens (CSS custom properties)
│   │   └── index.css            # Global overrides, animations, scrollbar
│   │
│   ├── imports/                  # Figma-imported SVG components & assets
│   │   ├── NeoconicLogoBlack.tsx # Main Neoconic wordmark (SVG component)
│   │   ├── PaydoraLogoWhite.tsx  # Paydora client logo (SVG component)
│   │   ├── BetterDealsLogo.tsx   # Better Deals client logo (SVG component)
│   │   ├── OwnaryLogo.tsx        # Ownary logo (SVG component, unused)
│   │   ├── svg-06omlw0azk.ts    # SVG path data
│   │   ├── svg-574quszfj1.ts    # SVG path data
│   │   ├── svg-exg8zb21c6.ts    # SVG path data
│   │   └── svg-mcwvs2dkr4.ts    # SVG path data
│   │
│   └── app/
│       ├── App.tsx              # Root — renders RouterProvider
│       ├── routes.ts            # All route definitions
│       │
│       ├── data/
│       │   └── projects.ts      # Project data model + 5 project entries
│       │
│       ├── components/
│       │   ├── Layout.tsx        # Root layout (Nav + Outlet + Footer + Cookie + Analytics)
│       │   ├── Navigation.tsx    # Fixed header with theme-aware color switching
│       │   ├── Footer.tsx        # Footer with geo-connection element
│       │   ├── HeroA.tsx         # Hero variant A — ambient red orb (unused, kept as option)
│       │   ├── HeroB.tsx         # Hero variant B — animated dot field + orb (ACTIVE)
│       │   ├── CinematicShowcase.tsx # Full-screen scroll-snap project showcase
│       │   ├── CookieConsent.tsx # GDPR cookie consent banner
│       │   ├── Analytics.tsx     # Analytics readiness layer (placeholder)
│       │   ├── PageTransition.tsx # Animated page transitions
│       │   ├── LegalPage.tsx     # Shared layout for legal pages
│       │   ├── project-card.tsx  # ProjectCard, ProjectLogo, FadeIn, SectionLabel
│       │   │
│       │   ├── figma/
│       │   │   └── ImageWithFallback.tsx  # Protected — do not modify
│       │   │
│       │   └── ui/              # shadcn/ui component library (Radix-based)
│       │       └── ... (40+ components — accordion, button, dialog, etc.)
│       │
│       └── pages/
│           ├── Home.tsx          # Homepage
│           ├── Work.tsx          # Project detail page
│           ├── About.tsx         # About page
│           ├── Contact.tsx       # Contact page with form
│           ├── PrivacyPolicy.tsx # GDPR privacy policy
│           ├── Terms.tsx         # Terms of use
│           └── Disclaimer.tsx    # Legal disclaimer
```

---

## 3. Routes / Pages

| Route              | Component        | Description                           |
|--------------------|------------------|---------------------------------------|
| `/`                | `Home`           | Hero, cinematic showcase, capabilities, CTA |
| `/work`            | `Work`           | All 5 projects with galleries, supports `#hash` scroll |
| `/about`           | `About`          | Studio intro, values                  |
| `/contact`         | `Contact`        | Contact form + info                   |
| `/privacy-policy`  | `PrivacyPolicy`  | GDPR privacy policy                   |
| `/terms`           | `Terms`          | Terms of use                          |
| `/disclaimer`      | `Disclaimer`     | Legal disclaimer                      |

**Routing:** Uses React Router v7 Data mode (`createBrowserRouter`). All pages are wrapped in `Layout` which provides Navigation, Footer, CookieConsent, Analytics, and page transitions via `AnimatePresence`.

**Deep linking:** The Work page supports hash-based scrolling (e.g., `/work#bluecode`) to jump to specific project sections.

---

## 4. Reusable Components

| Component             | File                        | Purpose                                |
|-----------------------|-----------------------------|----------------------------------------|
| `Layout`              | `components/Layout.tsx`     | App shell: nav + footer + transitions  |
| `Navigation`          | `components/Navigation.tsx` | Fixed header, theme-aware (dark/light) |
| `Footer`              | `components/Footer.tsx`     | Footer with geo-connection element     |
| `HeroA`               | `components/HeroA.tsx`      | Hero with ambient red orb              |
| `HeroB`               | `components/HeroB.tsx`      | Hero with animated dot field canvas    |
| `CinematicShowcase`   | `components/CinematicShowcase.tsx` | Scroll-driven project slides    |
| `CookieConsent`       | `components/CookieConsent.tsx` | GDPR cookie banner + preferences    |
| `Analytics`           | `components/Analytics.tsx`  | Analytics placeholder (consent-aware)  |
| `PageTransition`      | `components/PageTransition.tsx` | Motion-based page transitions      |
| `LegalPage`           | `components/LegalPage.tsx`  | Shared legal page layout               |
| `LegalSection`        | `components/LegalPage.tsx`  | Reusable legal content block           |
| `ProjectCard`         | `components/project-card.tsx` | Project display (home/work variants) |
| `ProjectLogo`         | `components/project-card.tsx` | Client logo resolver by project ID   |
| `FadeIn`              | `components/project-card.tsx` | Scroll-triggered fade-in wrapper     |
| `SectionLabel`        | `components/project-card.tsx` | Section label with red dot (currently renders null) |
| `ImageWithFallback`   | `components/figma/ImageWithFallback.tsx` | Protected image component   |

---

## 5. Design Tokens — Fonts, Colors, Spacing

### Font
- **Primary:** Satoshi (loaded from Fontshare CDN)
- **Weights:** 300, 400, 500, 700
- **Import:** `@import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap')`
- **Fallback:** `'Satoshi', sans-serif`

### Colors (Hardcoded Design System)

| Token               | Value              | Usage                                 |
|----------------------|--------------------|---------------------------------------|
| Primary Background   | `#0B0B0B`          | Main dark background                  |
| Secondary Background | `#141414`          | CTA sections, cards, cookie banner    |
| Contrast / Light     | `#F7F7F7`          | Capabilities section background       |
| Accent Red           | `#EB1A22`          | Logo accent, dots, hover states, CTA  |
| Accent Red Hover     | `#c8151c`          | Darker red for button hover states    |
| White Text           | `#FFFFFF`          | Primary headings                      |
| Muted Text (dark bg) | `rgba(255,255,255,0.525)` | Body text on dark backgrounds  |
| Subtle Text          | `rgba(255,255,255,0.33)` | Secondary labels                  |
| Faint Text           | `rgba(255,255,255,0.21)` | Tertiary / legal text             |
| Dark Text (light bg) | `#0B0B0B`          | Headings on white sections            |
| Muted Dark Text      | `rgba(0,0,0,0.4)`  | Body text on white sections           |

### Brand Colors (Per-Project)

| Project      | Hex       | RGB             |
|--------------|-----------|-----------------|
| Bluecode     | `#0066FF` | `0, 102, 255`   |
| NumberX      | `#FFFFFF` | `255, 255, 255` |
| Paydora      | `#00C9A7` | `0, 201, 167`   |
| Baqme        | `#00B4A0` | `0, 180, 160`   |
| Better Deals | `#EB1A22` | `235, 26, 34`   |

### Spacing Patterns
- Max content width: `1440px`
- Horizontal padding: `px-8 md:px-12 lg:px-16` (32px / 48px / 64px)
- Section vertical padding: `clamp()` functions for fluid spacing
- Hero padding: `pb-28 md:pb-36 pt-48 md:pt-56`
- Page header top padding: `pt-40 md:pt-48` (accounts for fixed nav)

### Typography Scale (Inline Styles)
- Hero headline: `clamp(2.4rem, 5.5vw, 5rem)`, weight 500, tracking `-0.035em`
- Page titles: `clamp(2.75rem, 7vw, 6rem)`, weight 500, tracking `-0.04em`
- Section headings: `clamp(2.25rem, 5vw, 4.25rem)`, weight 500
- Project titles: `clamp(1.9rem, 3.5vw, 2.65rem)`, weight 500
- Body: `1.05rem`, line-height 1.65
- Labels/metadata: `11-13px`, uppercase, tracking `0.2-0.25em`
- Navigation links: `13px`, weight 500, tracking `0.025em`

---

## 6. Assets & Icons

### Raster Images (via `figma:asset` virtual imports)
These use Figma Make's asset system. In production, replace with actual hosted files:

| Import Path | Usage |
|-------------|-------|
| `figma:asset/cea6f3f5...png` | Better Deals project hero image |
| `figma:asset/fc05c7a0...png` | Bluecode client logo (ticker) / Baqme logo (project-card) |
| `figma:asset/5ac4d69b...png` | Baqme client logo (ticker) / Bluecode logo (project-card) |
| `figma:asset/d51ba61f...png` | NumberX client logo |

### SVG Components (in `/src/imports/`)
| Component | Usage |
|-----------|-------|
| `NeoconicLogoBlack` | Main wordmark — Navigation, Footer |
| `PaydoraLogoWhite`  | Paydora client logo — Ticker, Work page |
| `BetterDealsLogo`   | Better Deals client logo — Work page |
| `OwnaryLogo`        | Imported but currently unused |

### External Images (Unsplash)
All project hero images and gallery assets are Unsplash URLs. See **Section 8** for full list.

### Icons
- **lucide-react** — ArrowRight, ArrowUpRight, Mail, MapPin
- Custom inline SVGs: Play triangle, checkmark (contact success)

---

## 7. Responsive Behavior Notes

### Breakpoints
Uses Tailwind's default breakpoints:
- `md:` = 768px
- `lg:` = 1024px

### Navigation
- **Desktop (md+):** Horizontal text links with red underline hover animation
- **Mobile (<md):** Hamburger icon, full-screen overlay menu with staggered entrance

### Navigation Theme Switching
The header detects whether it's over a light or dark section using `document.elementsFromPoint()`. Sections with `data-header-theme="light"` trigger white-on-light-bg mode. Currently only the Capabilities section uses this.

### Layouts
- **Hero:** Full viewport height, content bottom-aligned
- **Cinematic Showcase:** Scroll-locked sticky viewport with virtual scroll pagination (`height: ${(count+1) * 100}vh`)
- **Capabilities:** 12-column grid collapses to single column on mobile
- **Work page projects:** 12-column grid (7/5 split) collapses on mobile
- **Contact:** 12-column grid (4/8 split) collapses on mobile
- **Footer:** 12-column grid (4/3/5 split) collapses on mobile

### Fluid Typography
All major headings use `clamp()` for smooth scaling between breakpoints. No hard font-size breakpoints.

### Scroll Behavior
- `scroll-behavior: smooth` on `html`
- Custom thin scrollbar (4px, dark themed)
- Page scroll-to-top on route change (`behavior: "instant"`)

---

## 8. Hardcoded Mock Data

### Projects (`/src/app/data/projects.ts`)

| # | Project | ID | Location | Status |
|---|---------|-----|----------|--------|
| 1 | Bluecode | `bluecode` | Vienna, Austria | Mock data |
| 2 | NumberX | `numberx` | Vienna, Austria | Mock data |
| 3 | Paydora | `paydora` | Munich, Germany | Mock data |
| 4 | Baqme | `baqme` | Rotterdam, Netherlands | Mock data |
| 5 | Better Deals | `betterdeals` | Willemstad, Curacao | Mock data |

Each project has: `id`, `title`, `description`, `role`, `scope[]`, `location`, `image`, `video?`, `overlay`, `gallery[]`.

### All Unsplash Image URLs (hardcoded)
These are live Unsplash URLs used as placeholder imagery:

**Project Hero Images:**
1. Bluecode — abstract blue gradient light dark minimal
2. NumberX — 3D metallic credit card dark background fintech
3. Paydora — minimal white credit card flat lay elegant
4. Baqme — Amsterdam canal bicycle Dutch street urban
5. Better Deals — local `figma:asset` PNG

**Project Gallery Images (3 per project, 15 total):**
All are Unsplash URLs covering: mobile payment, contactless terminal, brand identity, fintech cards, dashboards, cargo bikes, cycling infrastructure, cashback rewards, marketing campaigns, brand guidelines, etc.

**Project Video (1):**
- NumberX — YouTube embed: `https://www.youtube.com/embed/s-0GvtbNxX4` (lazy-loaded, click-to-play)

### Capabilities (`Home.tsx`)
4 items: Brand Identity, Product Design, Marketing Design, Spatial Interface Exploration

### Studio Values (`About.tsx`)
3 items: Clarity over complexity, Craft at every scale, Long-term partnerships

### Studio Stats (`About.tsx`)
3 items: 10+ Years, 40+ Projects, EU Market — now rendered as a 3-column grid

### Services (`Contact.tsx`)
4 items: Brand identity projects, Product design engagements, Design system creation, Spatial interface exploration

### Business Info (`Footer.tsx`)
- Chamber of Commerce (KvK): `80114172`
- VAT number: `NL003394829B60`
- Email: `hello@neoconic.com`

### Geographic Coordinates (`Footer.tsx`)
- Curacao: 12.1696 N, 68.9900 W
- Amsterdam: 52.3676 N, 4.9041 E

---

## 9. Backend / API Integration Requirements

### Currently Required (No Backend Wired)

| Feature | Current State | Backend Needed |
|---------|---------------|----------------|
| **Contact form** | `handleSubmit` sets `submitted = true` locally. No data is sent anywhere. | Email service (SendGrid, Resend, Postmark) or form backend (Formspree, Netlify Forms) |
| **Analytics** | Placeholder in `Analytics.tsx`. Console logs in dev mode only. | Privacy-friendly analytics (Plausible, Fathom, Umami, or Google Analytics) |
| **Cookie consent storage** | `localStorage` only. Preferences survive per-browser. | No backend needed for basic use. For cross-device sync, a consent management platform. |

### Recommended Integrations

| Integration | Purpose | Suggested Provider |
|-------------|---------|-------------------|
| Email/Form backend | Contact form submissions | Resend, SendGrid, Formspree, Netlify Forms |
| Analytics | Traffic & engagement tracking | Plausible (GDPR-compliant, recommended) |
| CMS (optional) | Project data management | Sanity, Contentful, Storyblok |
| Image hosting | Replace Unsplash placeholders | Cloudinary, imgix, or self-hosted |
| Video hosting | NumberX uses YouTube embed; others self-hosted if needed | Cloudinary, Mux, or self-hosted |

---

## 10. Environment Variables

**Currently:** No environment variables are required. The app is fully static.

**For production, you will need:**

```env
# Analytics (example for Plausible)
VITE_PLAUSIBLE_DOMAIN=neoconic.com

# Contact form (if using API-based form handler)
VITE_FORM_ENDPOINT=https://your-form-handler.com/api/submit

# Optional: Image CDN base URL
VITE_IMAGE_CDN=https://cdn.neoconic.com
```

Note: All `VITE_` prefixed variables are exposed to the client bundle. Never put secrets here.

---

## 11. Running Locally & Production Build

### Prerequisites
- Node.js >= 18
- pnpm (recommended) or npm

### Install Dependencies
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
# or
npx vite
```
Runs at `http://localhost:5173` by default.

### Production Build
```bash
pnpm build
# or
npx vite build
```
Outputs to `dist/` directory. Static files ready for deployment.

### Preview Production Build
```bash
npx vite preview
```

### Important Build Notes
- The `figma:asset/...` imports are resolved by Figma Make's build system. For a standalone project, you'll need to:
  1. Download all `figma:asset` PNGs and place them in a `/public/assets/` directory
  2. Replace imports with direct paths: `import img from "/assets/filename.png"`
- The SVG components in `/src/imports/` are self-contained React components and work as-is.

---

## 12. Dependencies

### Runtime Dependencies (Key)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18.3.1 | UI framework |
| `react-dom` | 18.3.1 | DOM renderer |
| `react-router` | 7.13.0 | Client-side routing (Data mode) |
| `motion` | 12.23.24 | Animations (page transitions, scroll reveals, ambient effects) |
| `lucide-react` | 0.487.0 | Icons |
| `class-variance-authority` | 0.7.1 | Variant-based component styling |
| `clsx` | 2.1.1 | Conditional classNames |
| `tailwind-merge` | 3.2.0 | Tailwind class deduplication |
| `tw-animate-css` | 1.3.8 | Tailwind animation utilities |

### Runtime Dependencies (Installed but Lightly Used)
These are installed for the shadcn/ui component library. Most are not actively used by the portfolio pages but available for expansion:

`@radix-ui/*` (14 packages), `@emotion/react`, `@emotion/styled`, `@mui/material`, `@mui/icons-material`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-day-picker`, `react-dnd`, `react-hook-form`, `react-popper`, `react-resizable-panels`, `react-responsive-masonry`, `react-slick`, `recharts`, `sonner`, `vaul`

> **Recommendation:** For production, audit and remove unused packages to reduce bundle size. The core portfolio only needs: `react`, `react-dom`, `react-router`, `motion`, `lucide-react`, `clsx`, `tailwind-merge`, and the Radix primitives used by active shadcn/ui components.

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | 6.3.5 | Build tool |
| `@vitejs/plugin-react` | 4.7.0 | React support for Vite |
| `tailwindcss` | 4.1.12 | CSS framework |
| `@tailwindcss/vite` | 4.1.12 | Tailwind Vite plugin |

---

## 13. Recommended Hosting

### Static Hosting (Recommended)
Since this is a fully client-side SPA:

| Provider | Notes |
|----------|-------|
| **Vercel** | Best for React/Vite. Zero-config deployment. Add `vercel.json` with SPA rewrites. |
| **Netlify** | Add `_redirects` file: `/* /index.html 200` for SPA routing. |
| **Cloudflare Pages** | Fast global CDN. Free tier generous. |
| **AWS S3 + CloudFront** | Most control. Configure index fallback for SPA routing. |

### SPA Routing Configuration
Since the app uses client-side routing (`createBrowserRouter`), all hosting providers need a catch-all redirect to `index.html`:

**Vercel (`vercel.json`):**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify (`public/_redirects`):**
```
/* /index.html 200
```

---

## 14. Classification: Frontend vs Backend vs Simulated

### Purely Frontend (Production-Ready)
- All page layouts and routing
- Navigation with theme-aware color switching
- Hero sections (both variants A and B)
- Cinematic scroll-snap showcase with scroll-driven animations
- Client logo ticker (infinite scroll)
- Capabilities section
- About page (intro, values)
- Footer with geographic connection element
- Page transitions (Motion-based)
- Cookie consent UI (localStorage persistence)
- Legal pages (Privacy Policy, Terms, Disclaimer)
- All responsive behavior
- Custom scrollbar styling
- Text selection styling (red accent)

### Requires Backend Integration
- **Contact form submission** — Wired to Formspree (`FORM_ENDPOINT` in `Contact.tsx`). Replace `YOUR_FORM_ID` with a real Formspree form ID. Currently falls back to showing success in demo mode.
- **Analytics tracking** — `Analytics.tsx` integrates Plausible Analytics. Set `VITE_PLAUSIBLE_DOMAIN` env var. Consent-aware: only initializes after user opts in via cookie banner.

### Currently Simulated / Fake
- **All project imagery** — Unsplash stock photos, not real project work. Replace with actual case study photography.
- **Project video** — NumberX uses real YouTube embed (`s-0GvtbNxX4`). No mock video data remaining.
- **Business registration numbers** — `80114172` and `NL003394829B60` are the real KvK and VAT numbers.
- **Contact form** — Posts to Formspree but uses placeholder form ID. Falls back to success state for demo.
- **Cookie consent** — Functional UI with localStorage persistence. Plausible analytics respects consent state.
- **Studio image** — Unsplash stock photo, not real studio photography.

---

## 15. Known Issues / TODOs (Updated)

1. ~~`SectionLabel` renders `null`~~ — **FIXED.** Now renders red dot + uppercase label.
2. ~~Ventures section empty~~ — **FIXED.** Compact 2-column dark card layout on Home.
3. ~~Stats section empty~~ — **FIXED.** 3-column stats grid rendered on About page.
4. ~~Studio image empty~~ — **FIXED.** Unsplash placeholder image with cinematic overlay.
5. **`OwnaryLogo.tsx` unused** — Imported SVG component with no references.
6. **Bundle size** — Many shadcn/ui components and heavy dependencies (MUI, recharts, etc.) are installed but unused. Tree-shaking helps but a manual audit would reduce install size.
7. **`figma:asset` imports** — These are Figma Make-specific. Must be migrated to standard image imports for standalone deployment.
8. ~~No 404 page~~ — **FIXED.** `NotFound` component at `{ path: "*" }` catch-all route.
9. ~~No `<meta>` tags or SEO~~ — **FIXED.** `useSEO` hook sets title, description, OG tags, Twitter cards, and canonical URL per page.
10. **No favicon** — Not included in this build.

---

*End of handoff document.*