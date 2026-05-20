# Mantenimiento: Acepta Bitcoin México (Oracle System v2.0)

Estado actual del proyecto — última actualización: 2026-05-20

---

## 📋 Estado General

| Área | Estado | Notas |
|------|--------|-------|
| **Build (npm run build)** | ✅ Pasando | 0 errores TypeScript, 0 warnings de hidratación |
| **Tipado (TypeScript strict)** | ✅ Sin errores | `tsconfig.json` en modo estricto |
| **Linting** | ✅ Sin errores bloqueadores | — |
| **Tests (Vitest)** | ✅ Pasando | `app/api/tipjar/route.test.ts`, `lib/proveedores.test.ts` |
| **Despliegue (Vercel)** | ✅ Configurado | Variables de entorno: `NEXT_PUBLIC_TIP_JAR_LN_ADDRESS` |
| **Módulo Hackathon** | ✅ Live | Migrado de route group `(hackathon)` a `app/hackathon/` — rutas activas |

---

## 🔧 Stack Técnico

- **Framework**: Next.js 14.2.3 (App Router)
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: Tailwind CSS con animaciones custom (`scanline`, `blink`, `tilt`) + `styles/hackathon.css`
- **UI**: shadcn/ui + componentes custom (ArcadeButton, MatrixRain, Logo, AhorraSectionHeader, AceptaBitcoinSectionHeader)
- **Pagos**: Blink.sv (GraphQL API — Lightning + On-chain)
- **Datos de mercado**: Binance API (BTC/USD, indicador DCA)
- **QR Codes**: `qrcode.react` (client-only, `ssr: false`)
- **Reservas**: Cal.com (iframe embebido en `/agenda`)
- **Validación**: Zod (esquema de registro de hackathon)
- **Testing**: Vitest
- **Monitoreo**: Sentry (cliente + servidor: `sentry.client.config.ts`, `sentry.server.config.ts`)
- **Email**: Resend

---

## 🔩 Componentes — Estado de Hidratación

Todos los componentes con datos dinámicos o dependientes del navegador incluyen protección SSR/CSR:

| Componente | Guard `isMounted` | `suppressHydrationWarning` | `dynamic ssr:false` | Estado |
|------------|-------------------|---------------------------|---------------------|--------|
| `MatrixRain` | ✅ | — | — | ✅ OK (Renderiza `<canvas>` en SSR y CSR para evitar mismatch) |
| `HeroParticles` | ✅ | — | — | ✅ OK (Renderiza `<canvas>` en SSR y CSR para evitar mismatch) |
| `MatrixHeroBackground` | — | — | — | ✅ OK (Wrapper siempre activo en SSR/CSR) |
| `TipJarSection` | ✅ | ✅ | — | ✅ OK |
| `MarketMoodWidget` | — | — | ✅ (via `next/dynamic`) | ✅ OK |
| `MarketMoodInfoPopover` | — | ✅ | — | ✅ OK |
| `QRCodeSVG` (en TipJar) | ✅ (condicional `isMounted`) | ✅ | — | ✅ OK |
| `CountdownTimer` (hackathon) | ✅ | — | — | ✅ OK (implementación robusta) |
| `HackathonNavbar` | — | — | — | ✅ OK (`"use client"`, `useState` al final del archivo) |
| `AhorraSectionHeader` | ✅ | — | — | ✅ OK (IntersectionObserver + framer-motion) |
| `AceptaBitcoinSectionHeader` | ✅ | — | — | ✅ OK (IntersectionObserver + framer-motion) |

---

## 📁 Estructura de Rutas Activas

