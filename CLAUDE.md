# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run seed         # Seed Sanity CMS with initial data (requires SANITY_API_TOKEN)
npm run test:e2e     # Run Playwright end-to-end tests
npm run test:e2e:ui  # Run Playwright in interactive UI mode
```

ESLint errors are ignored during builds (`eslint: { ignoreDuringBuilds: true }` in `next.config.ts`), so always run `npm run lint` manually to catch issues.

## Environment Variables

Copy `.env.example` to `.env`. Required variables:

- `NEXTAUTH_SECRET` — JWT signing secret (generate: `openssl rand -base64 32`)
- `NEXTAUTH_URL` — Full URL of the site
- `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH` — Admin panel password (bcrypt hash preferred)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` — Sanity CMS credentials
- `SANITY_API_TOKEN` — Write token, only needed for `npm run seed`
- `SANITY_REVALIDATE_SECRET` — Shared secret for the Sanity webhook ISR trigger

Optional:

- `VISITS_DATA_DIR` — Directory holding the visit counter's `visits.json` (see Visit Counter below). Defaults to `.data/` at the project root; point it outside the project on hosts that wipe the app directory on deploy.

## Architecture

### Routing & Internationalisation

The site is bilingual (French default, Arabic). All public pages live under `app/[locale]/` and are handled by `next-intl` with `localePrefix: 'as-needed'` (French URLs have no prefix, Arabic gets `/ar/`). The `middleware.ts` routes:

- `/admin/*` and `/studio/*` — bypassed by the intl middleware, handled by NextAuth
- `/auth/*` — bypassed entirely (no middleware)
- everything else — goes through the intl middleware

Use the typed navigation helpers from `navigation.ts` (`Link`, `useRouter`, `usePathname`, `redirect`) instead of Next.js built-ins — these automatically handle locale prefixes.

Translation strings live in `messages/fr.json` and `messages/ar.json`. Access them in components via `useTranslations()` (client) or `getTranslations()` (server) from `next-intl`.

### CMS: Sanity

All dynamic content is stored in Sanity. The data flow is:

1. **Schemas** defined in `sanity/schemas/` (one file per document type)
2. **GROQ queries** in `sanity/lib/queries.ts` — all queries are centralised here
3. **Fetch functions** in `sanity/lib/fetch.ts` — thin wrappers that call `client.fetch()` with ISR cache options
4. **Localisation** via `sanity/lib/localize.ts` — the `localizeSanityData(data, locale)` function recursively replaces any field `foo` with `foo_ar` when `locale === 'ar'`. All bilingual fields in Sanity schemas follow the `field` / `field_ar` naming convention.

In development, Sanity fetches use `cache: 'no-store'` so changes appear on page refresh. In production, ISR revalidates every hour (3600s) by default. The Sanity webhook hits `POST /api/revalidate?secret=...` to force on-demand revalidation after any content publish.

The Sanity Studio is embedded at `/admin/dashboard` (configured in `sanity.config.ts` with `basePath: '/admin/dashboard'`).

### Admin Panel

There are two separate admin interfaces:

1. **Custom admin panel** (`app/admin/(panel)/`) — a bespoke Next.js dashboard for site management. Protected client-side by NextAuth session check in the group layout (`app/admin/(panel)/layout.tsx`). The API routes under `app/api/admin/` enforce server-side auth via `getServerSession`.

2. **Sanity Studio** (`app/admin/dashboard/[[...tool]]/`) — the embedded Sanity CMS. Protected by NextAuth middleware (see `isAdminDashboard` check in `middleware.ts`).

Authentication uses NextAuth with a single credentials provider (password-only, no username). It tries `ADMIN_PASSWORD_HASH` (bcrypt) first, falls back to plaintext `ADMIN_PASSWORD`. Login page is at `/auth/signin`.

### Section Layout Conventions

Public sections follow two vertical rhythms and one shared header component:

- **Standard section**: `py-16 sm:py-20 md:py-24`
- **Accent section** (dark full-bleed moments — `home-care`, `transformation-announcement`): `py-20 sm:py-24 md:py-32`

The badge → H2 → subtitle block is `components/ui/section-header.tsx`. Use it rather than
recopying the markup — it owns the H2 scale and the badge pill for the whole site. It is
presentational only: sections keep their own animation wrapper (`AnimatedSection`,
`ScrollAnimation`, `motion.div`) and pass an already-composed `title` node.

Two sizes: `size="section"` (default, `text-3xl sm:text-4xl md:text-5xl`, centered) for top-level
sections, and `size="subsection"` (`text-2xl sm:text-3xl`, left-aligned) for headings *inside* a
content page — the pole detail pages use this one. Pole sub-sections run on their own tighter
rhythm, `py-14 sm:py-16 md:py-20`; the page's closing CTA uses the standard section rhythm.

### Sticky Navigation

The homepage `Header` (the 3D scanner scene) is in normal flow and scrolls away. `components/sticky-nav.tsx`
is a compact 60px bar that `Header` renders and reveals past 320px of scroll; it reuses the header's
resolved poles, active-section state and mobile menu. The header markup itself is frozen — see the
navbar note in memory. Anchor offsets rely on `scroll-padding-top: 80px` in `app/globals.css`.

### Page Data Pattern

Server components fetch all Sanity data in parallel via `Promise.all()`, then pass it through `localizeSanityData()` before passing down to client components. See `app/[locale]/page.tsx` for the canonical example.

Heavy below-the-fold components (Testimonials, HomeCare, EquipementsGallery) are lazy-loaded via `next/dynamic` with `ssr: false` and skeleton loaders — see `components/lazy.tsx`.

### Key Libraries

- **Framer Motion** — page transitions (`components/page-transition.tsx`) and scroll animations
- **GSAP** — custom animations (configured in `lib/gsap-config.ts`, use the `@gsap/react` hooks)
- **Radix UI** — all primitive UI components in `components/ui/`
- **Tailwind CSS v4** — utility classes; PostCSS config in `postcss.config.mjs`
- **Resend** — transactional email via `app/api/send-email/route.ts`

### Images

All Sanity images go through `@sanity/image-url` (see `sanity/lib/image.ts`). Remote patterns in `next.config.ts` only allow `cdn.sanity.io`. The Next.js Image component is configured to prefer AVIF format with a 1-year cache TTL.

### Visit Counter

A self-hosted page-view counter, independent of Google Analytics. `components/visit-tracker.tsx` (mounted in `app/[locale]/layout.tsx`) beacons each navigation to `POST /api/track`; `lib/visits.ts` keeps the counters in memory and flushes them to `visits.json` atomically every 5s. Results are shown at `/admin/statistiques`, served by `GET /api/admin/stats` (`DELETE` resets them). Day keys use the `Africa/Algiers` timezone, history is pruned to 400 days, and known bot user-agents are ignored.

State lives on the server's filesystem, so it is per-instance and does not survive a wiped deploy directory — see `VISITS_DATA_DIR` above.

### Remotion (Video)

The `remotion-okba/` directory is a separate Remotion project for video generation. It has its own `package.json` and must be run independently — it is not part of the Next.js build.
