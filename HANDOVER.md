# Intercoutra Website — Handover Document

**Last updated:** 2026-08-13 (updated same day after a live debugging session — see §10)
**Written by:** Claude (Sonnet 5), for briefing a future Claude session (Claude Code or claude.ai) that picks up this project cold.

This document is the single source of truth for "what is this project, what's been built, what's configured, what's left, and what to do next." If you're a fresh Claude session reading this for the first time: read this whole file before touching anything. It supersedes any older assumption that this is a static HTML site — it is now a Next.js app (see "The Big Change" below).

---

## 1. What This Project Is

**Intercoutra** is a real, operating South African shuttle/transfer/tour company. This repo is its marketing + lead-generation website.

**Business model of the site (as of this rebuild):** the site is *not* a transactional booking system. It is a lead-generation funnel: visitor lands on a service page → reads pricing/benefits/trust signals → clicks **WhatsApp** or fills a short **enquiry form** → Intercoutra's team (Lawrence's staff) gets an SMS + email alert → a human takes over the conversation on WhatsApp/phone and closes the booking manually, off-platform.

### People

- **Adrian Mathidi** ("Anchor") — sole director of AnchorDrive Tech (Pty) Ltd, builds/maintains the digital side. This is *his* Claude session/account. Email `adrian.mathidi@gmail.com`.
- **Lawrence Matlhasela Letsoalo** — owns INTERCOUTRA (Pty) Ltd, runs the physical operation (vehicles, drivers, insurance, driver pay, his own marketing spend).
- **Deal structure:** Adrian gets a 7.5% revenue share on bookings made through this platform. Lawrence covers hosting costs, which Adrian bills him. Branding stays separate — Intercoutra is Lawrence's brand, not Adrian's. Arrangement is non-exclusive.

### Important boundary — do not cross-apply

Adrian runs several **separate, unrelated** projects. Never assume shared code, database, or conventions between them:

1. **This repo** (`intercoutra-site-v2`) — Intercoutra, client work for Lawrence. Covered by this document.
2. **AnchorDrive Tech (Pty) Ltd** — Adrian's own company entity, the one doing this client work.
3. **AnchorDrive (the SaaS product)** — a completely different, separate Next.js/TypeScript/Supabase monorepo Adrian owns himself (multi-tenant fleet dispatch, navy/teal branding, `apps/dispatch` + `apps/driver`). Different repo, different domain, different everything. If "AnchorDrive" comes up in conversation about this repo, clarify which one is meant.
4. **`anchordrive.co.za` domain** — Adrian's own separate brand, kept for his own future use, not part of this repo (though see the email sender quirk in §6 — it's currently used as a stopgap sender address for Intercoutra's transactional email).

---

## 2. The Big Change: Static HTML → Next.js (2026-08-12/13)

For most of this project's life (through 2026-08-08), the site was **static HTML/CSS/JS** with Supabase Edge Functions for backend logic, deployed to Vercel. It had a full transactional booking system: seat-holding, multi-vehicle daily schedule, payment confirmation, an admin dispatch dashboard (`admin.html`) for assigning drivers/vehicles to trips.

On 2026-08-13, following direction from Lawrence (relayed via a detailed brief), **the entire site was rebuilt from scratch as a Next.js 16 (App Router) + TypeScript application**, deliberately **dropping** the booking/seat-holding system and admin dispatch dashboard in favor of a simpler WhatsApp + enquiry-form lead-gen funnel, while **keeping** the SMS/email alert pipeline that already worked.

**Why:** Lawrence's brief argued the site's job is to generate qualified leads that convert into a WhatsApp sales conversation, not to run a full self-service booking/payment flow. Adrian agreed to this trade-off explicitly (see conversation history — "let's go with B but instead of the current booking and admin we do enquiry and whatsapp funnel, we can keep the sms and email").

**What this means practically:**
- The old `.html` pages (`index.html`, `book.html`, `admin.html`, `routes-schedules.html`, etc.) are **gone from the working tree** but fully recoverable from git history at commit `eeea4aa` (the last commit before the rebuild) if anyone ever needs to reference the old booking flow's logic.
- The old Supabase tables (`bookings`, `trip_instances`, `drivers`, `vehicles`, `booking_rate_limit`) are **orphaned** — no longer written to or read by the live site. They still exist in Supabase and contain historical data; nobody has been asked to drop them, so leave them alone unless told otherwise.
- A **new** Supabase table, `enquiries`, is the only thing the new site writes to.
- The **`create-enquiry` Supabase Edge Function is unchanged and reused as-is** — this is the one piece of backend logic that survived the rebuild intact. See §6.

---

## 3. Current Architecture

