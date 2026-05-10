# Mantenimiento: Acepta Bitcoin México (Oracle System v2.0)

Estado actual del proyecto — última actualización: 2026-05-08

---

## 📋 Estado General

| Área | Estado | Notas |
|------|--------|-------|
| **Build (npm run build)** | ✅ Pasando | 0 errores TypeScript, 0 warnings de hidratación |
| **Tipado (TypeScript strict)** | ✅ Sin errores | `tsconfig.json` en modo estricto |
| **Linting** | ✅ Sin errores bloqueadores | — |
| **Tests (Vitest)** | ✅ `app/api/tipjar/route.test.ts` | — |
| **Despliegue (Vercel)** | ✅ Configurado | Variables de entorno: `BTCMAP_API_KEY`, `NEXT_PUBLIC_TIP_JAR_LN_ADDRESS` |

---

## 🔧 Stack Técnico

- **Framework**: Next.js 14.2.3 (App Router)
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: Tailwind CSS con animaciones custom (`scanline`, `blink`, `tilt`)
- **UI**: shadcn/ui + componentes custom (ArcadeButton, MatrixRain, Logo)
- **Pagos**: Blink.sv (GraphQL API — Lightning + On-chain)
- **Datos de mercado**: Binance API (BTC/USD, indicador DCA)
- **QR Codes**: `qrcode.react` (client-only)
- **Mapas**: Leaflet + react-leaflet + BTC Map API v1
- **Reservas**: Cal.com (iframe embebido)
- **Testing**: Vitest
- **Monitoreo**: Sentry
- **Email**: Resend

---

## 🔩 Componentes Principales — Estado de Hydratación

Todos los componentes que renderizan datos dinámicos o dependientes del navegador incluyen protección SSR/CSR:

| Componente | Guard `isMounted` | `suppressHydrationWarning` | `dynamic ssr:false` | Estado |
|------------|-------------------|---------------------------|---------------------|--------|
| `MatrixRain` | ✅ | ✅ | — | ✅ OK |
| `TipJarSection` | ✅ | ✅ | — | ✅ OK |
| `MarketMoodWidget` | — | — | ✅ (via `next/dynamic`) | ✅ OK |
| `MarketMoodInfoPopover` | — | ✅ (en interactive elements) | — | ✅ OK |
| `QRCodeSVG` (en TipJar) | ✅ (renderizado condicional `isMounted`) | ✅ | — | ✅ OK |

---

## 📁 Estructura de Rutas Activas

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/` | `app/(site)/page.tsx` | ✅ Oracle v2.0 — Homepage |
| `/aprende` | `app/(site)/aprende/page.tsx` | ✅ Bitcoin Arcade + Visionary AI |
| `/mapa` | `app/(site)/mapa/page.tsx` | ✅ BTC Merchant Map |
| `/tianguis` | `app/(site)/tianguis/page.tsx` | ✅ Nostr + Lightning Marketplace |
| `/proyectos` | `app/(site)/proyectos/page.tsx` + `ProyectosClient.tsx` | ✅ Community Projects |
| `/crea-tu-tienda` | `app/(site)/crea-tu-tienda/page.tsx` | ✅ Merchant Onboarding |
| `/agenda` | `app/agenda/page.tsx` | ✅ Cal.com Booking |
| `/nuestra-historia` | `app/nuestra-historia/page.tsx` | ✅ Project History |
| `/proveedores` | `app/proveedores/page.tsx` + `ProveedoresClient.tsx` | ✅ Sovereign Directory |
| `/api/tipjar` | `app/api/tipjar/route.ts` | ✅ Blink.sv Proxy |
| `/api/webhook/lnbits` | `app/api/webhook/lnbits.ts` | ✅ Webhook Handler |

---

## 🧹 Tareas de Mantenimiento Pendientes / Sugeridas

### Prioridad Alta
- [ ] **Validar claves de API**: Confirmar que `BTCMAP_API_KEY` y `NEXT_PUBLIC_TIP_JAR_LN_ADDRESS` están configuradas en producción (Vercel env vars)
- [ ] **Revisar dependencias**: Ejecutar `npm outdated` y actualizar parches de seguridad
- [ ] **Backups de datos**: Verificar respaldo periódico de datos de proveedores (si aplica)

### Prioridad Media
- [ ] **Optimización de imágenes**: Convertir imágenes estáticas a formato WebP/AVIF
- [ ] **SEO meta tags**: Revisar que cada ruta tenga `<title>` y `<meta description>` únicos
- [ ] **Analytics**: Considerar integración de analytics (Plausible / Umami — privacidad-friendly)
- [ ] **Accesibilidad (a11y)**: Auditar con `axe-core` o Lighthouse para contraste de colores y ARIA labels

### Prioridad Baja
- [ ] **Internacionalización**: Evaluar soporte multi-idioma (es/en)
- [ ] **Service Worker**: Implementar caché offline para páginas estáticas
- [ ] **PWA**: Agregar `manifest.json` e íconos para instalación en dispositivos móviles
- [ ] **Docs**: Completar `docs/` con guías de contribución y despliegue detalladas

---

## 🐛 Issues Conocidos / Resueltos

### Resueltos Recientemente
| Issue | Descripción | Commit |
|-------|-------------|--------|
| #418 / #423 | React hydration errors en componentes client-only | `0e7f8c6` — `fix(ui): resolve React hydration errors` |
| — | TipJarSection hydration mismatch por renderizado de QR durante SSR | Resuelto con `isMounted` state guard + `dynamic ssr:false` |
| — | MarketMoodWidget hydration por acceso a `window`/`localStorage` | Resuelto con `next/dynamic` y `ssr: false` |
| — | Build error: `MatrixRainProps` type missing | Resuelto restaurando interfaz + constante `CHARS` |

---

## 🔄 Últimos Commits Relevantes

| Hash | Mensaje |
|------|---------|
| `0e7f8c6` | fix(ui): resolve React hydration errors #418/#423 |
| `af3daa0` | feat(proyectos): align /proyectos with Bitcoin Matrix design |
| `fdd59b3` | feat(arcade): migrate aprende to Bitcoin Arcade |
| `602dc01` | feat(ui): navbar domain styling, market mood, tipjar blink integration |
| `516a1d1` | feat(core): refactor static data loading, add tests, Sentry |

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

# 5. Build de producción
npm run build
npm start
```

---

*Documentación generada automáticamente. Actualizar tras cada deploy significativo.*