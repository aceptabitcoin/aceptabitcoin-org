# Mantenimiento: Acepta Bitcoin México (Oracle System v2.0)

Estado actual del proyecto — última actualización: 2026-06-07

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

## 🚀 Sprint Update: Bitcoin Only Infrastructure & Matrix UI Refinement (v2.1)

### ✅ Completed Tasks

#### 1. TipJar Section — Serverless Payment Architecture (v2.1)
- **Refactor:** Eliminación completa del backend `/api/tipjar`. Migración a enlaces directos de Blink POS con memos dinámicos estructurados (`SERVICIO_MONTO_DIVISA`).
- **UI/UX:** Implementación de tabs reactivas (Lightning / On-Chain / Fiat) con transiciones suaves.
- **Visuals:** Integración de `MatrixRain` con color dinámico (`theme.hex`) que cambia entre Naranja Bitcoin y Cian Cypherpunk según la pestaña activa. Efecto de "cabeza blanca brillante" en la lluvia matrix para realismo CRT.
- **DS Compliance:** Uso estricto de `font-serif` para títulos, `font-mono` para datos técnicos, y tokens de color semánticos.
- **Files Modified:** `components/sections/TipJarSection.tsx`, `components/ui/MatrixRain.tsx`, `TIPJAR.md`.

#### 2. Partners Carousel & Card — Sovereign Node Aesthetic
- **Data Structure:** Refactorización de `data/partners.ts`. Eliminación de prop `color` dinámica. Adición de metadatos técnicos: `protocol` y `status`.
- **PartnerCard Component:** Rediseño como "Módulo de Hardware". Contenedor de icono con borde matrix, punto de estado parpadeante, footer técnico con protocolo y status. Botón CTA estilo arcade mini con `font-vt323`.
- **Carousel:** Animación automática respetando `prefers-reduced-motion`. Badge "Infraestructura Bitcoin Only" con `ShieldCheck` y glow naranja. Dots indicadores estilizados con sombra activa.
- **DS Compliance:** Eliminación total de colores no aprobados (cian/púrpura). Paleta restringida a Matrix Green + Bitcoin Orange. Jerarquía tipográfica institucional/técnica/retro aplicada correctamente.
- **Files Modified:** `components/ui/PartnerCard.tsx`, `components/sections/PartnersCarousel.tsx`, `data/partners.ts`.

#### 3. ArcadeButton & MatrixArcadeWhatsApp — Hardware Metaphor
- **ArcadeButton:** Reparación de problema de texto encimado. Implementación de metáfora "chasis + tapa mecánica" con elevación `-translate-y-2` y acople en active. Scanline optimizada usando `animate-scanline` de globals.css.
- **WhatsApp Widget:** Reposicionamiento de label debajo del switch para legibilidad. Integración de status badge dentro del label. Icono de teléfono cyberpunk optimizado para nitidez en tamaños pequeños.
- **Files Modified:** `components/ui/ArcadeButton.tsx`, `components/ui/MatrixArcadeWhatsApp.tsx`.

### 🔧 Technical Debt Addressed
- Eliminación de deuda técnica en pagos: cero API keys en repo, cero endpoints de facturación.
- Limpieza de código obsoleto: marcado `route.ts` y `lib/blink.ts` como deprecated (pendiente de eliminación tras confirmar webhooks).
- Accesibilidad: Todos los componentes nuevos respetan `prefers-reduced-motion` y tienen focus states visibles con `ring-matrix`.

