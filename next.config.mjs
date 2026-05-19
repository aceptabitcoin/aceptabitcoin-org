// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔒 1. Restringir dominios de imágenes (seguridad + rendimiento de caché)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'binance.com' },
      { protocol: 'https', hostname: '**.binance.com' },
      { protocol: 'https', hostname: 'nostr.build' },
      { protocol: 'https', hostname: 'image.nostr.build' },
      { protocol: 'https', hostname: 'cal.com' },
      { protocol: 'https', hostname: 'calendars.cal.com' },
    ],
  },

  // 🛡️ 2. Headers de seguridad básicos (no bloquean iframes de Cal.com)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },

  // 🧹 3. PWA: Deshabilitado por defecto según MANTENIMIENTO.md
  // Si en el futuro se activa, migrar a @ducanh2912/next-pwa (compatible con App Router)
};

export default nextConfig;