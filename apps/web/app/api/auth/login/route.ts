import { NextRequest, NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const defaultBackend = isProduction ? 'https://meeynailshop-api.onrender.com' : 'http://127.0.0.1:3001';
const BACKEND = process.env.NEXT_PUBLIC_API_URL || defaultBackend;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Normalize backend URL to avoid double /api
    const apiBase = BACKEND.endsWith('/api') ? BACKEND : `${BACKEND}/api`;
    
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { statusCode: res.status, message: data?.message || 'Auth failed' },
        { status: res.status }
      );
    }

    // Set httpOnly cookie with access token if provided by backend
    const accessToken = data?.data?.accessToken || data?.accessToken || null;
    // Return backend response directly to avoid triple nesting
    const response = NextResponse.json(data, { status: 200 });

    if (accessToken) {
      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    return response;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[API Proxy] Login error: ${errorMsg}`);
    return NextResponse.json({
      statusCode: 500,
      message: 'Le serveur est temporairement indisponible. Veuillez réessayer plus tard.',
      debugError: errorMsg,
      debugBackend: BACKEND,
      debugEnvUrl: process.env.NEXT_PUBLIC_API_URL || null,
      debugNodeEnv: process.env.NODE_ENV || null,
      debugVercel: process.env.VERCEL || null
    }, { status: 500 });
  }
}
