# Project Map: Acepta Bitcoin México (Oracle System v2.0)

A comprehensive overview of the `aceptabitcoin-org` project structure, architecture, and current status.

## 🏗️ Project Architecture

```
aceptabitcoin-org/
├── app/                             # Next.js 14 App Router
│   ├── (site)/                      # Main website route group (public-facing pages)
│   │   ├── page.tsx                 # Homepage — Oracle v2.0 w/ Hero, PriceConverter,
│   │   │                            #   MarketMoodWidget, Aprende, Tianguis cards, TipJar
│   │   ├── mapa/                    # BTC Merchant Map (standalone, Leaflet + BTC Map API)
│   │   │   └── page.tsx             #   → BtcMapSection
│   │   ├── arcade/                  # Bitcoin learning hub — Visionary AI arcade
│   │   │   └── page.tsx             #   → Tron/Cypherpunk styled, 8 interactive projects
│   │   ├── crea-tu-tienda/          # Merchant onboarding form (BTCPay Server)
│   │   │   └── page.tsx
│   │   ├── tianguis/                # Nostr + Lightning Marketplace
│   │   │   └── page.tsx
│   │   ├── proyectos/               # Community Projects Showcase
│   │   │   ├── page.tsx
│   │   │   └── ProyectosClient.tsx
│   │   └── layout.tsx               # (site) layout — fonts, providers
│   ├── hackathon/                   # ✅ Hackathon module (flat route, migrated from route group)
│   │   ├── layout.tsx               #   Shared layout: HackathonNavbar + HackathonFooter + fonts
│   │   └── [edition]/               #   Dynamic route — one page per hackathon edition
│   │       ├── page.tsx             #   Edition landing: Hero, Timeline, Prizes, FAQ, CTA
│   │       ├── register/
│   │       │   └── page.tsx         #   Edition registration form
│   │       ├── projects/
│   │       │   └── page.tsx         #   Project gallery — ProjectGrid component
│   │       ├── resources/
│   │       │   └── page.tsx         #   Resources Hub — PDFs, docs, workshops
│   │       └── api/
│   │           └── route.ts         #   GET / POST — registration + submission endpoints
│   ├── agenda/                      # Booking / Consultas (Cal.com iframe)
│   │   └── page.tsx
│   ├── nuestra-historia/            # Acepta Bitcoin history & mission
│   │   └── page.tsx
│   ├── proveedores/                 # Sovereign Provider Directory
│   │   ├── page.tsx                 #   Server data fetching
│   │   └── ProveedoresClient.tsx    #   Client component — MatrixRain bg, filter/search, ProviderCard grid
│   ├── api/
│   │   ├── tipjar/route.ts          # Blink.sv Lightning tip-jar proxy (GraphQL)
│   │   ├── tipjar/route.test.ts
│   │   └── webhook/lnbits.ts        # LNbits webhook handler
│   ├── actions/
│   │   └── submit-onboarding.tsx    # Server action for merchant form
│   ├── not-found.tsx                # Global 404 page
│   ├── layout.tsx                   # Root layout — metadata, global fonts, providers
│   └── globals.css                  # Tailwind directives + custom keyframes
├── components/
│   ├── layout/                      # Global wrappers
│   │   ├── Navbar.tsx               # Navigation bar (responsive)
│   │   ├── Hero.tsx                 # Homepage hero — Cypherpunk Bank aesthetic
│   │   └── Footer.tsx               # Footer w/ Node Status simulation + terminal nav
│   ├── sections/                    # Feature sections (page-scoped)
│   │   ├── PriceConverter.tsx       # Real-time BTC↔MXN/USD converter
│   │   ├── TipJarSection.tsx        # Lightning tip-jar w/ MatrixRain, QR, Blink
│   │   └── BtcMapSection.tsx        # Leaflet map — BTC Map API merchants
│   ├── widgets/                     # Standalone interactive widgets
│   │   ├── MarketMoodWidget.tsx     # DCA quality indicator (4H Binance)
│   │   ├── MarketMoodInfoPopover.tsx # Educational DCA tooltip (localStorage)
│   │   └── bob-chat/                # 🤖 Bob the Bitcoin Agent (AI Chat)
│   │       ├── BobChatWidget.tsx    #   Main chat UI w/ Matrix aesthetic
│   │       └── BobSectionHeader.tsx #   Header for Bob section
│   ├── hackathon/                   # ✅ Hackathon-specific components (modular)
│   │   ├── layout/
│   │   │   ├── HackathonNavbar.tsx  # Edition-aware nav with mobile menu
│   │   │   ├── HackathonFooter.tsx  # Hackathon-specific footer
│   │   │   ├── HackathonContainer.tsx
│   │   │   ├── HackathonLayout.tsx
│   │   │   └── index.ts
│   │   ├── hero/
│   │   │   └── EditionHero.tsx      # Edition hero with countdown, location, status badge
│   │   ├── display/
│   │   │   ├── Timeline.tsx         # Hackathon schedule timeline
│   │   │   ├── Prizes.tsx           # Prize tiers display
│   │   │   ├── SponsorsGrid.tsx     # Sponsors logo grid
│   │   │   ├── EvaluationCriteriaSection.tsx
│   │   │   ├── ProjectGrid.tsx      # Project gallery grid
│   │   │   ├── CountdownTimer.tsx   # Live countdown to hackathon date
│   │   │   ├── HackathonStats.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── PreviousWinners.tsx
│   │   │   ├── ApiDocsCard.tsx
│   │   │   ├── ExperienceTier.tsx
│   │   │   └── index.ts
│   │   ├── content/
│   │   │   ├── TechnicalConceptsSection.tsx
│   │   │   ├── DeliverablesSection.tsx
│   │   │   ├── AntiPatternsSection.tsx
│   │   │   ├── StackSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── RulesSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── EditionOverview.tsx
│   │   │   └── index.ts
│   │   ├── forms/
│   │   │   ├── RegistrationForm.tsx # Full registration form w/ Zod validation
│   │   │   ├── TeamMemberInputs.tsx # Dynamic team member fields
│   │   │   └── index.ts
│   │   └── interactive/
│   │       ├── GoogleFormButton.tsx # CTA button linking to Google Form
│   │       ├── CommandCheatSheet.tsx
│   │       ├── RepoCloneCTA.tsx
│   │       └── SupportChannels.tsx
│   ├── ui/                          # shadcn/ui + custom components
│   │   ├── MatrixRain.tsx           # Animated <canvas> rain effect (client-only)
│   │   ├── ArcadeButton.tsx         # Tron-style CTA button
│   │   ├── Logo.tsx                 # Matrix-styled SVG logo
│   │   ├── button.tsx               # shadcn Button
│   │   ├── card.tsx                 # shadcn Card
│   │   ├── dialog.tsx               # shadcn Dialog
│   │   ├── dropdown-menu.tsx        # shadcn DropdownMenu
│   │   ├── input.tsx                # shadcn Input
│   │   ├── label.tsx                # shadcn Label
│   │   ├── navigation-menu.tsx      # shadcn NavigationMenu
│   │   ├── separator.tsx            # shadcn Separator
│   │   ├── sheet.tsx                # shadcn Sheet
│   │   └── textarea.tsx             # shadcn Textarea
│   ├── common/                      # (legacy / shared utilities)
│   └── embeds/                      # (Cal.com, Bitcoin Agent embeds)
├── lib/
│   ├── blink.ts                     # Blink.sv GraphQL API client
│   ├── btcmap.ts                    # BTC Map API v1 wrapper (merchants by city)
│   ├── hackathon/                   # ✅ Hackathon data & logic layer
│   │   ├── index.ts                 # Re-exports: getEditionConfig, listActiveEditions, getNextEdition
│   │   ├── config.ts                # Shared hackathon config/constants
│   │   ├── bitcoin.ts               # Bitcoin-specific utilities
│   │   ├── validation.ts            # Zod schema — registration form validation
│   │   └── editions/
│   │       ├── index.ts             # getEditionConfig(), listActiveEditions(), getNextEdition()
│   │       ├── types.ts             # HackathonEdition, TimelineItem, Prize, Sponsor types
│   │       ├── 2026-1.ts            # Edition: HBTCMX 2026-1 (completed)
│   │       ├── 2026-2.ts            # Edition: Custody UI 2026 (upcoming) — slug: custody-ui-2026
│   │       ├── 2026-3.ts            # Edition: Tianguis 2026 — slug: tianguis-2026
│   │       └── legacy-data.ts       # Legacy edition data
│   ├── prompts/
│   │   └── bob-agent.ts             # Bob's personality & system prompt
│   ├── market/                      # Market data clients
│   │   ├── binance.ts               # Binance BTC/USD price fetch
│   │   └── useMarketMood.ts         # React hook: DCA ratio, price, sparkline data
│   ├── juegos.ts                    # Arcade/games data loader
│   ├── lnbits.ts                    # LNbits client (legacy)
│   ├── proveedores.ts               # Provider directory types, stats, data
│   ├── proyectos.ts                 # Community projects types and data
│   └── utils.ts                     # cn() (clsx+twMerge), formatSats, formatFiat
├── data/
│   ├── juegos.json                  # Arcade games data
│   ├── proveedores.json             # Provider directory data
│   └── proyectos.json               # Community projects data
├── styles/
│   └── hackathon.css                # Hackathon-specific CSS classes & tokens
├── public/                          # Static assets (images, icons)
├── docs/                            # Documentation
├── hooks/                           # Custom React hooks
│   ├── useMarketMood.ts             # Hook for DCA & Price data
│   └── useBobChat.ts                # BobChat state & typing logic
├── scripts/                         # Build / utility scripts
├── .env.local                       # Local env (never committed)
├── .env.example                     # Env var template
├── components.json                  # shadcn/ui config
├── next.config.mjs                  # Next.js config (PWA disabled in dev)
├── tailwind.config.ts               # Tailwind config (custom animations: scanline, blink, tilt)
├── tsconfig.json                    # TypeScript strict mode
├── design-system.md                 # Design system documentation
└── package.json                     # Next.js 14.2.3, Vitest, Sentry, Resend
```

