import { MatrizCumplimientoSchema } from '../types/licitacion.js';

console.log('🧪 Iniciando prueba de validación de esquemas Zod...');

const muestraValida = {
  convocatoria_id: 'AS-SM-18-2026-ESSALUD',
  nomenclatura: 'AS-SM-18-2026-ESSALUD/RAL-1',
  entidad: 'Seguro Social de Salud',
  valor_referencial_pen: 450000,
  semaforo_general: 'VERDE_VIABLE',
  score_viabilidad_porcentaje: 95,
  resumen_ejecutivo: 'El postor cumple con el 100% de especificaciones de monitores.',
  requisitos_tecnicos: [
    {
      item_num: 1,
      categoria: 'Registro Sanitario',
      descripcion: 'Registro vigente Digemid',
      pagina_bases: 'Pág. 12',
      nivel_criticidad: 'CRITICO_EXCLUYENTE',
      documento_acreditacion_exigido: 'Copia simple',
      observacion_estrategica: 'Sin observaciones.'
    }
  ],
  alertas_y_penalidades: [
    {
      tipo: 'PENALIDAD_LEONINA',
      titulo: 'Penalidad mora',
      descripcion: 'Multa del 1% diario',
      pagina_bases: 'Pág. 24',
      impacto_riesgo: 'MEDIO',
      recomendacion_accion: 'Aceptar'
    }
  ],
  factores_evaluacion: [
    {
      criterio: 'Precio',
      puntaje_maximo: 100,
      como_maximizar: 'Mejor oferta'
    }
  ],
  checklist_documentos: [
    {
      documento: 'Anexo 1',
      obligatorio: true,
      detalles_subsanacion: 'Firma legalizada'
    }
  ],
  conclusiones_y_siguiente_paso: 'Presentar oferta el lunes.'
};

try {
  const parsed = MatrizCumplimientoSchema.parse(muestraValida);
  console.log('✅ Esquema Zod validado con éxito. Tipado 100% determinista.');
} catch (err) {
  console.error('❌ Error de validación Zod:', err);
  process.exit(1);
}
