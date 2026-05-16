# Mantenimiento: Acepta Bitcoin México (Oracle System v2.0)

Estado actual del proyecto — última actualización: 2026-05-16

---

## 📋 Estado General

| Área | Estado | Notas |
|------|--------|-------|
| **Build (npm run build)** | ✅ Pasando | 0 errores TypeScript, 0 warnings de hidratación |
| **Tipado (TypeScript strict)** | ✅ Sin errores | `tsconfig.json` en modo estricto |
| **Linting** | ✅ Sin errores bloqueadores | — |
| **Tests (Vitest)** | ✅ Pasando | `app/api/tipjar/route.test.ts`, `lib/proveedores.test.ts` |
| **Despliegue (Vercel)** | ✅ Configurado | Variables de entorno: `BTCMAP_API_KEY`, `NEXT_PUBLIC_TIP_JAR_LN_ADDRESS` |
| **Módulo Hackathon** | ✅ Live | Migrado de route group `(hackathon)` a `app/hackathon/` — rutas activas |

---

## 🔧 Stack Técnico

- **Framework**: Next.js 14.2.3 (App Router)
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: Tailwind CSS con animaciones custom (`scanline`, `blink`, `tilt`) + `styles/hackathon.css`
- **UI**: shadcn/ui + componentes custom (ArcadeButton, MatrixRain, Logo)
- **Pagos**: Blink.sv (GraphQL API — Lightning + On-chain)
- **Datos de mercado**: Binance API (BTC/USD, indicador DCA)
- **QR Codes**: `qrcode.react` (client-only, `ssr: false`)
- **Mapas**: Leaflet + react-leaflet + BTC Map API v1
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
| `MatrixRain` | ✅ | ✅ | — | ✅ OK |
| `TipJarSection` | ✅ | ✅ | — | ✅ OK |
| `MarketMoodWidget` | — | — | ✅ (via `next/dynamic`) | ✅ OK |
| `MarketMoodInfoPopover` | — | ✅ | — | ✅ OK |
| `QRCodeSVG` (en TipJar) | ✅ (condicional `isMounted`) | ✅ | — | ✅ OK |
| `CountdownTimer` (hackathon) | ✅ | — | — | ✅ OK (implementación robusta) |
| `HackathonNavbar` | — | — | — | ✅ OK (`"use client"`, `useState` al final del archivo) |

---

## 📁 Estructura de Rutas Activas

### Sitio Principal

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/` | `app/(site)/page.tsx` | ✅ Oracle v2.0 — Homepage |
| `/arcade` | `app/(site)/arcade/page.tsx` | ✅ Bitcoin Arcade + Visionary AI |
| `/mapa` | `app/(site)/mapa/page.tsx` | ✅ BTC Merchant Map |
| `/tianguis` | `app/(site)/tianguis/page.tsx` | ✅ Nostr + Lightning Marketplace |
| `/proyectos` | `app/(site)/proyectos/page.tsx` + `ProyectosClient.tsx` | ✅ Community Projects |
| `/crea-tu-tienda` | `app/(site)/crea-tu-tienda/page.tsx` | ✅ Merchant Onboarding |
| `/agenda` | `app/agenda/page.tsx` | ✅ Cal.com Booking |
| `/nuestra-historia` | `app/nuestra-historia/page.tsx` | ✅ Project History |
| `/proveedores` | `app/proveedores/page.tsx` + `ProveedoresClient.tsx` | ✅ Sovereign Directory |
| `/api/tipjar` | `app/api/tipjar/route.ts` | ✅ Blink.sv Proxy |
| `/api/webhook/lnbits` | `app/api/webhook/lnbits.ts` | ✅ Webhook Handler |

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
- [ ] **Conectar API de registro**: `app/hackathon/[edition]/api/route.ts` tiene `// TODO: Save to database` y `// TODO: Send webhook to Discord` — pendiente implementación real
- [ ] **Validar claves de API en producción**: Confirmar `BTCMAP_API_KEY` y `NEXT_PUBLIC_TIP_JAR_LN_ADDRESS` en Vercel env vars
- [ ] **Revisar dependencias**: `npm outdated` + actualizar parches de seguridad

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

