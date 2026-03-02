# LUMINA Hotel — Premium Demo Site

> A fully-featured, production-grade luxury hotel website demo built for **STEPS LAB** — showcasing technological advantage through speed, advanced UX, and best engineering practices.

**Live Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide React

---

## Features

### Functional
- **Booking System** — room selection, date picker, real-time price calculation, payment simulation, animated confirmation flow
- **Room Catalogue** — 6 room types with image galleries, descriptions, amenities, and instant filtering
- **Advanced Filters** — type, price range, guest count, features, and sort — all with real-time animated response
- **Contact Form** — inline validation, animated success/error states, accessible and keyboard-navigable
- **Sticky Navigation** — transparent on hero, solid on scroll, mobile-first collapsible menu
- **Room Detail Modals** — animated open/close with Framer Motion, image gallery, focus trapping
- **Booking Modal** — multi-step (details → payment → confirmation) with animated transitions

### Technical
- Next.js 15 App Router with Server Components + Client Components separation
- React 19 with optimised re-render strategy (useMemo, useCallback throughout)
- Tailwind CSS v4 with CSS-first configuration and custom design tokens
- Framer Motion — scroll parallax, viewport-triggered animations, AnimatePresence, spring physics
- Dynamic imports for large sections (lazy loading below the fold)
- Next.js `<Image>` with automatic WebP/AVIF conversion and lazy loading
- Full TypeScript strict mode — no `any` types
- Accessible: ARIA labels, keyboard navigation, focus trapping, `prefers-reduced-motion` safe

### Design
- Warm, neutral luxury palette with gold accents
- Inter variable font (Google Fonts, `display: swap`)
- Mobile-first responsive grid (320px → 1920px)
- Custom CSS design tokens via `@theme` (Tailwind v4)

---

## Project Structure

```
demo-site/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, metadata)
│   ├── globals.css             # Tailwind v4 import + @theme tokens
│   ├── page.tsx                # Home page (Server Component)
│   ├── FeaturedRooms.tsx       # Home featured rooms (Client Component)
│   ├── rooms/
│   │   ├── page.tsx            # Rooms page
│   │   └── RoomsClient.tsx     # Filtered room grid (Client Component)
│   ├── booking/
│   │   ├── page.tsx            # Booking page
│   │   └── BookingPageClient.tsx
│   └── contact/
│       ├── page.tsx            # Contact page
│       └── ContactClient.tsx
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx          # Animated button with variants
│   │   ├── Modal.tsx           # Focus-trapped animated modal
│   │   ├── Input.tsx           # Input, Textarea, Select with validation UI
│   │   ├── Badge.tsx           # Status/type badge
│   │   └── Tooltip.tsx         # Hover/focus tooltip with placement
│   ├── layout/
│   │   ├── Header.tsx          # Sticky, scroll-aware, mobile-first header
│   │   └── Footer.tsx          # Full footer with CTA banner
│   ├── sections/
│   │   ├── Hero.tsx            # Parallax hero with booking CTA
│   │   ├── Features.tsx        # Hotel amenities grid
│   │   ├── Testimonials.tsx    # Animated testimonial slider
│   │   └── Gallery.tsx         # Mosaic image gallery
│   ├── rooms/
│   │   ├── RoomCard.tsx        # Room card with image carousel
│   │   ├── RoomModal.tsx       # Full room detail modal
│   │   └── RoomFilters.tsx     # Sidebar filter panel
│   └── booking/
│       ├── BookingForm.tsx     # Multi-field booking form
│       ├── BookingModal.tsx    # Step-based booking modal
│       └── BookingConfirmation.tsx
│
├── hooks/
│   ├── useBooking.ts           # Booking state machine
│   ├── useRoomFilter.ts        # Room filtering + sorting
│   └── useModal.ts             # Modal open/close + Escape + scroll lock
│
├── utils/
│   ├── cn.ts                   # clsx + tailwind-merge
│   ├── pricing.ts              # Price calculations + formatting
│   └── validation.ts           # Form validation helpers
│
├── data/
│   └── rooms.ts                # 6 rooms + 4 testimonials (demo data)
│
├── types/
│   └── index.ts                # All TypeScript interfaces
│
├── __tests__/
│   ├── utils.test.ts
│   ├── RoomCard.test.tsx
│   ├── BookingForm.test.tsx
│   ├── Navigation.test.tsx
│   └── ContactForm.test.tsx
│
└── .github/
    └── workflows/
        └── main.yml            # CI: lint → type-check → test → build → deploy
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20.x
- npm ≥ 10.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/demo-site.git
cd demo-site

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run type-check` | TypeScript type check |
| `npm test` | Run all tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Tests with coverage report |

---

## Testing

Tests use **Jest** + **@testing-library/react**.

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

Test suites cover:
- Pricing utilities (calculateNights, formatCurrency, etc.)
- Validation utilities (booking form, contact form)
- RoomCard rendering + interactions
- BookingForm fields and validation display
- Header navigation and mobile menu
- ContactForm submission and success state

---

## Deployment (Vercel)

### Manual deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Automatic deployment via GitHub Actions

The included workflow (`.github/workflows/main.yml`) automatically:

1. Lints, type-checks, and runs tests on every push/PR
2. Builds the application
3. Deploys to Vercel on merge to `main`

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Your Vercel API token |
| `VERCEL_ORG_ID` | Your Vercel team/org ID |
| `VERCEL_PROJECT_ID` | Your Vercel project ID |

To find your IDs, run `vercel link` in the project root after installing the CLI.

---

## Performance Notes

- **PageSpeed target:** 90+ mobile & desktop
- Images served as WebP/AVIF via Next.js Image Optimization
- Below-fold sections loaded via `dynamic()` imports
- Framer Motion animations use only `transform` and `opacity` — no layout thrash
- Tailwind v4 tree-shakes unused CSS automatically
- `optimizePackageImports` configured for `lucide-react` and `framer-motion`

---

## Design Tokens

Custom tokens defined in `app/globals.css` via `@theme`:

| Token | Value | Usage |
|---|---|---|
| `--color-gold-500` | `#c9a96e` | Primary accent |
| `--color-stone-25` | `#fdfcfb` | Page background |
| `--shadow-card` | `...` | Card shadows |
| `--shadow-modal` | `...` | Modal shadow |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Spring animations |

---

## Credits

Built by **STEPS LAB** as a premium hotel website demo.
Inspired by [shelest.ua](https://shelest.ua/) — a beautiful Ukrainian eco-hotel.
Photography courtesy of [Unsplash](https://unsplash.com/).

---

*© 2026 STEPS LAB. Demo project — not a real hotel.*