```
intercoutra-shuttle-site (GitHub repo, public)
├── .claude/                      — Claude Code project config (launch.json for dev server)
├── edge-functions/               — reference copies of Supabase Edge Function source
│   ├── create-enquiry/           — LIVE, used by the current site (see §6)
│   ├── create-booking/           — ORPHANED (old booking system, kept for reference only)
│   ├── create-enquiries-table.sql — schema for the new `enquiries` table (§5)
│   ├── create-booking-rate-limit-table.sql — ORPHANED
│   └── extend-trip-instances-*.sql — ORPHANED
└── intercoutra-site-v2/          — THE ACTUAL WEBSITE (Vercel project root)
    ├── app/                      — Next.js App Router pages + API routes
    ├── components/               — React components
    ├── lib/                      — shared logic (Supabase client, site data, analytics)
    ├── public/                   — static assets (images, favicons) — REAL photos, not stock
    ├── package.json, tsconfig.json, next.config.mjs, proxy.ts
    └── .env.local.example        — template for required env vars
```

**Stack:** Next.js 16.3.0 (App Router, Turbopack), TypeScript, React 18, `@supabase/supabase-js`. No CSS framework — hand-written `app/globals.css` using CSS variables for the brand palette (black `#121212`, red `#C31F26`, white). No UI component library. Deployed on Vercel, auto-deploys from `main`.

### Page routes

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, 4 service cards, Eswatini route "spotlight" section with a compact enquiry form, trust band |
| `/services/airport` | Airport Transfers landing page |
| `/services/eswatini` | Shared Shuttle to Eswatini — the most important conversion page, has real pricing |
| `/services/soweto` | Johannesburg/Soweto Tours |
| `/services/cape-town` | Cape Town Tours |
| `/about` | Company history |
| `/contact` | Full enquiry form + contact details |
| `/privacy`, `/terms` | Legal pages (rewritten for the enquiry-only model, no seat-hold/refund language) |
| `/admin/login` | Password-gated admin login |
| `/admin/enquiries` | Lead pipeline — list of enquiries with a status dropdown (new/contacted/quoted/booked/lost) |
| `/api/enquiries` (POST) | Public — receives enquiry form submissions |
| `/api/admin/login`, `/api/admin/logout` (POST) | Admin auth |
| `/api/admin/enquiries/[id]` (PATCH) | Update an enquiry's status |
| `/robots.txt`, `/sitemap.xml` | Generated via `app/robots.ts` / `app/sitemap.ts` (Next.js metadata routes) |

### Key files worth reading first in a fresh session

- **`lib/site.ts`** — every business fact used across the site: contact info, the 4 services (name/tagline/benefits/WhatsApp message/image path), and `ESWATINI_FARE` (the real, confirmed pricing). **Read this before touching any copy or pricing anywhere on the site.**
- **`lib/supabase.ts`** — server-only Supabase admin client (service role key). Never import this from a client component.
- **`app/api/enquiries/route.ts`** — the whole enquiry pipeline: validation, honeypot, rate-limiting, DB insert, then calls the Supabase `create-enquiry` Edge Function for the SMS/email alert.
- **`proxy.ts`** (repo root, `intercoutra-site-v2/proxy.ts`) — the admin auth gate. Next.js 16 renamed "middleware" to "proxy" — if you're used to `middleware.ts`, this is that file, renamed.
- **`components/EnquiryForm.tsx`** — the one enquiry-form component used everywhere (contact page, service pages, homepage spotlight). Has a `compact` prop for the shorter hero-embedded version and a `service` prop that locks/hides the service picker. **Don't duplicate this form's logic elsewhere — extend the props instead.**

Full source of the most load-bearing files is included in the Appendix at the bottom of this document, so this handover is self-contained even without repo access.

---

## 4. Design System

Brand: **black / white / red**, "Safe. Reliable. Comfortable." positioning. Premium-transport feel, not generic-taxi.

- Colors are CSS custom properties in `app/globals.css` (`--black`, `--red`, `--red-light`, `--red-dark`, `--white`, `--gray-bg`, `--ink`, `--muted`).
- Typography: Poppins (headings) + Inter (body), loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS vars `--font-poppins` / `--font-inter`.
- **No emojis anywhere** — every icon is a hand-drawn inline SVG (24×24-ish viewBox, `stroke="currentColor"`, `stroke-width="2"`, round caps), following a convention that predates this rebuild and was explicitly re-enforced during it (see `components/ComfortPackIcons.tsx` for the canonical example — the Water/Snacks/Wet Wipes/Wi-Fi icon set, shared between the homepage and the Eswatini page so they never drift apart visually).
- Checkmark lists (`.check-list` class) use a small red circle with a check glyph — not green (green was a mistake introduced then corrected during the rebuild).
- Only real photography — no AI-generated or stock images. All images live in `public/images/`, migrated from the old static site (`images/fleet/*.jpg` — real photos of the Mercedes-Benz Vito Tourer and BMW 320d/320i/M Sport, `images/routes/*.jpg` — real Cape Town/Durban/Sandton/Eswatini destination photos, `images/hero-fleet-jhb-skyline.png` — real photo of 3 fleet vehicles against the Johannesburg skyline, used as the homepage hero). **When new pages need images, reuse these — don't fetch stock photos.** Adrian has said he'll supply new/better photos later (e.g. dedicated tour photos for Soweto/Cape Town) — until then the tour pages reuse the JHB skyline and Cape Town coastline photos as reasonable stand-ins.
- License plates: historically blurred by default on public photos, with explicit per-image exceptions from Adrian. The current hero image (`hero-fleet-jhb-skyline.png`) is a known exception — plates are NOT blurred on it, by Adrian's explicit instruction.
- Mobile-first is taken seriously: most traffic is expected to come from ads on mobile. **A recurring real bug class during this rebuild was inline React `style={{ gridTemplateColumns: ... }}` overrides silently defeating the CSS media queries that stack columns on mobile** (inline styles always win over stylesheet rules, including ones inside `@media`). Two instances of this were found and fixed. If you add any grid/flex layout, verify at 375px width that `document.body.scrollWidth === document.body.clientWidth` (zero horizontal overflow) before calling it done — don't just eyeball desktop.