---

## 🐛 Issues Conocidos / Resueltos

### Resueltos Recientemente

| Issue | Descripción | Fix |
|-------|-------------|-----|
| Hydration errors globales | `MatrixRain`, `TipJarSection`, `MarketMoodWidget` producían mismatches SSR/CSR | `isMounted` guards + `next/dynamic ssr:false` |
| Hackathon routing 404 en Vercel | Route group `(hackathon)` no mapeaba a `/hackathon/...` correctamente | Migración a `app/hackathon/` (`d9d6e6c`) |
| `CountdownTimer` inestable | Implementación reemplazada por versión robusta con `useEffect` limpio | `9e5f23f` |
| `MatrixRain` import error | Default import faltante en layout del hackathon | `1fa392b` |
| Zod enum type errors | Errores de tipo en esquema de validación de registro | `198fd38` |
| `RegistrationSuccess` module | Export faltante causaba error de build | `536d9ec` |
| Link "Volver" hardcoded en `/register` | `href=\"/hackathon/hbtcmx-2026-1\"` (slug inexistente) | Corregido a `href={\\`/hackathon/\\${params.edition}\\`}` |
| PDFs con prefijo `/public/` | `href=\"/public/hackathon/docs/...\"` → 404 en Next.js | Corregido en `HackathonFooter.tsx` y `resources/page.tsx` |
| `metadataBase` missing | Warning en build para Open Graph images | Configurado en `RootLayout` y páginas dinámicas de hackathon |
| Sub-rutas 404 en SSG | `/register`, `/projects`, `/resources` sin SSG params | Implementado `generateStaticParams` en todas las sub-rutas |
| Placeholders de recursos | PDFs faltantes causaban 404 | Creados archivos placeholder en `public/hackathon/docs/` |
| Metadata types missing | Error `Cannot find name 'Metadata'` en build | Importado `type { Metadata } from 'next'` en sub-páginas |
| Build failure `/api/chat` | Error en Edge Runtime por SDK de Groq | Instanciación movida dentro del handler `POST` |
| BobChat scroll hijacking | Scroll automático interrumpía navegación al escribir | Trigger cambiado a `messages.length` + `block: 'nearest'` |

### Issues Abiertos

| Prioridad | Descripción |
|-----------|-------------|
| 🟡 Media | API de registro hackathon son stubs (no persisten datos) |
| 🟡 Media | Integración real de webhooks de Discord para registros |

---

## 🔄 Últimos Commits Relevantes

| Hash | Mensaje |
|------|---------|
| `d9d6e6c` | refactor(hackathon): migrate from (hackathon) route group to flat app/hackathon/ |
| `7ce9674` | fix(routing): remove route group to map correctly to /hackathon |
| `9e5f23f` | feat(hackathon): update CountdownTimer with robust implementation |
| `e9126b4` | feat(core): add custom 404 not found page |
| `08556dd` | feat(hero): update CTA buttons with Luma events link |
| `1fa392b` | fix(hackathon): correct default import for MatrixRain and fix isActive type error |
| `198fd38` | fix(hackathon): resolve zod enum type errors in validation schema |
| `3cdecfe` | fix(hackathon): correct default imports for Navbar and Footer in layout |
| `1c5a144` | fix(hackathon): resolve ts warning possibly undefined in EditionHero |
| `536d9ec` | fix(hackathon): remove missing RegistrationSuccess module export |

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
#   BTCMAP_API_KEY=tu_api_key
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
| `BTCMAP_API_KEY` | ✅ | API key para BTC Map (mapa de comerciantes) |
| `NEXT_PUBLIC_TIP_JAR_LN_ADDRESS` | ✅ | Lightning address para el TipJar (ej. `user@blink.sv`) |
| `SENTRY_DSN` | Recomendada | DSN de Sentry para monitoreo de errores |
| `RESEND_API_KEY` | Opcional | API key de Resend para emails transaccionales |

---

*Documentación generada automáticamente. Actualizar tras cada deploy significativo.*