import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/compte', '/admin'];
const AUTH_ROUTES = ['/connexion', '/inscription'];
const ADMIN_ROUTES = ['/admin'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('accessToken')?.value;

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/connexion?redirect=/admin', request.url));
    }

    // Verify admin role via middleware (additional check)
    // In production, decode JWT to verify role
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
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
