import path from 'path';
import { GeminiAuditorEngine } from '../evaluator/gemini_engine.js';
import { PdfReportGenerator } from '../reports/pdf_generator.js';

async function testLiveAudit() {
  console.log('🧪 Iniciando prueba de auditoría viva con OpenRouter (Gemini 2.5 Flash)...');

  const auditor = new GeminiAuditorEngine();
  const pdfMuestra = path.resolve(process.cwd(), 'storage/matrices_generadas/Matriz_AS-SM-18-2026-ESSALUD-RAL-1.pdf');

  console.log(`📄 Analizando archivo: ${pdfMuestra}`);

  const matriz = await auditor.auditarBasesPdf(pdfMuestra, {
    nomenclatura: 'AS-SM-18-2026-ESSALUD/RAL-1',
    entidad: 'Seguro Social de Salud - Red Asistencial Almenara',
    valor_referencial_pen: 980500
  });

  console.log('\n✅ MATRIZ DE CUMPLIMIENTO EXTRAÍDA EXITOSAMENTE:');
  console.log(`- Semáforo General: ${matriz.semaforo_general}`);
  console.log(`- Score de Viabilidad: ${matriz.score_viabilidad_porcentaje}%`);
  console.log(`- Total Requisitos Extraídos: ${matriz.requisitos_tecnicos.length}`);
  console.log(`- Alertas y Penalidades Detectadas: ${matriz.alertas_y_penalidades.length}`);
  console.log(`- Resumen Ejecutivo: ${matriz.resumen_ejecutivo.slice(0, 120)}...`);

  const pdfSalida = path.resolve(process.cwd(), 'storage/matrices_generadas/Auditoria_Viva_OpenRouter.pdf');
  await PdfReportGenerator.generarPdf(matriz, pdfSalida);
  console.log(`\n🎉 PDF pericial regenerado en: ${pdfSalida}`);
}

testLiveAudit().catch((err) => {
  console.error('❌ Error en auditoría viva:', err);
  process.exit(1);
});