---

## 5. Supabase Setup

**Project URL:** `https://fqdxiwondspynpiplrjq.supabase.co` (same Supabase project as before the rebuild — not a new project).

### New table: `enquiries`

Schema lives at `edge-functions/create-enquiries-table.sql` (full contents in Appendix). Key facts:
- `service` is constrained to `airport | eswatini | soweto | cape-town`.
- `status` is constrained to `new | contacted | quoted | booked | lost` — this is the pipeline Lawrence's team works through via `/admin/enquiries`.
- RLS is enabled with **no public policies** — only the service-role key (used server-side in the Next.js API routes) can read or write. There is no anon-key access to this table, which is correct and intentional.
- **This migration has been run.** Confirmed 2026-08-13 — `enquiries` exists in the Supabase Table Editor (project `intercoutra-shuttle-site`, table list also includes the orphaned `clients`, `routes`, `booking_passengers`, and a `trip_seat_availability` view not mentioned elsewhere in this doc — same "orphaned, leave alone" rule applies to all of them).

### Existing table: `notification_recipients`

Not created by this rebuild — it already existed and is what `create-enquiry` reads to find out who gets the SMS/email alert (`select phone, email from notification_recipients where active = true`). If alerts aren't arriving, check this table has at least one active row with a real phone/email.

### Orphaned tables (leave alone, don't drop without asking)

`bookings`, `trip_instances`, `drivers`, `vehicles`, `booking_rate_limit`, `clients`, `routes`, `booking_passengers`, and the `trip_seat_availability` view — all from the old booking system. No longer read or written by the live site.

### Two separate sets of credentials — don't confuse them

This is the single easiest thing to get wrong, so it gets its own callout:

