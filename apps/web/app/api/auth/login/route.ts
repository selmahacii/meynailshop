import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/api/auth/login`, {
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
    const response = NextResponse.json(
      { statusCode: 200, message: 'Connexion réussie', data },
      { status: 200 }
    );

    if (accessToken) {
      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json({ statusCode: 500, message: 'Erreur de connexion' }, { status: 500 });
  }
}
