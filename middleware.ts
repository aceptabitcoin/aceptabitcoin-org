import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAccessMode, hasAccess, getAccessRedirect } from '@/lib/ahorro/access';
import { AHORRO_CONFIG } from '@/lib/ahorro/constants';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 🔒 Headers de seguridad globales (OWASP recomendado)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // 🛡️ Protección del módulo Ahorro (Feature Flag + Cookie)
  if (request.nextUrl.pathname.startsWith('/ahorro/dashboard')) {
    const mode = getAccessMode();
    const accessCookie = request.cookies.get(AHORRO_CONFIG.cookieName)?.value;
    const access = hasAccess(mode, accessCookie);

    if (!access.granted) {
      const redirectUrl = new URL(getAccessRedirect(mode), request.url);
      redirectUrl.searchParams.set('callback', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 🌐 Preparación para Rate Limiting (v2)
  // Aquí iría integración con @upstash/ratelimit o Vercel KV
  // Ej: if (await isRateLimited(request)) return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });

  return response;
}

export const config = {
  matcher: [
    // Rutas protegidas por middleware
    '/ahorro/dashboard/:path*',
    // Futuro: '/api/chat', '/api/tipjar'

    // Excluir estáticos, imágenes y rutas de Next.js
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