1. **Vercel environment variables** (for the Next.js app itself) — `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_TOKEN`, optionally `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID`. Set in Vercel → Project → Settings → Environment Variables. See `.env.local.example` for the full list with comments.
2. **Supabase Edge Function secrets** (for `create-enquiry`, which runs *inside* Supabase, not Vercel) — `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Supabase's own, set automatically), `SMSPORTAL_CLIENT_ID`, `SMSPORTAL_CLIENT_SECRET`, `RESEND_API_KEY`, `NOTIFICATION_FROM_EMAIL`. These were configured **before** this rebuild and were not touched by it — the Edge Function's source is unchanged. If SMS/email alerts aren't firing, check these secrets in the Supabase dashboard (Edge Functions → create-enquiry → Secrets), not Vercel.

---

## 6. The SMS/Email Alert Pipeline (unchanged, reused as-is)

Flow: visitor submits enquiry form → `POST /api/enquiries` (Next.js, runs on Vercel) validates + inserts into `enquiries` → same route then calls `POST {SUPABASE_URL}/functions/v1/create-enquiry` (Supabase Edge Function, unchanged from before the rebuild) → that function looks up `notification_recipients`, sends an SMS via **SMSPortal** and an email via **Resend** to every active recipient.

Full source of `create-enquiry` is in the Appendix. Notable details:
- It requires `name`, `phone`, and a **truthy `date`** field or it 400s. Since the new enquiry form's travel date is optional, the Next.js route passes `"Not specified"` as a fallback so the alert never silently fails to fire just because a visitor hasn't picked a date yet.
- SMS body is GSM-7-sanitized (smart quotes/dashes/ellipses converted to plain ASCII) — this was a solved problem from the old system, don't reintroduce non-GSM-7 characters into the SMS template.
- Email sender is currently `bookings@anchordrive.co.za` — a known, intentional stopgap (see §1 boundary note). Adrian's plan was to move to `bookings@intercoutrashuttles.co.za` once that domain existed. Status of that domain switch is unknown as of this handover — check before assuming either way.
- A failure in the alert call **must never** fail the enquiry response to the visitor — the enquiry is already safely in the database by that point, and the route wraps the alert call in its own try/catch, logging but swallowing errors.

### Status as of this handover: table created, still failing — see §10 for the live debugging session

The person maintaining this session (Claude) does **not** have the Supabase service role key, so this has been debugged via Adrian testing live and reporting back symptoms/screenshots, not by Claude testing directly. As of 2026-08-13:
- The `enquiries` table did not exist at all when this was first tested — that's now fixed (see §5).
- A test submission on `/contact` **still failed** after the table was created, showing "Something went wrong saving your enquiry. Please try WhatsApp instead." — the generic error the API route returns whenever `supabaseAdmin()` throws or the insert errors.
- Since the table now exists, the leading suspect is that the **Vercel env vars** (`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` in particular) are missing, wrong, or were added but the project hasn't been redeployed since. **This was not yet confirmed fixed as of this document being updated** — see §10 for the exact next steps handed to Adrian.

---

## 7. Analytics & SEO

- **GA4 and Meta Pixel** are both wired up in `components/Analytics.tsx` but fully optional — they only load `<Script>` tags if `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID` are set. Neither has been supplied yet, so analytics are currently inert.
- `lib/analytics.ts` exposes `trackEvent()` (fires both GA4 custom events and Meta Pixel `trackCustom`) and UTM capture (`captureUtmFromLocation`/`getStoredUtm`, backed by `localStorage`, wired up via `components/UtmCapture.tsx` in the root layout). Enquiry submissions attach any captured `utm_source/medium/campaign/content` automatically.
- Tracked events so far: `whatsapp_click` (nav, floating FAB, hero, per-service-card, bottom CTAs — all tagged with a `placement`), `enquiry_form_start`/`enquiry_form_submit`, `nav_book_click`-style CTA clicks. Extend `AnalyticsEvent` in `lib/analytics.ts` if you add new trackable actions.
- SEO: per-page `metadata` exports (title/description/OG/canonical) on every page, `app/robots.ts` and `app/sitemap.ts` as native Next.js metadata routes (no `next-sitemap` package needed). **The URL structure changed completely** from the old `.html` pages — Google Search Console will have stale/broken indexed URLs from the old site and should be re-verified/re-submitted with the new sitemap once things are confirmed stable.

---

## 8. Outstanding / Not Yet Done — Read This Before Doing Anything Else

In rough priority order:

1. ~~Get the enquiry → Supabase → SMS/email → admin pipeline actually working on production~~ — **Done, 2026-08-14.** Root cause was two-fold: the `enquiries` table didn't exist yet, and Vercel had zero environment variables configured at all. Both fixed, confirmed working end-to-end. Full story in §10.
2. ~~Confirm the `enquiries` table migration was actually run~~ — **Done, 2026-08-13.** Table exists, confirmed in Supabase Table Editor.
3. ~~Confirm all Vercel env vars are set~~ — **Done, 2026-08-14.** All 5 required vars added, redeployed, confirmed working. Also separately resolved: the Framework Preset 404 issue from just after the rebuild (§10, Issue A).
4. **Google Search Console** — needs re-verification/re-submission of the new sitemap, since every URL on the site changed shape.
5. **Real tour photography** for Soweto and Cape Town — currently reusing the JHB skyline and Cape Town coastline photos as placeholders. Swap in real, dedicated tour photos when Adrian/Lawrence supply them.
6. **GA4 / Meta Pixel IDs** — not supplied yet. Analytics code is ready and waiting for `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID`.
7. **Real testimonials** — long-standing item from before the rebuild too. Adrian has said he can't get real customer quotes yet. **Do not fabricate testimonials, review counts, or "trusted by X" claims** — this is a hard rule that's been re-stated multiple times across this project's history.
8. **Nav length** — flagged as a discussion point, not acted on: the nav has 7 items (Home + 4 services + About + Contact) plus a WhatsApp button, which is tight but not yet overflowing. Consider consolidating the 4 service links under a "Services" dropdown if it ever starts wrapping.
9. **`bookings@anchordrive.co.za` sender address** — confirm whether Adrian ever moved to a proper `@intercoutrashuttles.co.za` (or similar) address for the `create-enquiry` alert emails. If it's still `anchordrive.co.za` months from now, that's worth flagging again (it wasn't meant to be permanent).
10. **Old orphaned Supabase tables and Edge Functions** (`bookings`, `trip_instances`, `create-booking`, etc.) — nobody has asked for these to be cleaned up. Leave them unless explicitly told to remove them; don't assume they're safe to drop just because they're unused.

---

## 9. Working Conventions (carried over from before the rebuild, still apply)

- **No emoji anywhere** — inline SVG icons only. See §4.
- **Real photos only**, no AI/stock imagery.
- **Fabricate nothing** on business facts (pricing, schedule, stats, testimonials, contact details) — always verify or ask rather than infer. This project has been burned by this before (self-contradictory reference screenshots that would have published wrong info if not caught).
- **Fare formatting:** `R850`, not `R850.00` — whole rands, no decimals, site-wide.
- **Commit locally after testing, then explicitly ask before pushing to live.** Adrian has consistently said yes for tested changes, but wants to be asked — especially for structural changes. Never auto-push.
- **Communication style:** Adrian is direct, no fluff, corrects fast when something's off. Don't over-explain basics; do the work, flag genuine open questions.
- **Visually verify before calling something done** — use the browser preview tools, check for console errors and horizontal overflow, don't ship on faith that CSS "should" work.

---

## 10. Live Debugging Log — Post-Deploy Issues (2026-08-13)

Two real production issues came up right after go-live. Both are documented here in full so nobody re-diagnoses them from scratch. **Read this whole section before touching Vercel or Supabase settings for this project.**

### Issue A: production showed a 404 on every page — RESOLVED

**Symptom:** immediately after the first Next.js deploy, both the custom domain and the deployment's own `*.vercel.app` URL returned 404 on `/`.

**Root cause:** the Vercel project's **Framework Preset** was still set to **"Other"**, left over from when this was a static HTML site (pre-2026-08-13). With that preset, Vercel doesn't run the app as a Next.js server — it doesn't know to apply Next.js's routing/build conventions, so requests to `/` (and everything else) had nothing to resolve to.

**Fix applied:**
1. Vercel → Project Settings → Build and Deployment → Framework Settings → change **Framework Preset** from "Other" to **"Next.js"**.
2. Leave all the Override toggles (Build Command / Output Directory / Install Command / Development Command) **off** — Next.js's own defaults are correct once the preset is right.
3. Save.
4. Deployments tab → open the latest deployment → **⋯ menu → Redeploy** (changing the framework setting alone does not rebuild the existing deployment — a fresh deploy is required).

Confirmed working after this — site loads correctly on both the custom domain and the Vercel URL. **Root Directory was already correctly set to `intercoutra-site-v2` throughout — that was never the problem, only Framework Preset was wrong.**

### Issue B: enquiry form fails to save — RESOLVED

**Symptom:** submitting the enquiry form (tested on `/contact`) showed the red error "Something went wrong saving your enquiry. Please try WhatsApp instead." — the generic error `app/api/enquiries/route.ts` returns whenever either `supabaseAdmin()` throws (missing/bad `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` env vars) or the Supabase insert itself errors.

**Diagnosis:**
1. Checked the Supabase Table Editor — confirmed the `enquiries` table **did not exist yet**. Fixed by running `edge-functions/create-enquiries-table.sql` in the Supabase SQL Editor.
2. Re-tested — **still failed** with the same generic error.
3. Checked Vercel → Project → Settings → Environment Variables — **zero environment variables were configured at all.** This was the actual root cause: the app had no way to reach Supabase.

**Fix applied:** added all 5 required env vars in Vercel (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_TOKEN` — via the "paste .env contents into the Key field" shortcut in Vercel's Add Environment Variable dialog, which auto-splits a pasted block into separate rows), applied to Production and Preview, then redeployed.

