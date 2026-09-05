import { NextRequest, NextResponse } from 'next/server';
import { updateTenantWhatsAppNumber, supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { whatsapp, sendTestMessage } = body;

    if (!whatsapp) {
      return NextResponse.json({ error: 'Número de WhatsApp requerido' }, { status: 400 });
    }

    const result = await updateTenantWhatsAppNumber(slug, whatsapp);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      whatsapp: whatsapp.replace(/\D/g, ''),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
