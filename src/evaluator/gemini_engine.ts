import fs from 'fs';
import path from 'path';
import { extractText } from 'unpdf';
import { MatrizCumplimiento, MatrizCumplimientoSchema } from '../types/licitacion.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Motor de Auditoría y Cotejo con Gemini 2.5 Flash a través de OpenRouter
 */
export class GeminiAuditorEngine {
  private openRouterKey: string;
  private model: string;

  constructor(apiKey?: string, model = 'google/gemini-2.5-flash') {
    this.openRouterKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    this.model = process.env.OPENROUTER_MODEL || model;
  }

  /**
   * Extrae el texto del PDF paginado para que el LLM sepa con exactitud el número de página de cada cláusula
   */
  private async extraerTextoConPaginas(pdfBuffer: Buffer): Promise<{ textoTotal: string; numPaginas: number; caracteresReales: number }> {
    const uint8Array = new Uint8Array(pdfBuffer);
    const { text, totalPages } = await extractText(uint8Array);

    let textoEstructurado = '';
    let caracteresReales = 0;
    text.forEach((paginaTexto, index) => {
      caracteresReales += paginaTexto.trim().length;
      textoEstructurado += `\n\n=== PÁGINA ${index + 1} ===\n${paginaTexto}`;
    });

    return {
      textoTotal: textoEstructurado,
      numPaginas: totalPages,
      caracteresReales
    };
  }

