# Project Map: Acepta Bitcoin México (Oracle System v2.0)

A comprehensive overview of the `aceptabitcoin-org` project structure, architecture, and current status.

## 🏗️ Project Architecture

```
aceptabitcoin-org/
├── app/                       # Next.js 14 App Router
│   ├── (site)/                # Main website route group (public-facing pages)
│   │   ├── page.tsx           # Homepage — Oracle v2.0 w/ Hero, PriceConverter,
│   │   │                       MarketMoodWidget, Aprende, Tianguis cards, TipJar
│   │   ├── mapa/              # BTC Merchant Map (standalone, Leaflet + BTC Map API)
│   │   │   └── page.tsx       #   → BtcMapSection
│   │   ├── aprende/           # Bitcoin learning hub — Visionary AI arcade
│   │   │   └── page.tsx       #   → Tron/Cypherpunk styled, 8 interactive projects
│   │   ├── crea-tu-tienda/    # Merchant onboarding form (BTCPay Server)
│   │   │   └── page.tsx
│   │   ├── tianguis/          # Nostr + Lightning Marketplace
│   │   │   └── page.tsx
│   │   ├── proyectos/         # Community Projects Showcase
│   │   │   ├── page.tsx
│   │   │   └── ProyectosClient.tsx
│   │   └── layout.tsx         # (site) layout — fonts, providers
│   ├── agenda/                # Booking / Consultas (Cal.com iframe)
│   │   └── page.tsx
│   ├── nuestra-historia/      # Acepta Bitcoin history & mission
│   │   └── page.tsx
│   ├── proveedores/           # Sovereign Provider Directory
│   │   ├── page.tsx           #   Server data fetching
│   │   └── ProveedoresClient.tsx  #   Client component — MatrixRain bg,
│   │                              #   filter/search, ProviderCard grid
│   ├── api/
│   │   ├── tipjar/route.ts    # Blink.sv Lightning tip-jar proxy (GraphQL)
│   │   ├── tipjar/route.test.ts
│   │   └── webhook/lnbits.ts  # LNbits webhook handler
│   ├── actions/
│   │   └── submit-onboarding.tsx  # Server action for merchant form
│   ├── layout.tsx             # Root layout — metadata, global fonts, providers
│   └── globals.css            # Tailwind directives + custom keyframes
├── components/
│   ├── layout/                # Global wrappers
│   │   ├── Navbar.tsx         # Navigation bar (responsive)
│   │   ├── Hero.tsx           # Homepage hero — Cypherpunk Bank aesthetic
│   │   └── Footer.tsx         # Footer w/ Node Status simulation + terminal nav
│   ├── sections/              # Feature sections (page-scoped)
│   │   ├── PriceConverter.tsx # Real-time BTC↔MXN/USD converter
│   │   ├── TipJarSection.tsx  # Lightning tip-jar w/ MatrixRain, QR, Blink
│   │   └── BtcMapSection.tsx  # Leaflet map — BTC Map API merchants
│   ├── widgets/               # Standalone interactive widgets
│   │   ├── MarketMoodWidget.tsx       # DCA quality indicator (4H Binance)
│   │   └── MarketMoodInfoPopover.tsx  # Educational DCA tooltip (localStorage)
│   ├── ui/                    # shadcn/ui + custom components
│   │   ├── MatrixRain.tsx     # Animated <canvas> rain effect (client-only)
│   │   ├── ArcadeButton.tsx   # Tron-style CTA button
│   │   ├── Logo.tsx           # Matrix-styled SVG logo
│   │   ├── button.tsx         # shadcn Button
│   │   ├── card.tsx           # shadcn Card
│   │   ├── dialog.tsx         # shadcn Dialog
│   │   ├── dropdown-menu.tsx  # shadcn DropdownMenu
│   │   ├── input.tsx          # shadcn Input
│   │   ├── label.tsx          # shadcn Label
│   │   ├── navigation-menu.tsx # shadcn NavigationMenu
│   │   ├── separator.tsx      # shadcn Separator
│   │   ├── sheet.tsx          # shadcn Sheet
│   │   └── textarea.tsx       # shadcn Textarea
│   ├── common/                # (legacy / shared utilities)
│   └── embeds/                # (Cal.com, Bitcoin Agent embeds)
├── lib/
│   ├── blink.ts               # Blink.sv GraphQL API client
│   │                           #   - buildLightningAddressUrl()
│   │                           #   - buildQrValue(), formatSats(), formatUsd()
│   ├── btcmap.ts              # BTC Map API v1 wrapper (merchants by city)
│   ├── market/                # Market data clients
│   │   ├── binance.ts         # Binance BTC/USD price fetch
│   │   └── useMarketMood.ts   # React hook: DCA ratio, price, sparkline data
│   ├── proveedores.ts         # Provider directory types, stats, data
│   └── utils.ts               # cn() (clsx+twMerge), formatSats, formatFiat
├── public/                    # Static assets (images, icons)
├── docs/                      # Documentation (map.md, mantenimiento.md, etc.)
├── .env.local                 # Local env (never committed)
├── .env.example               # Env var template: BTCMAP_API_KEY, TIPJAR_LN_ADDR
├── components.json            # shadcn/ui config
├── next.config.mjs            # Next.js config
├── tailwind.config.ts         # Tailwind config (custom animations: scanline,
│                              #   blink, tilt, Matrix colors)
├── tsconfig.json              # TypeScript strict mode
└── package.json               # Next.js 14.2.3, Vitest, Sentry, Resend
```