**Confirmed working end-to-end 2026-08-14** — enquiry submission succeeds, row appears in `enquiries`, and (per Adrian) the full pipeline is functioning. This closes out what was previously the top-priority outstanding item.

---

## Appendix: Key Source Files (full contents, for a session without repo access)

### `intercoutra-site-v2/lib/site.ts`

```typescript
// Central place for brand facts that appear across multiple pages, so a
// phone number or fare only ever needs to change in one place.

export const SITE_URL = "https://www.intercoutra.co.za";

export const CONTACT = {
  phonePrimary: "+27 74 351 8384",
  phoneSecondary: "+27 66 286 9427",
  whatsappNumber: "27743518384", // no leading +, wa.me format
  email: "bookings@intercoutra.co.za",
  location: "South Africa",
};

export type ServiceSlug = "airport" | "eswatini" | "soweto" | "cape-town";

export interface ServiceInfo {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  benefits: string[];
  image: string;
  imageAlt: string;
  whatsappMessage: string;
  ctaLabel: string;
}

export const SERVICES: Record<ServiceSlug, ServiceInfo> = {
  airport: {
    slug: "airport",
    name: "Airport Transfers",
    shortName: "Airport Transfers",
    tagline:
      "Reliable, comfortable and professional airport transfers from four major airports across South Africa.",
    description:
      "Door-to-door transfers to and from Cape Town International, O.R. Tambo, Lanseria and King Shaka International airports.",
    benefits: [
      "Flight monitoring",
      "Meet & greet available",
      "Transparent pricing",
      "24/7 availability",
      "Professional drivers",
      "Comfortable vehicles",
    ],
    image: "/images/fleet/vito-1.jpg",
    imageAlt: "Intercoutra Mercedes-Benz Vito Tourer used for airport transfers",
    whatsappMessage: "Hi Intercoutra, I'd like to enquire about an airport transfer.",
    ctaLabel: "Get a Quote",
  },
  eswatini: {
    slug: "eswatini",
    name: "Shared Shuttle to Eswatini",
    shortName: "Eswatini Shuttle",
    tagline: "Sandton / O.R. Tambo to Mbabane & Manzini and back.",
    description:
      "Our daily shared shuttle between Johannesburg and Eswatini, with fixed pick-up points and a Comfort Pack on every seat.",
    benefits: [
      "Comfort Pack included (water, snacks, wet wipes)",
      "Free Wi-Fi onboard",
      "Daily departures",
      "Professional drivers",
    ],
    image: "/images/fleet/vito-2.jpg",
    imageAlt: "Intercoutra Mercedes-Benz Vito Tourer used on the Eswatini shuttle route",
    whatsappMessage: "Hi Intercoutra, I'd like to enquire about the shared shuttle to Eswatini.",
    ctaLabel: "Enquire Now",
  },
  soweto: {
    slug: "soweto",
    name: "Johannesburg / Soweto Tours",
    shortName: "JHB & Soweto Tours",
    tagline: "Explore the rich history, culture and heritage of Johannesburg and Soweto.",
    description:
      "Guided tours across Johannesburg and Soweto, including the Apartheid Museum and other iconic landmarks.",
    benefits: [
      "Apartheid Museum",
      "Soweto township tour",
      "Local markets",
      "Iconic landmarks",
      "Professional guides",
      "Flexible tour options",
    ],
    image: "/images/hero-fleet-jhb-skyline.png",
    imageAlt: "Johannesburg skyline",
    whatsappMessage: "Hi Intercoutra, I'd like to enquire about a Johannesburg/Soweto tour.",
    ctaLabel: "Plan My Tour",
  },
  "cape-town": {
    slug: "cape-town",
    name: "Cape Town Tours",
    shortName: "Cape Town Tours",
    tagline: "Experience the Mother City with professional, comfortable and guided tours.",
    description:
      "Guided tours across Cape Town and the Peninsula, from Table Mountain to the Winelands.",
    benefits: [
      "Table Mountain",
      "V&A Waterfront",
      "Cape Peninsula",
      "Winelands",
      "Scenic routes",
      "Experienced guides",
      "Custom tour options",
    ],
    image: "/images/routes/cape-town.jpg",
    imageAlt: "Cape Town coastline",
    whatsappMessage: "Hi Intercoutra, I'd like to enquire about a Cape Town tour.",
    ctaLabel: "Plan My Tour",
  },
};

export const SERVICE_LIST = Object.values(SERVICES);

// Note: these are the confirmed, real fares live in the booking backend
// (tested via real bookings) - R850 one-way, R750 return leg, R1,600 total
// return, saving R100 vs two one-way fares. Do not change without
// confirming with Adrian/Lawrence first.
export const ESWATINI_FARE = {
  oneWay: 850,
  returnLeg: 750,
  returnTotal: 1600,
  savings: 100,
};
```

