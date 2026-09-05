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
  private async extraerTextoConPaginas(pdfBuffer: Buffer): Promise<{ textoTotal: string; numPaginas: number }> {
    const uint8Array = new Uint8Array(pdfBuffer);
    const { text, totalPages } = await extractText(uint8Array);

    let textoEstructurado = '';
    text.forEach((paginaTexto, index) => {
      textoEstructurado += `\n\n=== PÁGINA ${index + 1} ===\n${paginaTexto}`;
    });

    return {
      textoTotal: textoEstructurado,
      numPaginas: totalPages
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
    const { textoTotal, numPaginas } = await this.extraerTextoConPaginas(pdfBuffer);
    console.log(`[Auditor Engine] Documento procesado: ${numPaginas} páginas extraídas.`);

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

    const userPrompt = `
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

    const isScanned = textoTotal.trim().length < 500;
    if (isScanned) {
      console.log(`[Auditor Engine] Documento escaneado detectado (${textoTotal.trim().length} chars). Activando modo Multimodal RAG con visión nativa...`);
    }

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
    const validada = MatrizCumplimientoSchema.parse(parsed);
    return validada;
  }
}