### Sitio Principal

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/` | `app/(site)/page.tsx` | ✅ Oracle v2.0 — Homepage con Section Headers (Bob, Ahorra, Acepta) |
| `/arcade` | `app/(site)/arcade/page.tsx` | ✅ Bitcoin Arcade + Visionary AI |
| `/tianguis` | `app/(site)/tianguis/page.tsx` | ✅ Nostr + Lightning Marketplace |
| `/proyectos` | `app/(site)/proyectos/page.tsx` + `ProyectosClient.tsx` | ✅ Community Projects |
| `/crea-tu-tienda` | `app/(site)/crea-tu-tienda/page.tsx` | ✅ Merchant Onboarding |
| `/agenda` | `app/agenda/page.tsx` | ✅ Cal.com Booking |
| `/nuestra-historia` | `app/nuestra-historia/page.tsx` | ✅ Project History |
| `/proveedores` | `app/proveedores/page.tsx` + `ProveedoresClient.tsx` | ✅ Sovereign Directory |
| `/api/tipjar` | `app/api/tipjar/route.ts` | ✅ Blink.sv Proxy |

### Módulo Hackathon (`app/hackathon/`)

> ⚠️ **Migración completada**: Ruta aplanada de `app/(hackathon)/` → `app/hackathon/` para resolver errores de hidratación y routing en Vercel. Commit: `d9d6e6c`.

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/hackathon/[edition]` | `app/hackathon/[edition]/page.tsx` | ✅ Hero, Timeline, Prizes, FAQ, CTA |
| `/hackathon/[edition]/register` | `app/hackathon/[edition]/register/page.tsx` | ✅ Formulario con Zod validation |
| `/hackathon/[edition]/projects` | `app/hackathon/[edition]/projects/page.tsx` | ✅ Galería de proyectos |
| `/hackathon/[edition]/resources` | `app/hackathon/[edition]/resources/page.tsx` | ✅ PDFs, docs, workshops |
| `/hackathon/[edition]/api` | `app/hackathon/[edition]/api/route.ts` | ✅ GET endpoints + POST registro (stubs) |

**Slugs de edición válidos:**
| Slug | ID interno | Estado |
|------|-----------|--------|
| `2026-1` | `edition2026_1` | ✅ Completada |
| `custody-ui-2026` | `edition2026_2` | 🚀 Upcoming |
| `tianguis-2026` | `edition2026_3` | 📋 Definida |

---

## 🧹 Tareas de Mantenimiento Pendientes

### Prioridad Alta
- [x] **Subir PDFs de recursos**: Creado `public/hackathon/docs/` con placeholders corregidos (`guia-participante-2026-2.pdf`, `lightning-setup-guide.pdf`, `nip99-cheatsheet.pdf`)
- [x] **Conectar API de registro**: Migrado a Google Forms para simplificar la gestión y soberanía de datos. El endpoint `POST /register` ha sido removido.
- [ ] **Validar claves de API en producción**: Confirmar `NEXT_PUBLIC_TIP_JAR_LN_ADDRESS` en Vercel env vars
- [ ] **Revisar dependencias**: `npm outdated` + actualizar parches de seguridad
- [x] **Orange palette CSS variables**: Definidas `--orange-500`, `--orange-400`, `--orange-glow` en `globals.css` y `tailwind.config.ts`

### Prioridad Media
- [x] **`generateStaticParams` para sub-rutas**: Implementado en `/register`, `/projects`, `/resources` para evitar 404 en builds estáticos.
- [ ] **Optimización de imágenes**: Convertir assets estáticos a WebP/AVIF
- [x] **SEO meta tags dinámicos**: Implementado `generateMetadata` dinámico en todas las sub-rutas del hackathon.
- [ ] **Analytics**: Integrar Plausible / Umami (privacidad-friendly)
- [ ] **Accesibilidad (a11y)**: Auditar con Lighthouse — revisar contraste en colores Matrix/Bitcoin sobre negro

### Prioridad Baja
- [x] **`console.log` de debug**: Eliminar el `console.log('[EditionPage] Rendering edition:', ...)` en `app/hackathon/[edition]/page.tsx` antes de producción final
- [ ] **Internacionalización**: Evaluar soporte multi-idioma (es/en)
- [ ] **PWA**: Activar Service Worker + `manifest.json` (actualmente deshabilitado: `[PWA] PWA support is disabled`)
- [ ] **Docs**: Completar `docs/` con guías de contribución y despliegue
- [x] **Limpieza de código muerto**: Eliminación del componente `ApiDocsCard` y limpieza de exports huérfanos en `components/hackathon/display/index.ts`.