### `intercoutra-site-v2/lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

// Server-side client using the service role key - only ever import this
// from server components, API routes, or server actions. Never expose the
// service role key to the browser.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
```

### `intercoutra-site-v2/app/api/enquiries/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SERVICE_LABELS: Record<string, string> = {
  airport: "Airport Transfer",
  eswatini: "Eswatini Shuttle",
  soweto: "JHB/Soweto Tour",
  "cape-town": "Cape Town Tour",
};
const VALID_SERVICES = new Set(Object.keys(SERVICE_LABELS));
const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_MAX_PER_PHONE = 3;
const RATE_LIMIT_MAX_PER_IP = 8;

interface EnquiryPayload {
  name?: string;
  phone?: string;
  email?: string | null;
  service?: string;
  travel_date?: string | null;
  passengers?: number;
  message?: string | null;
  source?: string;
  website?: string; // honeypot - real visitors never fill this in
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: EnquiryPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot, not a real visitor. Return
  // a fake success so the bot doesn't learn to adapt, but do nothing.
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const name = (body.name || "").trim().slice(0, 200);
  const phone = (body.phone || "").trim().slice(0, 40);
  const email = body.email ? body.email.trim().slice(0, 200) : null;
  const service = (body.service || "").trim();
  const travelDate = body.travel_date || null;
  const passengers = Number.isFinite(body.passengers) ? Math.max(1, Math.min(50, Number(body.passengers))) : 1;
  const message = body.message ? body.message.trim().slice(0, 2000) : null;
  const source = (body.source || "website").slice(0, 100);