  /**
   * Audita las bases integradas de una licitación y genera la Matriz de Cumplimiento
   */
  async auditarBasesPdf(
    pdfPath: string,
    metadata: {
      nomenclatura: string;
      entidad: string;
      valor_referencial_pen: number;
    }
  ): Promise<MatrizCumplimiento> {
    if (!this.openRouterKey) {
      throw new Error(
        'OPENROUTER_API_KEY no configurada. Por favor verifica tu archivo .env'
      );
    }

    if (!fs.existsSync(pdfPath)) {
      throw new Error(`El archivo PDF no existe en la ruta: ${pdfPath}`);
    }

    console.log(`[Auditor Engine] Extrayendo páginas y estructura de: ${path.basename(pdfPath)}...`);
    const pdfBuffer = fs.readFileSync(pdfPath);
    const { textoTotal, numPaginas, caracteresReales } = await this.extraerTextoConPaginas(pdfBuffer);
    console.log(`[Auditor Engine] Documento procesado: ${numPaginas} páginas (${caracteresReales} caracteres de texto digital).`);

    const systemPrompt = `
Eres Smith, socio auditor legal y técnico de élite especializado en Contrataciones con el Estado Peruano (Ley N° 30225 y su Reglamento).
Tu cometido es auditar las BASES ADMINISTRATIVAS INTEGRADAS adjuntas para una empresa proveedora de equipos médicos y tecnología.

DEBES ANALIZAR DETERMINÍSTICAMENTE EL DOCUMENTO:
1. Localiza el CAPÍTULO III (Requerimientos Técnicos Mínimos - RTM):
   - Extrae cada especificación técnica, certificación obligatoria (Digemid, ISO, FDA, CE), experiencia del postor y personal clave.
   - Indica el NÚMERO DE PÁGINA EXACTO donde se encuentra en el PDF basándote en los marcadores "=== PÁGINA X ===".
2. Detecta CLÁUSULAS TÓXICAS, TRAMPAS Y PENALIDADES:
   - Penalidades diarias atípicas o excesivas (ej. penalidades por demoras menores a 48h).
   - Plazos de entrega irreales (ej. entregas en provincias en menos de 15 días para bienes importados).
   - Requisitos con presunto direccionamiento a una marca o fabricante específico.
3. Extrae los FACTORES DE EVALUACIÓN (Capítulo IV) para maximizar puntaje.
4. Genera el CHECKLIST DE DOCUMENTOS OBLIGATORIOS de presentación para evitar descalificaciones por forma.
5. Emite un RESUMEN EJECUTIVO directo, quirúrgico y orientado a negocio para el Gerente General.

REGLA DE ORO:
- Sé 100% preciso con el número de página de cada hallazgo.
- Cero alucinaciones. Si algo no se especifica en las bases, indícalo expresamente.
- Devuelve la respuesta EXCLUSIVAMENTE en formato JSON válido que cumpla con la estructura de la Matriz de Cumplimiento.
`;

    const isScanned = caracteresReales < 1000;
    if (isScanned) {
      console.log(`[Auditor Engine] Documento escaneado detectado (${caracteresReales} caracteres legibles). Activando visión multimodal nativa...`);
    }

    const userPrompt = isScanned
      ? `
Audita este expediente oficial escaneado adjunto mediante visión pericial de documentos:
- Nomenclatura: ${metadata.nomenclatura}
- Entidad: ${metadata.entidad}
- Valor Referencial: S/. ${metadata.valor_referencial_pen.toLocaleString('es-PE')}
- Total Páginas: ${numPaginas}

INSTRUCCIONES CLAVE DE AUDITORÍA:
1. Revisa minuciosamente los folios y páginas del documento PDF adjunto.
2. Localiza la sección de TDR / Requerimientos Técnicos Mínimos (Capítulo III), las penalidades (Capítulo III / Proforma de Contrato), los Factores de Evaluación (Capítulo IV) y los documentos obligatorios de presentación.
3. Extrae la información con exactitud pericial, indicando las páginas reales del PDF de cada hallazgo.
4. Devuelve la matriz EXCLUSIVAMENTE en el formato JSON especificado.

Devuelve el JSON con este esquema exacto:
{
  "convocatoria_id": "${metadata.nomenclatura}",
  "nomenclatura": "${metadata.nomenclatura}",
  "entidad": "${metadata.entidad}",
  "valor_referencial_pen": ${metadata.valor_referencial_pen},
  "semaforo_general": "VERDE_VIABLE" | "AMARILLO_SUBSANABLE" | "ROJO_NO_VIABLE",
  "score_viabilidad_porcentaje": number,
  "resumen_ejecutivo": "string",
  "requisitos_tecnicos": [
    {
      "item_num": 1,
      "categoria": "string",
      "descripcion": "string",
      "pagina_bases": "string (ej. Pág. 42)",
      "nivel_criticidad": "CRITICO_EXCLUYENTE" | "SUBSANABLE" | "PUNTAJE_ADICIONAL",
      "documento_acreditacion_exigido": "string",
      "observacion_estrategica": "string"
    }
  ],
  "alertas_y_penalidades": [
    {
      "tipo": "PENALIDAD_LEONINA" | "PLAZO_CRITICO" | "DIRECCIONAMIENTO_SOSPECHOSO" | "GARANTIA_EXCESIVA",
      "titulo": "string",
      "descripcion": "string",
      "pagina_bases": "string (ej. Pág. 68)",
      "impacto_riesgo": "ALTO" | "MEDIO" | "BAJO",
      "recomendacion_accion": "string"
    }
  ],
  "factores_evaluacion": [
    {
      "criterio": "string",
      "puntaje_maximo": number,
      "como_maximizar": "string"
    }
  ],
  "checklist_documentos": [
    {
      "documento": "string",
      "obligatorio": true,
      "detalles_subsanacion": "string"
    }
  ],
  "conclusiones_y_siguiente_paso": "string"
}
`
      : `
Audita este expediente oficial:
- Nomenclatura: ${metadata.nomenclatura}
- Entidad: ${metadata.entidad}
- Valor Referencial: S/. ${metadata.valor_referencial_pen.toLocaleString('es-PE')}
- Total Páginas: ${numPaginas}

TEXTO COMPLETO DE LAS BASES:
${textoTotal}

Devuelve el JSON con este esquema exacto:
{
  "convocatoria_id": "${metadata.nomenclatura}",
  "nomenclatura": "${metadata.nomenclatura}",
  "entidad": "${metadata.entidad}",
  "valor_referencial_pen": ${metadata.valor_referencial_pen},
  "semaforo_general": "VERDE_VIABLE" | "AMARILLO_SUBSANABLE" | "ROJO_NO_VIABLE",
  "score_viabilidad_porcentaje": number,
  "resumen_ejecutivo": "string",
  "requisitos_tecnicos": [
    {
      "item_num": 1,
      "categoria": "string",
      "descripcion": "string",
      "pagina_bases": "string (ej. Pág. 42)",
      "nivel_criticidad": "CRITICO_EXCLUYENTE" | "SUBSANABLE" | "PUNTAJE_ADICIONAL",
      "documento_acreditacion_exigido": "string",
      "observacion_estrategica": "string"
    }
  ],
  "alertas_y_penalidades": [
    {
      "tipo": "PENALIDAD_LEONINA" | "PLAZO_CRITICO" | "DIRECCIONAMIENTO_SOSPECHOSO" | "GARANTIA_EXCESIVA",
      "titulo": "string",
      "descripcion": "string",
      "pagina_bases": "string (ej. Pág. 68)",
      "impacto_riesgo": "ALTO" | "MEDIO" | "BAJO",
      "recomendacion_accion": "string"
    }
  ],
  "factores_evaluacion": [
    {
      "criterio": "string",
      "puntaje_maximo": number,
      "como_maximizar": "string"
    }
  ],
  "checklist_documentos": [
    {
      "documento": "string",
      "obligatorio": true,
      "detalles_subsanacion": "string"
    }
  ],
  "conclusiones_y_siguiente_paso": "string"
}
`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    if (isScanned) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:application/pdf;base64,${pdfBuffer.toString('base64')}`
            }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: userPrompt
      });
    }

    console.log(`[Auditor Engine] Enviando solicitud pericial a OpenRouter (${this.model})...`);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://thequantpartners.com',
        'X-Title': 'Licitaciones QP Engine'
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error en OpenRouter API (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as any;
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter devolvió una respuesta vacía.');
    }

    console.log(`[Auditor Engine] Respuesta recibida. Validando determinismo con Zod...`);
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Normalizar semáforo si viene en formato libre
    if (parsed.semaforo_general) {
      const s = String(parsed.semaforo_general).toUpperCase();
      if (s.includes('ROJO') || s.includes('NO VIABLE')) parsed.semaforo_general = 'ROJO_NO_VIABLE';
      else if (s.includes('AMARILLO') || s.includes('SUBSANABLE')) parsed.semaforo_general = 'AMARILLO_SUBSANABLE';
      else parsed.semaforo_general = 'VERDE_VIABLE';
    }

    // Asegurar compatibilidad de arrays
    if (!Array.isArray(parsed.requisitos_tecnicos)) parsed.requisitos_tecnicos = [];
    if (!Array.isArray(parsed.alertas_y_penalidades)) parsed.alertas_y_penalidades = [];
    if (!Array.isArray(parsed.factores_evaluacion)) parsed.factores_evaluacion = [];
    if (!Array.isArray(parsed.checklist_documentos)) parsed.checklist_documentos = [];

    const validada = MatrizCumplimientoSchema.parse(parsed);
    return validada;
  }
}