---

## 🐛 Issues Conocidos / Resueltos

### Resueltos Recientemente

| Issue | Descripción | Fix |
|-------|-------------|-----|
| Mismatches de hidratación graves en Hackathon | `HeroParticles`, `MatrixRain` y `MatrixHeroBackground` causaban caídas de DOM | Unificación de tags en SSR/CSR (siempre `<canvas>` y `div` activos) |
| Errores de compilación por `density` prop | Se removió la prop obsoleta de `<MatrixRain>` en toda la app | Depurado en `/arcade`, `/proyectos` y layouts |
| `string.getTime()` error en countdown | `.toLocaleString()` devolvía string que rompía tipado en build | Migración a `Date.now()` absoluto en `CountdownTimer.tsx` |
| Hydration errors globales | `MatrixRain`, `TipJarSection`, `MarketMoodWidget` producían mismatches SSR/CSR | `isMounted` guards + `next/dynamic ssr:false` |
| Hackathon routing 404 en Vercel | Route group `(hackathon)` no mapeaba a `/hackathon/...` correctamente | Migración a `app/hackathon/` (`d9d6e6c`) |
| `CountdownTimer` inestable | Implementación reemplazada por versión robusta con `useEffect` limpio | `9e5f23f` |
| `MatrixRain` import error | Default import faltante en layout del hackathon | `1fa392b` |
| Zod enum type errors | Errores de tipo en esquema de validación de registro | `198fd38` |
| `RegistrationSuccess` module | Export faltante causaba error de build | `536d9ec` |
| Link "Volver" hardcoded en `/register` | `href="/hackathon/hbtcmx-2026-1"` (slug inexistente) | Corregido a `href={`/hackathon/${params.edition}`}` |
| PDFs con prefijo `/public/` | `href="/public/hackathon/docs/..."` → 404 en Next.js | Corregido en `HackathonFooter.tsx` y `resources/page.tsx` |
| `metadataBase` missing | Warning en build para Open Graph images | Configurado en `RootLayout` y páginas dinámicas de hackathon |
| Sub-rutas 404 en SSG | `/register`, `/projects`, `/resources` sin SSG params | Implementado `generateStaticParams` en todas las sub-rutas |
| Placeholders de recursos | PDFs faltantes causaban 404 | Creados archivos placeholder en `public/hackathon/docs/` |
| Metadata types missing | Error `Cannot find name 'Metadata'` en build | Importado `type { Metadata } from 'next'` en sub-páginas |
| Build failure `/api/chat` | Error en Edge Runtime por SDK de Groq | Instanciación movida dentro del handler `POST` |
| BobChat scroll hijacking | Scroll automático interrumpía navegación al escribir | Trigger cambiado a `messages.length` + `block: 'nearest'` |
| Native Registration Form | Mantenimiento de formulario y validación Zod complejo | Migrado a Google Forms con redirección automática en `/register` |
| Componentes obsoletos | `ApiDocsCard` y exports sin uso en el módulo de display del Hackathon | Componente eliminado y `index.ts` limpiado |
| Orange palette CSS vars | Variables `--orange-500`, `--orange-400`, `--orange-glow` no definidas | Agregadas a `app/globals.css` y `tailwind.config.ts` |
| `AhorraSectionHeader` sin estandarizar | Necesario componente estandarizado para sección de ahorro | Creado con props `marketTrend`, `isLive`, memoización |
| `AceptaBitcoinSectionHeader` faltante | Header para calculadora de pagos/conversiones | Creado con IntersectionObserver, chips financieros, badge realtime |

### Issues Abiertos

| Prioridad | Descripción |
|-----------|-------------|
| 🟡 Media | API de registro hackathon son stubs (no persisten datos) |
| 🟡 Media | Integración real de webhooks de Discord para registros |

---

## 📅 Actualizaciones Recientes - Mayo 2026 (Sesión de Pulido y Encerado)

Se realizó una revisión y refactorización profunda de los componentes clave:

### 1. Caja Registradora (TipJar) - Mayor evolución