## 🗺️ Route Map

| Route | Description | File | Status |
|-------|-------------|------|--------|
| `/` | **Oracle Homepage** — Hero, MarketMood, PriceConverter, Aprende, Tianguis cards, TipJar | `app/(site)/page.tsx` | ✅ Live (v2.0) |
| `/aprende` | **Bitcoin Arcade** — Visionary AI interactive labs, 8 hackathon projects | `app/(site)/aprende/page.tsx` | ✅ Live (Tron/Cypherpunk) |
| `/mapa` | **BTC Map Viewer** — Leaflet map with BTC Map API merchants | `app/(site)/mapa/page.tsx` | ✅ Standalone |
| `/tianguis` | **Lightning Marketplace** — Nostr + Lightning commerce | `app/(site)/tianguis/page.tsx` | ✅ Functional |
| `/proyectos` | **Community Showcase** — Client-rendered project grid | `app/(site)/proyectos/page.tsx` + `ProyectosClient.tsx` | ✅ Functional |
| `/crea-tu-tienda` | **Merchant Onboarding** — BTCPay registration form | `app/(site)/crea-tu-tienda/page.tsx` | ✅ Functional |
| `/agenda` | **Consultas** — Cal.com booking iframe | `app/agenda/page.tsx` | ✅ Integrated v2.0 |
| `/nuestra-historia` | Project History & Mission | `app/nuestra-historia/page.tsx` | ✅ Functional |
| `/proveedores` | **Sovereign Directory** — Filterable provider grid w/ MatrixRain | `app/proveedores/page.tsx` + `ProveedoresClient.tsx` | ✅ Functional |
| `/api/tipjar` | Lightning Tip-Jar API (Blink.sv proxy) | `app/api/tipjar/route.ts` | ✅ Live |
| `/api/webhook/lnbits` | LNbits webhook handler | `app/api/webhook/lnbits.ts` | ✅ Live |

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
| **Testing** | [Vitest](https://vitest.dev/) | `app/api/tipjar/route.test.ts` |
| **Monitoring** | [Sentry](https://sentry.io) | Error tracking |
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

1. **Oracle Homepage** (`:tada:`): Replaced old BTC Map with a focused "Oracle" experience — Hero, MarketMood DCA widget, PriceConverter, and dual CTA cards (Crea tu Tienda + Tianguis)
2. **`/proveedores` Sovereign Directory** (`:tada:`): Full directory page with Matr ixRain background, stats bar, category filters, search, ProviderCard grid
3. **Dynamic Tip Jar** (`:tada:`): Lightning + on-chain donation with real-time QR codes, `isMounted` SSR guard, Blink.sv integration
4. **MarketMood DCA Widget** (`:sparkles:`): 4H timeframe DCA quality indicator with Binance price feed, sparkline history, color-coded tiers, and AureoBitcoin sponsorship
5. **Bitcoin Arcade** (`/aprende`): Tron/Cypherpunk-styled learning hub with Visionary AI projects — 8 interactive hackathon projects
6. **Agenda v2.0**: Embedded Cal.com booking within a themed "System Window" UI
7. **Hydration Fixes** (`:bug:`): `isMounted` state guards on `MatrixRain`, `TipJarSection`, and MarketMood widgets; `suppressHydrationWarning` on dynamic elements; QR codes rendered client-only via `next/dynamic` with `ssr: false`
8. **Blink.sv Migration**: Payment infrastructure moved from LNbits to Blink's GraphQL API
9. **Interactive Footer**: "Node Status" simulation, terminal-style nav links
10. **CI/CD**: Build verified passing with zero hydration errors, zero TypeScript errors