  // Server-side validation - never trust the client alone.
  if (!name) return NextResponse.json({ success: false, error: "Please enter your full name." }, { status: 400 });
  if (!phone || !phone.startsWith("+")) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid phone number including country code." },
      { status: 400 }
    );
  }
  if (!VALID_SERVICES.has(service)) {
    return NextResponse.json({ success: false, error: "Please choose a valid service." }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  let supabase: ReturnType<typeof supabaseAdmin>;
  try {
    supabase = supabaseAdmin();
  } catch (err) {
    console.error("Supabase not configured:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong saving your enquiry. Please try WhatsApp instead." },
      { status: 500 }
    );
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

  try {
    const [{ count: phoneCount }, { count: ipCount }] = await Promise.all([
      supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("phone", phone)
        .gte("created_at", windowStart),
      supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("source_ip", ip)
        .gte("created_at", windowStart),
    ]);

    if ((phoneCount || 0) >= RATE_LIMIT_MAX_PER_PHONE || (ipCount || 0) >= RATE_LIMIT_MAX_PER_IP) {
      return NextResponse.json(
        { success: false, error: "Too many enquiries submitted recently. Please try WhatsApp instead." },
        { status: 429 }
      );
    }
  } catch {
    // If the rate-limit check itself fails, don't block a real enquiry over it.
  }

  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      name,
      phone,
      email,
      service,
      travel_date: travelDate,
      passengers,
      message,
      status: "new",
      source,
      source_ip: ip,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_content: body.utm_content || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to insert enquiry:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong saving your enquiry. Please try WhatsApp instead." },
      { status: 500 }
    );
  }

  // Alert dispatch by SMS + email using the existing, already-deployed
  // Supabase Edge Function (create-enquiry) - reused as-is rather than
  // duplicating SMS/email logic here. A failure here must not fail the
  // enquiry itself, since it's already saved.
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseAnonKey) {
    try {
      await fetch(`${supabaseUrl}/functions/v1/create-enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseAnonKey}` },
        body: JSON.stringify({
          name,
          phone,
          email,
          route: SERVICE_LABELS[service] || service,
          // create-enquiry requires a truthy `date` field to send its
          // alert - our travel_date is optional on this form, so fall
          // back to a placeholder rather than silently losing the SMS/
          // email notification when a visitor hasn't picked a date yet.
          date: travelDate || "Not specified",
          passengers: String(passengers),
          message,
        }),
      });
    } catch (err) {
      console.error("Failed to trigger create-enquiry alert:", err);
    }
  }

  return NextResponse.json({ success: true, id: data?.id });
}
```

### `intercoutra-site-v2/proxy.ts` (admin auth gate)

```typescript
import { NextRequest, NextResponse } from "next/server";

// Simple shared-password gate for /admin - no per-user accounts, matching
// the MVP scope. ADMIN_SESSION_TOKEN is a long random secret set once in
// Vercel env vars; the login route only ever sets this exact value as the
// session cookie after checking ADMIN_PASSWORD, so a valid cookie proves
// the visitor went through login.
const COOKIE_NAME = "intercoutra_admin_session";
const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login"]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const expected = process.env.ADMIN_SESSION_TOKEN;
  const authorized = Boolean(expected) && token === expected;

  if (!authorized) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

### `edge-functions/create-enquiries-table.sql`

```sql
-- Enquiries table for the Next.js lead-gen site (intercoutra-site-v2).
-- Replaces the old bookings/trip_instances seat-holding system for the
-- new site - this just persists WhatsApp/enquiry-form leads for the team
-- to work through a simple status pipeline (new -> contacted -> quoted ->
-- booked/lost). SMS + email alerts still go out via the existing
-- create-enquiry Edge Function, called from the Next.js API route.
--
-- Run this once in the Supabase SQL editor.

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service text not null check (service in ('airport', 'eswatini', 'soweto', 'cape-town')),
  travel_date date,
  passengers integer not null default 1,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'booked', 'lost')),
  source text not null default 'website',
  source_ip text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  created_at timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on enquiries (created_at desc);
create index if not exists enquiries_status_idx on enquiries (status);
create index if not exists enquiries_phone_idx on enquiries (phone);

-- RLS enabled, no public policies - only the service role key (used
-- server-side in the Next.js API route and admin page) can read/write.
alter table enquiries enable row level security;
```

### `edge-functions/create-enquiry/index.ts` (Supabase Edge Function — unchanged by the rebuild, deployed separately in the Supabase dashboard, NOT part of the Next.js build)

