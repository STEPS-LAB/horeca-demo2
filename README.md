# LUMINA Hotel — Production-Grade Demo Site

> A fully-featured, multilingual, CRM-driven luxury hotel platform built for **STEPS LAB** — showcasing modern Next.js architecture, real-time bookings, i18n routing, and admin intelligence.

**Live Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Prisma 7 · PostgreSQL · jose JWT

---

## Features

### Guest-Facing
- **Multilingual (EN / UA)** — `/en` and `/ua` routing via Next.js middleware; language switcher in header; cookie-persisted preference; SEO-friendly `hreflang` alternates
- **Instant Room Filtering** — type, price range, guest count, features, sort — all client-side with zero reload
- **Real-Time Booking Flow** — stay details → payment → confirmation; simulated 1 800 ms payment processing; `LMN-{timestamp}` reference generation
- **Live Pricing Engine** — subtotal, cleaning fee ($35), tax (12%), per-night breakdown with tooltips
- **Accessibility** — ARIA labels, keyboard focus trap in modals, `aria-expanded`, skip-to-content link
- **Performance** — Server Components + dynamic imports for heavy sections; Skeleton loaders; Framer Motion with reduced-motion support; Next.js Image optimisation (AVIF/WebP)
- **Mobile-First** — responsive header with animated drawer, collapsible filter sidebar

### Admin CRM (`/admin`)
- **Dashboard** — revenue, room count, booking KPIs, recent bookings table
- **Room Management** — list all rooms, search, activate/deactivate; extensible with full CRUD
- **Booking Intelligence** — filter by status (CONFIRMED / PENDING / CANCELLED), search by guest / email / reference
- **Pricing & Promotions** — create percentage, fixed, or date-range promotions; apply to specific rooms
- **JWT Session Auth** — `jose`-signed cookies, 8-hour expiry, middleware-protected routes
- **Demo mode** — works without a database using static data and hardcoded credentials

---

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local (see Environment Variables below)

# 3. Database (optional — skip for demo mode)
npx prisma migrate dev --name init
npm run db:seed

# 4. Develop
npm run dev
```

> **Demo mode (no DB needed):** Simply skip Step 3. The app uses static room data and demo admin credentials.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Optional | PostgreSQL connection string. If omitted, app runs in demo mode |
| `JWT_SECRET` | Recommended | Secret for admin session signing. Defaults to an insecure placeholder |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical site URL for SEO |
| `VERCEL_TOKEN` | CI only | Vercel deployment token |
| `VERCEL_ORG_ID` | CI only | Vercel organisation ID |
| `VERCEL_PROJECT_ID` | CI only | Vercel project ID |

Copy `.env.example` → `.env.local` and fill in your values.

---

## Database Setup

Requires PostgreSQL 14+.

```bash
# Push schema to DB (no migration history)
npm run db:push

# OR use migrations (recommended for production)
npm run db:migrate

# Seed with demo rooms, admin user, and sample promotion
npm run db:seed

# Open Prisma Studio (visual DB browser)
npm run db:studio
```

### Prisma Schema

| Model | Description |
|---|---|
| `Room` | Hotel rooms with bilingual names/descriptions, pricing, amenities |
| `Booking` | Guest reservations with status tracking |
| `Promotion` | Percentage/fixed/date-range discounts |
| `BlockedDate` | Maintenance/event date blocks per room |
| `User` | Admin/Manager accounts with bcrypt passwords |

---

## Admin Panel

| URL | Description |
|---|---|
| `/admin/login` | Sign in page |
| `/admin` | Dashboard (KPIs, recent bookings) |
| `/admin/rooms` | Room catalogue management |
| `/admin/bookings` | Booking list with status filter |
| `/admin/pricing` | Promotions management |

**Demo credentials** (no DB required):
```
Email:    admin@luminahotel.ua
Password: lumina-admin-2025
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript strict check |
| `npm test` | Jest (41 tests across 5 suites) |
| `npm run test:coverage` | Coverage report |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

---

## Architecture

```
app/
  [locale]/          # EN + UA locale pages (SSG via generateStaticParams)
    layout.tsx       # I18nProvider + Header + Footer
    page.tsx         # Home
    rooms/           # Filterable catalogue
    booking/         # 3-step booking flow
    contact/         # Contact form
  admin/             # CRM panel (auth-protected by middleware)
    login/
    rooms/
    bookings/
    pricing/
  api/               # Route handlers
    admin/auth/      # POST login, DELETE logout, GET session
    rooms/           # GET list, POST create
    bookings/        # GET list (admin), POST create
    promotions/      # GET list, POST create

components/
  ui/                # Button, Modal, Input, Badge, Tooltip, Skeleton
  layout/            # Header (i18n-aware), Footer, LanguageSwitcher, LocaleLang
  sections/          # Hero, Features, Testimonials, Gallery
  rooms/             # RoomCard, RoomModal, RoomFilters
  booking/           # BookingForm, BookingModal, BookingConfirmation
  admin/             # AdminSidebar, AdminDashboard, AdminRoomsClient, …

i18n/
  config.ts          # Locale list + helpers
  dictionaries/      # en.ts + ua.ts (full translations)
  get-dictionary.ts  # Async dictionary loader
  context.tsx        # I18nProvider + useTranslations hook

lib/
  prisma.ts          # Singleton Prisma client (pg adapter, dev HMR safe)
  auth.ts            # JWT sign/verify, cookie helpers (jose)
  services/          # rooms, bookings, promotions, availability

middleware.ts        # i18n redirect + admin auth guard
```

---

## i18n Routing

| URL | Locale |
|---|---|
| `/` | Redirects to `/en` or `/ua` (cookie / Accept-Language) |
| `/en` | English home page |
| `/ua` | Ukrainian home page |
| `/en/rooms` | English room catalogue |
| `/ua/booking` | Ukrainian booking flow |

Language preference is stored in the `lumina_locale` cookie (1 year TTL).

---

## Testing

```bash
npm test               # all 41 tests
npm run test:coverage  # with coverage report
```

**Test suites:**
- `utils.test.ts` — pricing, validation utilities
- `RoomCard.test.tsx` — rendering, callbacks, accessibility
- `BookingForm.test.tsx` — field updates, validation, price summary
- `Navigation.test.tsx` — Header rendering, mobile menu, locale links
- `ContactForm.test.tsx` — submission, email validation, success state

---

## Deployment

### Vercel (recommended)

1. Import the repo to Vercel
2. Set environment variables in Vercel dashboard
3. Run `npm run db:migrate && npm run db:seed` from CLI against production DB

### GitHub Actions CI/CD

The workflow (`.github/workflows/main.yml`) runs on every push:
1. **Quality** — lint + type-check + tests
2. **Build** — Next.js production build
3. **Deploy** — Vercel deployment on `main` branch (requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets)

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-gold-500` | `#c9a96e` | Primary accent |
| `--color-stone-25` | `#fdfcfb` | Page background |
| `--shadow-card` | custom | Room cards |
| `--ease-spring` | cubic-bezier | Spring animations |

---

## Credits

- **Unsplash** — Photography
- **Framer Motion** — Animations
- **Lucide React** — Icons
- **Tailwind CSS v4** — Styling
- **Prisma** — Database ORM

Built by STEPS LAB · [LUMINA Hotel Demo](https://github.com)
