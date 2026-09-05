import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawIdentifier = (body.identifier || '').trim();

    if (!rawIdentifier) {
      return NextResponse.json(
        { error: 'Por favor, ingresa un RUC o clave de acceso corporativa.' },
        { status: 400 }
      );
    }

    // Limpiar dígitos si es RUC o tomar slug
    const cleanDigits = rawIdentifier.replace(/\D/g, '');
    const cleanSlug = rawIdentifier.toLowerCase().replace(/[^a-z0-9-]/g, '');

    // 1. Buscar por RUC de 11 dígitos
    let query = supabaseAdmin.from('tenants').select('*');
    
    if (cleanDigits.length === 11) {
      query = query.eq('ruc', cleanDigits);
    } else {
      query = query.or(`slug.eq.${cleanSlug},ruc.eq.${cleanDigits || 'none'}`);
    }

    const { data: tenant, error } = await query.maybeSingle();

    if (error) {
      console.error('[Auth API] Error consultando tenant:', error.message);
      return NextResponse.json(
        { error: 'Error interno de validación. Intente nuevamente.' },
        { status: 500 }
      );
    }

    if (!tenant) {
      return NextResponse.json({
        success: false,
        notFound: true,
        identifier: rawIdentifier,
        message: `El RUC o identificador "${rawIdentifier}" no cuenta con radar pericial activo en esta versión.`,
      });
    }

    return NextResponse.json({
      success: true,
      redirectUrl: `/portal/${tenant.slug}`,
      tenant: {
        slug: tenant.slug,
        nombre_comercial: tenant.nombre_comercial,
        ruc: tenant.ruc,
        rubro: tenant.rubro,
      },
    });
  } catch (err: any) {
    console.error('[Auth API] Excepción en login:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