```javascript
// create-enquiry
// Handles contact-page "send us your request" enquiries. Unlike
// create-booking, this does NOT write to bookings/trip_instances -
// there's no seat held, no fare charged, no trip_instance_id (the
// contact page only has a free-text route/date, not a real departure
// selection). Its only job is to alert dispatch immediately by SMS
// and email so a human can follow up on WhatsApp or email, mirroring
// create-booking's notification step.

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Same GSM-7 constraint as create-booking - see that function for the
// full explanation. Only applied to the SMS body.
function toGsm7Safe(text) {
  return text
    .replace(/[→➜➔]/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[''']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/…/g, "...");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, phone, email, route, date, passengers, message } = body;

    if (!name || !phone || !date) {
      return new Response(JSON.stringify({ success: false, error: "Missing required fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const { data: recipients } = await supabase
      .from("notification_recipients")
      .select("phone, email")
      .eq("active", true);

    const enquiryRef = "ICE-" + Math.floor(1000 + Math.random() * 9000);
    const dispatchWaLink = `wa.me/${phone.replace(/[^0-9]/g, "")}`;

    const smsBody = toGsm7Safe(
      `${enquiryRef} ENQUIRY: ${name}, ${route || "route TBC"}, ${date}, ${passengers || 1}pax. ${dispatchWaLink}`
    );

    // -- SMS via SMSPortal --
    const smsportalClientId = Deno.env.get("SMSPORTAL_CLIENT_ID");
    const smsportalSecret = Deno.env.get("SMSPORTAL_CLIENT_SECRET");
    if (smsportalClientId && smsportalSecret && recipients) {
      const smsRecipients = recipients.filter((r) => r.phone);
      if (smsRecipients.length > 0) {
        const authResponse = await fetch("https://rest.smsportal.com/Authentication", {
          method: "POST",
          headers: { "Authorization": "Basic " + btoa(`${smsportalClientId}:${smsportalSecret}`) },
        });
        if (!authResponse.ok) {
          console.error("SMSPortal auth failed:", authResponse.status, await authResponse.text());
        } else {
          const { token, schema } = await authResponse.json();
          const smsResponse = await fetch("https://rest.smsportal.com/v3/BulkMessages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${schema} ${token}`,
            },
            body: JSON.stringify({
              messages: smsRecipients.map((r) => ({
                destination: r.phone.startsWith("+") ? r.phone : `+${r.phone}`,
                content: smsBody,
              })),
            }),
          });
          if (!smsResponse.ok) {
            console.error("SMSPortal rejected the request:", smsResponse.status, await smsResponse.text());
          } else {
            console.log("SMSPortal accepted the request:", await smsResponse.text());
          }
        }
      }
    } else {
      console.log("SMSPortal not attempted - missing credentials or no active recipients.", {
        hasId: !!smsportalClientId, hasSecret: !!smsportalSecret, recipientCount: recipients?.length ?? 0,
      });
    }

    // -- Email via Resend --
    // Internal-only, same as create-booking's philosophy: client-facing
    // auto-confirmation is a later phase. The team replies to the
    // client by WhatsApp or email themselves once they see this.
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromAddress = Deno.env.get("NOTIFICATION_FROM_EMAIL") || "Intercoutra Shuttle Services <bookings@anchordrive.co.za>";
    if (resendKey) {
      const internalEmails = (recipients || []).filter((r) => r.email).map((r) => r.email);
      if (internalEmails.length > 0) {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: internalEmails,
            subject: `Website enquiry ${enquiryRef} - ${route || "route TBC"}`,
            html: `
              <p>Enquiry reference: <strong>${enquiryRef}</strong></p>
              <p>Name: ${name}</p>
              <p>Phone: ${phone}</p>
              ${email ? `<p>Email: ${email}</p>` : ""}
              <p>Route: ${route || "not specified"}</p>
              <p>Date: ${date}</p>
              <p>Passengers: ${passengers || 1}</p>
              ${message ? `<p>Message: ${message}</p>` : ""}
              <p><a href="https://${dispatchWaLink}">Message ${name} on WhatsApp →</a></p>
            `,
          }),
        });
        if (!emailResponse.ok) {
          console.error("Resend rejected the request:", emailResponse.status, await emailResponse.text());
        } else {
          console.log("Resend accepted the request:", await emailResponse.text());
        }
      }
    } else {
      console.log("Resend not attempted - missing RESEND_API_KEY.");
    }

    return new Response(JSON.stringify({ success: true, enquiry_ref: enquiryRef }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
```

### `intercoutra-site-v2/package.json`

```json
{
  "name": "intercoutra-web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.4",
    "next": "16.3.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.4"
  }
}
```

### `intercoutra-site-v2/.env.local.example`

```
# Copy this file to .env.local for local development and fill in real values.
# In production, set these in the Vercel project's Environment Variables.

# Supabase (from Project Settings -> API in the Supabase dashboard)
SUPABASE_URL=https://fqdxiwondspynpiplrjq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
# Anon/public key - used server-side only, to call the existing create-enquiry
# Edge Function that sends SMS + email alerts.
SUPABASE_ANON_KEY=

# Admin (/admin) login - shared password gate, no per-user accounts.
# ADMIN_SESSION_TOKEN should be a long random string (e.g. `openssl rand -hex 32`).
ADMIN_PASSWORD=
ADMIN_SESSION_TOKEN=

# Optional - analytics only load when these are set.
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

---

*End of handover document. If something in here turns out to be stale by the time you're reading it, trust the live code and Supabase dashboard over this document, and please update this file rather than just working around the discrepancy silently.*