- Renombrado conceptualmente de "TipJar" → "Caja Registradora AceptaBitcoin"
- Nueva UX alineada al funnel: Aprende → Ahorra → Acepta
- Diseño mejorado con fuerte identidad Matrix/Cypherpunk
- Colores dinámicos: Verde Matrix para SATS/Lightning y Naranja Bitcoin para USD
- Mejora en selección de servicios, montos preset y experiencia general
- Mejor integración con Blink.sv (Stablesats + On-chain)

### 2. Backend de Pagos

**app/api/tipjar/route.ts:**
- Añadida validación con Zod
- Mejor manejo de errores y logging
- Respuestas más completas y consistentes

**lib/blink.ts:**
- Soporte real de Stablesats (lnUsdInvoiceCreate)
- Integración con precio actual de Binance (eliminado hardcode)
- Código más robusto y mantenible

### 3. Componentes de "Ahorra" y Mercado

- **PriceConverter.tsx**: Rediseño completo, mejor separación visual entre BTC-USD, BTC-MXN y SATS-MXN, más atractivo y coherente con el Design System.
- **MarketMoodWidget.tsx (DCA Oracle):**
  - Actualizado referral de AureoBitcoin (?ref=abo)
  - Restauradas caritas + mejor impacto visual
  - CTA más prominente y atractivo para el sponsor

### 4. B.O.B. Chat Widget

- Versión visualmente mucho más atractiva y "viva"
- Mejores efectos glow, espaciado, empty states y personalidad cypherpunk
- Mejora en animaciones y experiencia general

### 5. Configuración y Mantenimiento

- Actualizado .env.example con Lightning Address correcto (aceptabitcoin@blink.sv) y mejor organización
- Alineación general con Design System "Bitcoin Matrix" (colores, tipografía, glassmorphism, scanlines, etc.)

**Estado actual:** Gran avance en pulido visual, consistencia de marca y experiencia de usuario. La Caja Registradora ya se siente como un producto soberano y profesional.

---

## 🔄 Últimos Commits Relevantes

| Hash | Mensaje |
|------|---------|
| `ae43409` | fix(hydration): eliminate severe DOM mismatches in dynamic hackathon sections |
| `e61d0e5` | fix(compile): remove density prop usages + fix string.getTime() in CountdownTimer |
| `7f82ede` | fix(hydration): resolve React #425/#423 errors in CountdownTimer + MatrixRain |
| `d9d6e6c` | refactor(hackathon): migrate from (hackathon) route group to flat app/hackathon/ |
| `7ce9674` | fix(routing): remove route group to map correctly to /hackathon |
| `9e5f23f` | feat(hackathon): update CountdownTimer with robust implementation |
| `e9126b4` | feat(core): add custom 404 not found page |
| `08556dd` | feat(hero): update CTA buttons with Luma events link |
| `1fa392b` | fix(hackathon): correct default import for MatrixRain and fix isActive type error |
| `198fd38` | fix(hackathon): resolve zod enum type errors in validation schema |
| `3cdecfe` | fix(hackathon): correct default imports for Navbar and Footer in layout |
| `1c5a144` | fix(hackathon): resolve ts warning possibly undefined in EditionHero |

---

## 📦 Instalación Local

```bash
# 1. Clonar
git clone https://github.com/ScubaAI/aceptabitcoin-org.git
cd aceptabitcoin-org

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con valores reales:
#   NEXT_PUBLIC_TIP_JAR_LN_ADDRESS=tu@wallet@blink.sv

# 4. Desarrollo
npm run dev
# → http://localhost:3000

# 5. Build de producción
npm run build
npm start

# 6. Limpiar caché Next.js (si hay errores de routing/hidratación)
rm -rf .next
npm run dev
```

---

## 🌐 Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `NEXT_PUBLIC_TIP_JAR_LN_ADDRESS` | ✅ | Lightning address para el TipJar (ej. `user@blink.sv`) |
| `SENTRY_DSN` | Recomendada | DSN de Sentry para monitoreo de errores |
| `RESEND_API_KEY` | Opcional | API key de Resend para emails transaccionales |

---

*Documentación generada automáticamente. Actualizar tras cada deploy significativo.*