import { AccessMode, UserAccess } from './types';
import { AHORRO_CONFIG, ACCESS_MODES } from './constants';

export function getAccessMode(): AccessMode {
  const envMode = process.env.NEXT_PUBLIC_AHORRO_ACCESS_MODE as AccessMode | undefined;
  return envMode && envMode in ACCESS_MODES ? envMode : 'open';
}

export function hasAccess(mode: AccessMode, cookie?: string | null): UserAccess {
  // v1: modo abierto = siempre concede acceso
  if (mode === 'open') {
    return { granted: true, method: 'open' };
  }

  // v1.5/v2: validar cookie de sesión
  const hasCookie = cookie === 'true';
  
  return {
    granted: hasCookie,
    method: mode,
    expiresAt: hasCookie ? Date.now() + AHORRO_CONFIG.cookieMaxAgeDays * 86400000 : undefined,
  };
}

export function getAccessRedirect(mode: AccessMode): string {
  switch (mode) {
    case 'open': return '/ahorro/dashboard';
    case 'invite': return '/ahorro/access';
    case 'payment': return '/ahorro/access';
    default: return '/ahorro/access';
  }
}