### 🎨 Design System v2.0 Enforcement
- **Colores:** Prohibición explícita de cian/púrpura en componentes públicos. Solo Matrix Green (#00FF41) y Bitcoin Orange (#F7931A) permitidos.
- **Tipografía:** Serif = autoridad, Mono = sistema, VT323 = acción retro. Regla aplicada en todos los componentes modificados.
- **Efectos:** Glow semántico por contexto (naranja para valor, verde para infraestructura). Grid background matrix en tarjetas técnicas.

### ⚠️ Pending Actions
- [ ] Eliminar `app/api/tipjar/route.ts` y `lib/blink.ts` tras configurar webhook en Blink dashboard.
- [ ] Verificar que `tailwind.config.ts` tenga mapeadas correctamente las fuentes `vt323`, `fira-code`, `ibm-plex-serif`.
- [ ] Testear `MatrixArcadeWhatsApp` en iOS Safari para confirmar deep-linking funcional.

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
| `PriceConverter` | — | — | — | ✅ OK (datos estáticos al montar, sin mismatches) |
| `TimechainBlock` | — | — | ✅ (via `memo`) | ✅ OK |

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
| `ArcadeButton` href required error | `Property 'href' is missing` en hackathon edition pages | Hecho `href` opcional para soportar tanto Link como button modes |

### Issues Abiertos

| Prioridad | Descripción |
|-----------|-------------|
| 🟡 Media | API de registro hackathon son stubs (no persisten datos) |
| 🟡 Media | Integración real de webhooks de Discord para registros |

---

## ⚠️ Referencia: Errores React UMD #425, #418, #423 y NotFoundError

### Códigos de Error y Causas Raíz

| Error | Significado | Causa Típica |
|-------|-------------|--------------|
| **#425** | Cannot insert component into DOM | SSR/CSR mismatch - estructura de árbol diferente entre servidor y cliente |
| **#418** | Cannot remove node at this time | Nodo DOM no existe o fue removido externamente |
| **#423** | Hydration mismatch | HTML del servidor no coincide con lo esperado por el cliente |
| **NotFoundError** | insertBefore/removeChild failed | Cascada por #423 - React intenta operar en nodo inexistente |

### Soluciones Implementadas

1. **React.memo → memo import** (`60ccb9a`):
   ```tsx
   // ❌ Incorrecto - causa error UMD global
   import React from 'react';
   const Memoized = React.memo(Component);
   
   // ✅ Correcto - import nombrado
   import { memo } from 'react';
   const Memoized = memo(Component);
   ```

2. **Tipos de metadata alignados** (`2496da6`):
   ```typescript
   // Agregado 'general' para consistencia SSR/CSR
   export interface BlinkInvoiceMetadata {
     service?: 'general' | 'consultoria' | 'curso' | 'diseno' | 'charla' | 'donacion';
   }
   ```

3. **Patrón isMounted para valores dinámicos**:
   ```tsx
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);
   // Render consistente tanto en SSR como CSR
   ```

### Prevenir Futuros Errores

- Usar siempre `memo` importado de React, nunca `React.memo`
- Evitar valores dinámicos (`new Date()`, `Math.random()`) en render sin guards
- Incluir `suppressHydrationWarning` solo cuando sea necesario y documentado
- Verificar que tipos TypeScript coincidan entre interfaces y esquemas Zod

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
- **Fix crítico de tipos**: Agregado `'general'` al enum de servicios y `expiresAt: string | null` en metadata

### 2. Backend de Pagos

**app/api/tipjar/route.ts:**
- Añadida validación con Zod
- Mejor manejo de errores y logging
- Respuestas más completas y consistentes

**lib/blink.ts:**
- Soporte real de Stablesats (lnUsdInvoiceCreate)
- Integración con precio actual de Binance (eliminado hardcode)
- **Agregado `'general'` a `BlinkInvoiceMetadata` interface y `SERVICE_LABELS`**
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

### 5. Fixes Técnicos Mayores

- **React.memo → memo**: Reemplazado `React.memo` por `memo` importado de React para resolver error UMD global en Next.js
- Todos los componentes ahora usan patrones correctos de hidratación SSR/CSR

### 6. Configuración y Mantenimiento

- Actualizado .env.example con Lightning Address correcto (aceptabitcoin@blink.sv) y mejor organización
- Alineación general con Design System "Bitcoin Matrix" (colores, tipografía, glassmorphism, scanlines, etc.)

**Estado actual:** Gran avance en pulido visual, consistencia de marca y experiencia de usuario. La Caja Registradora ya se siente como un producto soberano y profesional.

### 7. Actualizaciones finales de mayo 2026
- Eliminado Footer duplicado en `page.tsx` (manejado en layout)
- Restaurada estructura de producción del homepage con integración de MarketMood educativo y PartnersCarousel
- Corrección de imports y adición de props requeridos en layout
- Restaurada estructura site con Navbar, Footer, Bob Chat y Section Headers; integración de Educational MarketMood y PartnersCarousel
- Actualización de MarketMood a modo educativo y PartnersCarousel
- Alineación de Footer con DS v2.0, enlace Discord, eliminación de secciones muertas, optimización de tailwind
- Actualización de URLs de registro de hackathon en `.env.example` y en página
- Actualización de CTA de EditionHero a registro Luma
- Adición de guards de hidratación a Hero y GoogleFormButton per MANTENIMIENTO.md
- Adición de guards de hidratación a EditionHero per MANTENIMIENTO.md
- Documentación de fix de ArcadeButton href
- `ArcadeButton`: hecho `href` opcional para soportar tanto Link como button modes
- Actualización de páginas de edición de hackathon y TipJarSection
- Limpieza de formato y manejo de errores en TipJarSection
- Resolución de bloqueo de input controlado en campos de moneda
- Documentación de códigos de error React UMD (#425, #418, #423) y NotFoundError
- Actualización de MANTENIMIENTO.md con estado actual y recientes fixes
- Fijación de mismatches dinámicos de tiempo y fecha en PriceConverter usando `isMounted`
- Uso de `memo` import en lugar de `React.memo` para resolver error UMD global
- Integración de Blink.sv GraphQL API y fijación de mismatches de hidratación en flujo de pago
- Eliminación de prop `density` obsoleta y fijación de `string.getTime()` en CountdownTimer
- Resolución de errores React #425/#423 en CountdownTimer + MatrixRain
- Migración de hackathon de route group `(hackathon)` a flat `app/hackathon/`
- Eliminación de route group para mapear correctamente a `/hackathon`
- Implementación robusta de CountdownTimer
- Adición de página 404 personalizada
- Actualización de CTA de hero con enlace a eventos Luma
- Corrección de import predeterminado para MatrixRain y fijación de tipo `isActive`
- Resolución de errores de tipo enum Zod en esquema de validación
- Corrección de import predeterminado para Navbar y Footer en layout
- Resolución de advertencia TS posiblemente undefined en EditionHero

---

## 🔄 Últimos Commits Relevantes

| Hash | Mensaje |
|------|---------|
| `1cf8f6c` | refactor(tipjar): migrate to serverless blink POS architecture (v2.1) |
| `d8f857a` | docs: update documentation and finalize merchant onboarding form with Google Forms integration |
| `0ecc2a7` | fix: remove duplicate Footer from page.tsx (handled in layout) |
| `96cbae3` | feat: restore production homepage structure and integrate Educational MarketMood + PartnersCarousel |
| `e999651` | fix: correct imports for layout and add required props to components |
| `42e04da` | fix: restore site structure with Navbar, Footer, Bob Chat and Section Headers; integrate Educational MarketMood and PartnersCarousel |
| `5869bbe` | feat: update MarketMood to educational mode and integrate PartnersCarousel |
| `bccbcc1` | chore(ui): align Footer with DS v2.0, add Discord link, remove dead sections, optimize tailwind config |
| `516a676` | fix: update hackathon registration URLs in .env.example |
| `79c2263` | fix: update hackathon registration URLs (Hero CTA + Edition config) |
| `a9de1f3` | fix(hackathon): EditionHero CTA → Luma registration (kzdw3pek) |
| `c722423` | fix(hackathon): add hydration guards to Hero and GoogleFormButton per MANTENIMIENTO.md |
| `a5786f7` | fix(hackathon): add hydration guards to EditionHero per MANTENIMIENTO.md |
| `5aa9722` | docs: document ArcadeButton href fix in maintenance log |
| `a267cd5` | fix(ArcadeButton): make href optional to support both Link and button modes |
| `6668def` | feat: update hackathon edition pages and TipJarSection |
| `9f53ca5` | style(tipjar): cleanup formatting and error handling in TipJarSection |
| `7e5de69` | fix(oracle): resolve controlled input blocking on currency fields |
| `e8df9bb` | docs: document React UMD error codes (#425, #418, #423) and NotFoundError solutions |
| `acf8d30` | docs: update MANTENIMIENTO.md with current project state and recent fixes |
| `fd512d6` | fix(hydration): resolve dynamic time and date mismatches in PriceConverter using isMounted |
| `60ccb9a` | fix: use memo import instead of React.memo to resolve UMD global type error |

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