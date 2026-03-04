import { NextRequest, NextResponse } from 'next/server';

// Mock users for testing
const mockUsers = [
  {
    id: '1',
    email: 'admin@meey.dz',
    firstName: 'Admin',
    lastName: 'MEEY',
    phone: '+213612345678',
    role: 'admin',
    isActive: true,
  },
  {
    id: '2',
    email: 'client@meey.dz',
    firstName: 'Selma',
    lastName: 'Ahmed',
    phone: '+213612345679',
    role: 'client',
    isActive: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user by email
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Email ou mot de passe incorrect',
        },
        { status: 401 }
      );
    }

    // For mock API, any password works (in production, verify password hash)
    if (!password) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'Le mot de passe est requis',
        },
        { status: 400 }
      );
    }

    // Create a mock JWT token
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(
      JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      })
    ).toString('base64');
    const signature = Buffer.from('mock-signature').toString('base64');
    const accessToken = `${header}.${payload}.${signature}`;

    const response = NextResponse.json(
      {
        statusCode: 200,
        message: 'Connexion réussie',
        data: {
          user,
          accessToken,
          refreshToken: `refresh-${Date.now()}`,
        },
      },
      { status: 200 }
    );

    // Set token as cookie
    response.cookies.set('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        statusCode: 500,
        message: 'Erreur de connexion',
      },
      { status: 500 }
    );
  }
}
