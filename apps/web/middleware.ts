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

  // Protect admin routes
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!token) {
        console.log('[MIDDLEWARE DEBUG] Admin route blocked: No token');
        return NextResponse.redirect(new URL('/connexion?redirect=/admin', request.url));
    }

    try {
      // Use atob instead of Buffer for Edge Runtime compatibility
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      
      console.log(`[MIDDLEWARE DEBUG] Decoded payload:`, payload);

      if (payload.role !== 'admin') {
        console.warn(`[MIDDLEWARE DEBUG] Admin route blocked: Improper role [${payload.role}]`);
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      console.log('[MIDDLEWARE DEBUG] Admin route allowed');
    } catch (e) {
      console.error('[MIDDLEWARE DEBUG] Token decoding failed:', e);
      return NextResponse.redirect(new URL('/connexion', request.url));
    }
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
