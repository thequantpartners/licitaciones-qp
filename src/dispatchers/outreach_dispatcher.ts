import { MatrizCumplimiento } from '../types/licitacion.js';

export interface OutreachContact {
  nombre_destinatario: string;
  cargo: string;
  empresa: string;
  telefono_whatsapp?: string;
  email?: string;
}

export class OutreachDispatcher {
  /**
   * Genera el payload de mensaje listo para WhatsApp Ejecutivo
   */
  static generarMensajeWhatsApp(
    m: MatrizCumplimiento,
    contacto: OutreachContact,
    enlaceDescargaPdf: string
  ): string {
    const primeraAlerta = m.alertas_y_penalidades[0];
    const textoAlerta = primeraAlerta
      ? `⚠️ *Alerta en Pág. ${primeraAlerta.pagina_bases}:* ${primeraAlerta.titulo} (${primeraAlerta.descripcion.slice(0, 110)}...)`
      : 'Bases revisadas con semáforo verde en requisitos técnicos.';

    return `Estimado(a) ${contacto.nombre_destinatario}, gusto en saludarte.

Vi que en ${contacto.empresa} participan activamente en licitaciones de salud/equipamiento con el Estado.

Ayer se publicó en SEACE la convocatoria *${m.nomenclatura}* de *${m.entidad}* (Valor referencial: *S/. ${m.valor_referencial_pen.toLocaleString('es-PE')}*).

Nuestro sistema de auditoría analizó el expediente y les preparó la *Matriz de Cumplimiento Técnico*:
✅ *Viabilidad:* Califican con ${m.score_viabilidad_porcentaje}% de compatibilidad.
${textoAlerta}

Te dejo el *Informe Pericial en PDF (3 págs)* para que tu equipo técnico no tenga que invertir 4 horas leyendo las bases:
📄 Descargar Matriz: ${enlaceDescargaPdf}

Monitoreamos y auditamos el SEACE todas las mañanas para evitar descalificaciones a proveedores calificados. Si te resulta útil para tu equipo de licitaciones, coméntame.

Un saludo cordial,
*Kenneth & Smith*
Licitaciones QP | Inteligencia para Contrataciones Públicas`;
  }

  /**
   * Genera el contenido listo para Correo Electrónico
   */
  static generarEmailEjecutivo(
    m: MatrizCumplimiento,
    contacto: OutreachContact,
    enlaceDescargaPdf: string
  ): { asunto: string; cuerpoTexto: string } {
    const primeraAlerta = m.alertas_y_penalidades[0];

    const asunto = `[${contacto.empresa}] + ${m.nomenclatura} (${m.entidad}) - Matriz de Cumplimiento lista`;
    const cuerpoTexto = `Estimado(a) ${contacto.nombre_destinatario},

Le escribo porque revisando los registros públicos del OSCE/SEACE, identificamos que ${contacto.empresa} compite con éxito en convocatorias de equipamiento e insumos médicos ante entidades del sector salud.

Ayer a última hora se publicaron las bases de la convocatoria:
- Convocatoria: ${m.nomenclatura}
- Entidad: ${m.entidad}
- Valor Referencial: S/. ${m.valor_referencial_pen.toLocaleString('es-PE')}

Para evitar que su equipo pase entre 4 y 6 horas revisando el PDF de más de 100 páginas, nuestro motor de inteligencia procesó el expediente completo y generó la Matriz de Cumplimiento Técnico:

1. COMPATIBILIDAD TÉCNICA: ${m.score_viabilidad_porcentaje}% de cumplimiento en requisitos mínimos.
2. ALERTA CRÍTICA: En la página ${primeraAlerta?.pagina_bases || '1'}, se identificó: "${primeraAlerta?.titulo || 'Condición especial'}" que puede generar penalidad o descalificación si no se subsana a tiempo.
3. INFORME ADJUNTO: Le comparto el PDF ejecutivo de auditoría en el siguiente enlace:
${enlaceDescargaPdf}

Procesamos a diario todas las convocatorias del SEACE para proteger la adjudicación de proveedores estratégicos. Si desea que le enviemos este reporte cada mañana para su rubro, responda a este correo o escríbanos directamente.

Atentamente,

Kenneth
Co-Fundador | Licitaciones QP
Email: contacto@licitacionesqp.com`;

    return { asunto, cuerpoTexto };
  }
}