## 🗺️ Route Map

| Route | Description | File | Status |
|-------|-------------|------|--------|
| `/` | **Oracle Homepage** — Hero, MarketMood, PriceConverter, Aprende, Tianguis cards, TipJar | `app/(site)/page.tsx` | ✅ Live (v2.0) |
| `/arcade` | **Bitcoin Arcade** — Visionary AI interactive labs, 8 hackathon projects | `app/(site)/arcade/page.tsx` | ✅ Live (Tron/Cypherpunk) |
| `/mapa` | **BTC Map Viewer** — Leaflet map with BTC Map API merchants | `app/(site)/mapa/page.tsx` | ✅ Standalone |
| `/tianguis` | **Lightning Marketplace** — Nostr + Lightning commerce | `app/(site)/tianguis/page.tsx` | ✅ Functional |
| `/proyectos` | **Community Showcase** — Client-rendered project grid | `app/(site)/proyectos/page.tsx` + `ProyectosClient.tsx` | ✅ Functional |
| `/crea-tu-tienda` | **Merchant Onboarding** — BTCPay registration form | `app/(site)/crea-tu-tienda/page.tsx` | ✅ Functional |
| `/agenda` | **Consultas** — Cal.com booking iframe | `app/agenda/page.tsx` | ✅ Integrated v2.0 |
| `/nuestra-historia` | Project History & Mission | `app/nuestra-historia/page.tsx` | ✅ Functional |
| `/proveedores` | **Sovereign Directory** — Filterable provider grid w/ MatrixRain | `app/proveedores/page.tsx` + `ProveedoresClient.tsx` | ✅ Functional |
| `/hackathon/[edition]` | **Hackathon Landing** — Edition-specific page (Hero, Timeline, Prizes, FAQ, CTA) | `app/hackathon/[edition]/page.tsx` | ✅ Live — slugs: `custody-ui-2026`, `tianguis-2026`, `2026-1` |
| `/hackathon/[edition]/register` | **Team Registration** — Zod-validated form | `app/hackathon/[edition]/register/page.tsx` | ✅ Functional |
| `/hackathon/[edition]/projects` | **Project Gallery** — ProjectGrid w/ edition data | `app/hackathon/[edition]/projects/page.tsx` | ✅ Functional |
| `/hackathon/[edition]/resources` | **Resources Hub** — PDFs, docs, workshop recordings | `app/hackathon/[edition]/resources/page.tsx` | ✅ Functional |
| `/hackathon/[edition]/api` | **Hackathon API** — GET endpoints list, POST registration | `app/hackathon/[edition]/api/route.ts` | ✅ Functional (stubs) |
| `/api/tipjar` | Lightning Tip-Jar API (Blink.sv proxy) | `app/api/tipjar/route.ts` | ✅ Live |
| `/api/webhook/lnbits` | LNbits webhook handler | `app/api/webhook/lnbits.ts` | ✅ Live |

