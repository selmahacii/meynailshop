import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/compte', '/admin', '/checkout'];
const AUTH_ROUTES = ['/connexion', '/inscription'];
const ADMIN_ROUTES = ['/admin'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('accessToken')?.value;

  // No longer redirecting away from auth pages to allow users to "repair" sessions
  // if store and cookies become inconsistent.

  console.log(`[MIDDLEWARE DEBUG] Requesting: ${pathname}, Authenticated: ${!!token}`);

  // Base64URL decoder for Edge Runtime
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      const padding = pad ? '='.repeat(4 - pad) : '';
      return JSON.parse(atob(base64 + padding));
    } catch (e) {
      return null;
    }
  };

  // Protect admin routes
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!token) {
        console.log('[MIDDLEWARE DEBUG] Admin route blocked: No token');
        return NextResponse.redirect(new URL('/connexion?redirect=/admin', request.url));
    }

    const payload = decodeJWT(token);
    console.log(`[MIDDLEWARE DEBUG] Decoded payload:`, payload);

    if (!payload || payload.role !== 'admin') {
      console.warn(`[MIDDLEWARE DEBUG] Admin route blocked: Improper role [${payload?.role || 'none'}]. REDIRECTING TO HOME.`);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    console.log('[MIDDLEWARE DEBUG] Admin route allowed');
  }

  // Protect user account routes
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL(`/connexion?redirect=${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
