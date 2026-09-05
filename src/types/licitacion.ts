import { z } from 'zod';

/**
 * Esquema de Metadatos de la Convocatoria en SEACE
 */
export const ConvocatoriaMetadataSchema = z.object({
  id: z.string().describe("Identificador único de la convocatoria (ej. AS-SM-12-2026-ESSALUD)"),
  nomenclatura: z.string().describe("Nomenclatura oficial en SEACE"),
  entidad: z.string().describe("Nombre de la entidad convocante"),
  objeto: z.enum(["BIEN", "SERVICIO", "OBRA", "CONSULTORIA"]).describe("Objeto de contratación"),
  descripcion: z.string().describe("Descripción del requerimiento"),
  valor_referencial_pen: z.number().describe("Monto en Soles (PEN)"),
  moneda: z.string().default("PEN"),
  fecha_publicacion: z.string().describe("Fecha y hora de publicación"),
  fecha_cierre_presentacion: z.string().describe("Fecha límite de presentación de propuestas"),
  enlace_seace: z.string().optional().describe("URL directa de la ficha"),
  ruta_pdf_bases: z.string().describe("Ruta local del PDF descargado de las bases")
});

export type ConvocatoriaMetadata = z.infer<typeof ConvocatoriaMetadataSchema>;

/**
 * Requisito Técnico Mínimo (RTM) - Capítulo III
 */
export const RequisitoTecnicoSchema = z.object({
  item_num: z.number().describe("Número secuencial del requisito"),
  categoria: z.string().describe("Categoría (ej. Especificación Técnica, Registro Sanitario, Personal Clave, Experiencia del Postor)"),
  descripcion: z.string().describe("Descripción exacta del requerimiento solicitado"),
  pagina_bases: z.string().describe("Página exacta o rango de páginas donde se encuentra en el PDF"),
  nivel_criticidad: z.enum(["CRITICO_EXCLUYENTE", "SUBSANABLE", "PUNTAJE_ADICIONAL"]),
  documento_acreditacion_exigido: z.string().describe("Documento exigido para acreditarlo (ej. Registro Sanitario Digemid, Copia simple de contrato con constancia de conformidad)"),
  observacion_estrategica: z.string().describe("Recomendación de Smith para asegurar el 100% de cumplimiento o advertencia de vicio")
});

export type RequisitoTecnico = z.infer<typeof RequisitoTecnicoSchema>;

/**
 * Trampa, Penalidad o Cláusula de Alto Riesgo
 */
export const TrampaPenalidadSchema = z.object({
  tipo: z.enum(["PENALIDAD_LEONINA", "PLAZO_CRITICO", "DIRECCIONAMIENTO_SOSPECHOSO", "GARANTIA_EXCESIVA"]),
  titulo: z.string().describe("Título corto del riesgo"),
  descripcion: z.string().describe("Detalle de la cláusula y por qué representa peligro financiero o de descalificación"),
  pagina_bases: z.string().describe("Página exacta en el documento oficial"),
  impacto_riesgo: z.enum(["ALTO", "MEDIO", "BAJO"]),
  recomendacion_accion: z.string().describe("Acción recomendada: Formular consulta u observación formal ante comité, o subsanar internamente")
});

export type TrampaPenalidad = z.infer<typeof TrampaPenalidadSchema>;

/**
 * Factor de Evaluación de Puntaje - Capítulo IV
 */
export const FactorEvaluacionSchema = z.object({
  criterio: z.string().describe("Nombre del criterio (ej. Precio, Plazo de Entrega, Mejoras Técnicas, ISO 9001)"),
  puntaje_maximo: z.number().describe("Puntos máximos asignables"),
  como_maximizar: z.string().describe("Cómo asegurar el puntaje máximo en este criterio")
});

export type FactorEvaluacion = z.infer<typeof FactorEvaluacionSchema>;

/**
 * Documentos Obligatorios de la Oferta (Checklist)
 */
export const DocumentoChecklistSchema = z.object({
  documento: z.string().describe("Nombre del documento o declaración jurada (ej. Anexo N° 2, Carta Fianza, Constancia RNP)"),
  obligatorio: z.boolean(),
  detalles_subsanacion: z.string().describe("Detalles específicos a verificar (firmas, folios, vigencias)")
});

export type DocumentoChecklist = z.infer<typeof DocumentoChecklistSchema>;

/**
 * Matriz Completa de Cumplimiento y Auditoría de Licitación
 */
export const MatrizCumplimientoSchema = z.object({
  convocatoria_id: z.string(),
  nomenclatura: z.string(),
  entidad: z.string(),
  valor_referencial_pen: z.number(),
  semaforo_general: z.enum(["VERDE_VIABLE", "AMARILLO_SUBSANABLE", "ROJO_NO_VIABLE"]),
  score_viabilidad_porcentaje: z.number().min(0).max(100),
  resumen_ejecutivo: z.string().describe("Síntesis de alto nivel para el Gerente General y Director Comercial"),
  requisitos_tecnicos: z.array(RequisitoTecnicoSchema),
  alertas_y_penalidades: z.array(TrampaPenalidadSchema),
  factores_evaluacion: z.array(FactorEvaluacionSchema),
  checklist_documentos: z.array(DocumentoChecklistSchema),
  conclusiones_y_siguiente_paso: z.string().describe("Directriz de acción inmediata para el equipo de licitaciones")
});

export type MatrizCumplimiento = z.infer<typeof MatrizCumplimientoSchema>;