## 🏆 Hackathon Editions

| Edition ID | Slug | Status | Description |
|-----------|------|--------|-------------|
| `2026-1` | `2026-1` | ✅ completed | HBTCMX Primera Edición |
| `2026-2` | `custody-ui-2026` | 🚀 upcoming | Custody UI Challenge |
| `2026-3` | `tianguis-2026` | 📋 defined | Tianguis Lightning Edition |

**Status:** All critical module bugs resolved. Documentation paths and dynamic routing verified.

## 🛠️ Technology Stack

| Layer | Technology | Version/Notes |
|-------|-----------|---------------|
| **Framework** | [Next.js](https://nextjs.org/) | 14.2.3 — App Router |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict mode |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Custom animations: `scanline`, `blink`, `tilt` |
| **UI Kit** | [shadcn/ui](https://ui.shadcn.com/) | + custom ArcadeButton, MatrixRain, Logo |
| **Icons** | [Lucide React](https://lucide.dev/) | — |
| **QR Codes** | [qrcode.react](https://github.com/zpao/qrcode.react) | Client-only (`ssr: false`) |
| **Maps** | [Leaflet](https://leafletjs.com/) + react-leaflet | `/mapa` route |
| **Payments** | [Blink.sv](https://blink.sv) | GraphQL API — Lightning + On-chain |
| **Market Data** | Binance API | BTC/USD via `lib/market/binance` |
| **Booking** | [Cal.com](https://cal.com) | Embedded in `/agenda` |
| **Validation** | [Zod](https://zod.dev/) | Hackathon registration schema |
| **Testing** | [Vitest](https://vitest.dev/) | `app/api/tipjar/route.test.ts`, `lib/proveedores.test.ts` |
| **Monitoring** | [Sentry](https://sentry.io) | Error tracking (client + server config) |
| **Email** | [Resend](https://resend.com) | Transactional email |

## 🎨 Design System: Cypherpunk Bank / Oracle System

The project uses a high-contrast, technical aesthetic inspired by digital frontiers and decentralized infrastructure.

### Typography
- **Serif**: IBM Plex Serif — High-contrast titles, institutional feel
- **Mono**: Fira Code — Technical descriptions, code snippets, data displays
- **Retro**: VT323 — Arcade buttons, system status, metadata labels

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| **Background** | `#000000` | Pure black — OLED depth |
| **Primary (Bitcoin)** | `#F7931A` | CTAs, Bitcoin branding |
| **Accent (Cyan/Tron)** | `#06B6D4` | Interactive highlights |
| **Matrix Green** | `#00FF41` | Status, MatrixRain, decorative |
| **Status Green** | `#22C55E` | Operational indicators |

### Visual Effects
- **Glassmorphism**: High-intensity `backdrop-blur` for cards and modals
- **Scanlines**: Animated overlay — `animate-scanline` on Card borders
- **Blinking Cursors**: Retro-terminal input simulation via `animate-blink`
- **Glows**: Neon `box-shadow` on hover (`shadow-[0_0_25px_rgba(...)]`)
- **Matrix Rain**: Animated `<canvas>` background on select pages

## 🚀 Recent Updates (v2.0 — Ongoing)

1. **Oracle Homepage** (🎉): Replaced old BTC Map with a focused "Oracle" experience — Hero, MarketMood DCA widget, PriceConverter, and dual CTA cards (Crea tu Tienda + Tianguis)
2. **`/proveedores` Sovereign Directory** (🎉): Full directory page with MatrixRain background, stats bar, category filters, search, ProviderCard grid
3. **Dynamic Tip Jar** (🎉): Lightning + on-chain donation with real-time QR codes, `isMounted` SSR guard, Blink.sv integration
4. **MarketMood DCA Widget** (✨): 4H timeframe DCA quality indicator with Binance price feed, sparkline history, color-coded tiers, and AureoBitcoin sponsorship
5. **Bitcoin Arcade** (`/arcade`): Tron/Cypherpunk-styled learning hub with Visionary AI projects — 8 interactive hackathon projects
6. **Agenda v2.0**: Embedded Cal.com booking within a themed "System Window" UI
7. **Hydration Fixes** (🐛): `isMounted` state guards on `MatrixRain`, `TipJarSection`, and MarketMood widgets; `suppressHydrationWarning` on dynamic elements; QR codes rendered client-only via `next/dynamic` with `ssr: false`
8. **Blink.sv Migration**: Payment infrastructure moved from LNbits to Blink's GraphQL API
9. **Interactive Footer**: "Node Status" simulation, terminal-style nav links
10. **Hackathon Module** (🚀 New): Full multi-edition hackathon platform under `app/hackathon/[edition]/`. Migrated from `(hackathon)` route group to flat `app/hackathon/` to fix hydration & routing errors. Supports editions: `custody-ui-2026`, `tianguis-2026`, `2026-1`.
11. **CI/CD**: Build verified passing with zero hydration errors, zero TypeScript errors
12. **Hackathon Stability** (🛠️): Fixed hardcoded links, corrected `/public/` documentation paths, implemented `generateStaticParams` for all sub-routes, and configured `metadataBase` for Open Graph.
13. **Bob the Bitcoin Agent** (🤖): Integrated a specialized Bitcoin AI assistant on the homepage with custom Cypherpunk personality, Matrix-style chat UI, and stateful interaction.