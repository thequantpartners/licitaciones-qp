#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { SeaceScraper } from '../scraper/seace_browser.js';
import { GeminiAuditorEngine } from '../evaluator/gemini_engine.js';
import { PdfReportGenerator } from '../reports/pdf_generator.js';
import { OutreachDispatcher } from '../dispatchers/outreach_dispatcher.js';
import { MatrizCumplimiento } from '../types/licitacion.js';

async function main() {
  const args = process.argv.slice(2);
  const modeIndex = args.indexOf('--mode');
  const mode = modeIndex !== -1 ? args[modeIndex + 1] : 'demo';

  console.log('================================================================');
  console.log('🏛️  LICITACIONES QP | ENGINE DE AUDITORÍA & INTELIGENCIA B2B');
  console.log('================================================================');
  console.log(`Modo de ejecución: ${mode.toUpperCase()}\n`);

  const storageDir = path.resolve(process.cwd(), 'storage/matrices_generadas');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  if (mode === 'demo' || mode === 'test') {
    console.log('▶️  Paso 1: Simulando ingesta de convocatoria real de EsSalud...');
    const scraper = new SeaceScraper();
    const convocatorias = await scraper.buscarConvocatoriasRecientes({ sector: 'salud' });
    const conv = convocatorias[0];

    console.log(`✅ Convocatoria detectada: ${conv.nomenclatura}`);
    console.log(`   Entidad: ${conv.entidad}`);
    console.log(`   Valor Referencial: S/. ${conv.valor_referencial_pen.toLocaleString('es-PE')}`);
    console.log(`   Objeto: ${conv.objeto}\n`);

    console.log('▶️  Paso 2: Generando Matriz de Cumplimiento Determinista...');

    // Matriz pericial real basada en el estándar de bases de EsSalud para monitores biomédicos
    const matrizDemo: MatrizCumplimiento = {
      convocatoria_id: conv.id,
      nomenclatura: conv.nomenclatura,
      entidad: conv.entidad,
      valor_referencial_pen: conv.valor_referencial_pen,
      semaforo_general: 'AMARILLO_SUBSANABLE',
      score_viabilidad_porcentaje: 88,
      resumen_ejecutivo:
        'El requerimiento solicita Monitores Multiparámetros modulares de grado hospitalario para UCI. El postor cuenta con el equipamiento homologado, pero las bases contienen una cláusula de penalidad atípica por demora en la calibración que debe ser observada antes del cierre.',
      requisitos_tecnicos: [
        {
          item_num: 1,
          categoria: 'Registro Sanitario & Digemid',
          descripcion:
            'Registro Sanitario vigente emitido por Digemid para monitores y módulos de capnografía.',
          pagina_bases: 'Pág. 42',
          nivel_criticidad: 'CRITICO_EXCLUYENTE',
          documento_acreditacion_exigido:
            'Copia simple de Registro Sanitario o Certificado de Registro emitido por DIGEMID.',
          observacion_estrategica:
            'Verificar que el nombre comercial coincida exactamente con el catálogo ofertado.'
        },
        {
          item_num: 2,
          categoria: 'Certificaciones de Fábrica',
          descripcion:
            'Certificado de Buenas Prácticas de Manufactura (BPM) del fabricante extranjero o ISO 13485:2016.',
          pagina_bases: 'Pág. 45',
          nivel_criticidad: 'CRITICO_EXCLUYENTE',
          documento_acreditacion_exigido:
            'Certificado ISO 13485 apostillado o con legalización consular y traducción jurada oficial.',
          observacion_estrategica:
            'Ojo: Si el certificado está en inglés, la traducción simple causará descalificación automática según el OSCE.'
        },
        {
          item_num: 3,
          categoria: 'Soporte y Garantía Técnica',
          descripcion:
            'Garantía comercial mínima de 36 meses con stock de repuestos garantizado por 5 años en Lima.',
          pagina_bases: 'Pág. 51',
          nivel_criticidad: 'SUBSANABLE',
          documento_acreditacion_exigido:
            'Carta de compromiso del fabricante o representante autorizado en el Perú.',
          observacion_estrategica:
            'Exigencia estándar. Se cumple con la carta matriz de representación.'
        },
        {
          item_num: 4,
          categoria: 'Experiencia del Postor en la Especialidad',
          descripcion:
            'Acreditar facturación acumulada equivalente a 1 vez el valor referencial (S/. 980,500) en ventas similares durante los últimos 8 años.',
          pagina_bases: 'Pág. 58',
          nivel_criticidad: 'CRITICO_EXCLUYENTE',
          documento_acreditacion_exigido:
            'Máximo 20 contrataciones acompañadas de su respectiva conformidad o comprobantes cancelados.',
          observacion_estrategica:
            'Revisar que las facturas adjunten el voucher de depósito o sello de pagado para no invalidar folios.'
        }
      ],
      alertas_y_penalidades: [
        {
          tipo: 'PENALIDAD_LEONINA',
          titulo: 'Penalidad del 2% diario por demora en atención técnica',
          descripcion:
            'El numeral 8.4 estipula que ante una falla en UCI, el reemplazo debe ser en 12 horas o se aplicará multa del 2% del monto contractual por cada día de mora.',
          pagina_bases: 'Pág. 68',
          impacto_riesgo: 'ALTO',
          recomendacion_accion:
            'Formular Consulta y Observación formal en la etapa correspondiente para ampliar el plazo de respuesta a 24-48 horas conforme a las directivas del OSCE.'
        },
        {
          tipo: 'PLAZO_CRITICO',
          titulo: 'Plazo de entrega perentorio de 15 días calendario',
          descripcion:
            'Para equipos de importación, 15 días tras la orden de compra es un plazo que genera alto riesgo de penalidad máxima (10%).',
          pagina_bases: 'Pág. 72',
          impacto_riesgo: 'ALTO',
          recomendacion_accion:
            'Presentar observación técnica solicitando mínimo 30 días calendario respaldado por tiempos de aduana.'
        }
      ],
      factores_evaluacion: [
        {
          criterio: 'Precio Ofertado',
          puntaje_maximo: 60,
          como_maximizar:
            'Ofertar al 90% del valor estimado otorga 60 puntos directos.'
        },
        {
          criterio: 'Mejoras Técnicas: Módulo BIS para anestesia',
          puntaje_maximo: 20,
          como_maximizar:
            'Incluir sin costo adicional el software de índice biespectral en el 100% de consolas.'
        },
        {
          criterio: 'Garantía Adicional (+12 meses)',
          puntaje_maximo: 20,
          como_maximizar:
            'Extender la garantía a 48 meses para asegurar los 20 puntos de factor de evaluación.'
        }
      ],
      checklist_documentos: [
        {
          documento: 'Anexo N° 1: Declaración Jurada de Datos del Postor',
          obligatorio: true,
          detalles_subsanacion: 'Firmado por representante legal con poder vigente.'
        },
        {
          documento: 'Anexo N° 2: Declaración Jurada de Cumplimiento de RTM',
          obligatorio: true,
          detalles_subsanacion: 'Indicar marca, modelo y país de procedencia exactos.'
        },
        {
          documento: 'Registro Sanitario Digemid + Ficha Técnica de Fábrica',
          obligatorio: true,
          detalles_subsanacion: 'Adjuntar folletería original traducida al español.'
        },
        {
          documento: 'Promesa Formal de Consorcio (Si aplica)',
          obligatorio: false,
          detalles_subsanacion: 'Firmas legalizadas notarialmente indicando porcentaje.'
        }
      ],
      conclusiones_y_siguiente_paso:
        'Procedimiento altamente rentable (margen proyectado: S/. 320,000). Es indispensable formular la observación a la penalidad del numeral 8.4 antes del jueves para blindar el contrato.'
    };

    console.log('▶️  Paso 3: Compilando Reporte Pericial en PDF Ejecutivo con Playwright...');
    const pdfPath = path.join(storageDir, `Matriz_${conv.id}.pdf`);
    await PdfReportGenerator.generarPdf(matrizDemo, pdfPath);
    console.log(`✅ PDF Ejecutivo generado exitosamente:`);
    console.log(`   📄 Ruta: ${pdfPath}\n`);

    console.log('▶️  Paso 4: Generando Mensaje de Outreach "Caballo de Troya"...');
    const contactoDemo = {
      nombre_destinatario: 'Carlos Mendoza',
      cargo: 'Gerente General',
      empresa: 'Medix Perú S.A.C.',
      telefono_whatsapp: '+51 987 654 321'
    };

    const mensajeWhatsApp = OutreachDispatcher.generarMensajeWhatsApp(
      matrizDemo,
      contactoDemo,
      `https://licitacionesqp.com/reportes/${conv.id}.pdf`
    );

    console.log('----------------------------------------------------------------');
    console.log('📲 COPY LISTO PARA WHATSAPP EJECUTIVO (Valor Anticipado):');
    console.log('----------------------------------------------------------------');
    console.log(mensajeWhatsApp);
    console.log('----------------------------------------------------------------\n');

    console.log('🎉 PIPELINE COMPLETADO CON ÉXITO.');
    console.log('   Sin n8n, sin dashboards pesados. Código puro, determinista y listo para operar.');
  } else if (mode === 'audit') {
    const pdfArgIndex = args.indexOf('--pdf');
    if (pdfArgIndex === -1) {
      console.error('❌ Error: Debes especificar el archivo PDF con --pdf <ruta>');
      process.exit(1);
    }
    const rutaPdf = args[pdfArgIndex + 1];
    const nomIndex = args.indexOf('--nomenclatura');
    const entIndex = args.indexOf('--entidad');
    const montoIndex = args.indexOf('--monto');

    const nomenclatura = nomIndex !== -1 ? args[nomIndex + 1] : 'CP SER-SM-3-2026-ESSALUD/RAPI-1';
    const entidad = entIndex !== -1 ? args[entIndex + 1] : 'Seguro Social de Salud - Red Asistencial Piura';
    const valorReferencial = montoIndex !== -1 ? parseFloat(args[montoIndex + 1]) : 2850000;

    console.log(`Iniciando auditoría pericial con Gemini 2.5 Flash para: ${path.basename(rutaPdf)}...`);
    console.log(`- Nomenclatura: ${nomenclatura}`);
    console.log(`- Entidad: ${entidad}`);
    console.log(`- Valor Referencial: S/. ${valorReferencial.toLocaleString('es-PE')}\n`);

    const auditor = new GeminiAuditorEngine();
    const matriz = await auditor.auditarBasesPdf(rutaPdf, {
      nomenclatura,
      entidad,
      valor_referencial_pen: valorReferencial
    });

    const safeFileName = `Auditoria_${nomenclatura.replace(/[\s\/\\:]/g, '_')}.pdf`;
    const pdfOut = path.join(storageDir, safeFileName);
    await PdfReportGenerator.generarPdf(matriz, pdfOut);

    const publicReportDir = path.resolve(process.cwd(), 'landing/public/reportes');
    if (!fs.existsSync(publicReportDir)) fs.mkdirSync(publicReportDir, { recursive: true });
    fs.copyFileSync(pdfOut, path.join(publicReportDir, safeFileName));

    console.log(`\n✅ Auditoría pericial completada.`);
    console.log(`📄 PDF generado: ${pdfOut}`);
    console.log(`🌐 Publicado en web: https://licitaciones.thequantpartners.com/reportes/${safeFileName}\n`);

    const contactoDemo = {
      nombre_destinatario: 'Gerente General / Jefe de Licitaciones',
      cargo: 'Dirección Comercial & Licitaciones',
      empresa: 'Proveedor del Rubro Biomédico',
      telefono_whatsapp: '+51 987 654 321'
    };

    const mensajeWhatsApp = OutreachDispatcher.generarMensajeWhatsApp(
      matriz,
      contactoDemo,
      `https://licitaciones.thequantpartners.com/reportes/${safeFileName}`
    );

    console.log('----------------------------------------------------------------');
    console.log('📲 COPY LISTO PARA WHATSAPP EJECUTIVO (Caballo de Troya):');
    console.log('----------------------------------------------------------------');
    console.log(mensajeWhatsApp);
    console.log('----------------------------------------------------------------\n');
  }
}

main().catch((err) => {
  console.error('❌ Error en el motor de Licitaciones QP:', err);
  process.exit(1);
});
