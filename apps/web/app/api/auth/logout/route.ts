import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    {
      statusCode: 200,
      message: 'Déconnecté avec succès',
    },
    { status: 200 }
  );

  // Clear token cookie
  response.cookies.set('accessToken', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
