import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, updateTenantWhatsAppNumber } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { whatsapp, consentimiento } = body;

    if (!whatsapp) {
      return NextResponse.json({ error: 'Por favor, ingrese un número de celular válido.' }, { status: 400 });
    }

    if (!consentimiento) {
      return NextResponse.json({
        error: 'Debe aceptar la cláusula de consentimiento conforme a la Ley N° 29733 para autorizar el envío de la demo.',
      }, { status: 400 });
    }

    // Limpiar dígitos
    let cleanNumber = whatsapp.replace(/\D/g, '');
    if (cleanNumber.length === 9) {
      cleanNumber = `51${cleanNumber}`;
    }

    if (cleanNumber.length < 11 || !cleanNumber.startsWith('519')) {
      return NextResponse.json({
        error: 'Ingrese un número celular peruano válido de 9 dígitos (ej. 987 654 321).',
      }, { status: 400 });
    }

    // Texto pericial de demostración legalmente blindado
    const pdfUrl = 'https://lovlsbjxzeiukygwpuvp.supabase.co/storage/v1/object/public/reportes-periciales/Auditoria_CP_SER-SM-3-2026-ESSALUD_RAPI-1.pdf';
    
    const mensajeDemo = `🏛️ *LICITACIONES QP • INFORME PERICIAL SEACE (DEMO)*\n\n` +
      `Estimado(a), ha solicitado probar el servicio de inteligencia y auditoría pericial de *The Quant Partners*.\n\n` +
      `📋 *Proceso Auditado:* CP SER-SM-3-2026-ESSALUD/RAPI-1\n` +
      `🏥 *Entidad:* EsSalud Piura - Hospital III José Cayetano Heredia\n` +
      `💰 *Valor Estimado:* S/. 2,850,000.00 PEN\n` +
      `🎯 *Dictamen:* SUBSANABLE (Score: 75/100)\n` +
      `⚠️ *Alertas Críticas Detectadas:* 8 penalidades (Mora 10%, Inasistencia 5% UIT/día, Acreditación Capital 2x).\n\n` +
      `📄 *Descargue el Informe Pericial A4 Completo:*\n${pdfUrl}\n\n` +
      `🔒 _Cláusula Legal (Ley N° 29733 y Ley N° 29571): Este mensaje ha sido enviado exclusivamente a su solicitud para fines de demostración técnica. No recibirá publicidad recurrente ni comunicaciones comerciales no autorizadas._`;

    // 1. Encolar en la tabla de despacho para el worker de Baileys
    const { error: queueError } = await supabaseAdmin
      .from('alertas_despacho')
      .insert({
        telefono: cleanNumber,
        tipo: 'DEMO_ESSALUD',
        mensaje: mensajeDemo,
        pdf_url: pdfUrl,
        consentimiento_ley29733: true,
        estado: 'PENDIENTE',
      });

    if (queueError) {
      console.error('[WhatsApp API] Error encolando alerta:', queueError.message);
    }

    // 2. Si no es el tenant de demostración genérico, actualizar su número en base de datos
    if (slug !== 'consorcio-medico') {
      await updateTenantWhatsAppNumber(slug, cleanNumber);
    }

    return NextResponse.json({
      success: true,
      message: `¡Alerta demo enviada con éxito a +${cleanNumber}! Revise su WhatsApp en 5-10 segundos.`,
      whatsapp: cleanNumber,
      waDirectLink: `https://wa.me/51924464410?text=${encodeURIComponent(`Hola Smith, he solicitado la demo pericial para el número +${cleanNumber}.`)}`,
    });
  } catch (error: any) {
    console.error('[WhatsApp API] Excepción:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
