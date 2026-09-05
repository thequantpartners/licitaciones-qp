import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'QP-ADMIN-2026';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key || key.trim() !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Clave maestra de administrador incorrecta.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Autenticación concedida.',
    });

    // Guardar cookie de sesión de administración
    response.cookies.set('qp_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('qp_admin_session');
  const isAuthenticated = cookie?.value === 'authenticated';

  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada.' });
  response.cookies.delete('qp_admin_session');
  return response;
}
