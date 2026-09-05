import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { MatrizCumplimiento } from '../types/licitacion.js';

export class PdfReportGenerator {
  /**
   * Genera el PDF ejecutivo a partir de una MatrizCumplimiento
   */
  static async generarPdf(matriz: MatrizCumplimiento, rutaSalidaPdf: string): Promise<string> {
    const htmlContent = this.construirHtml(matriz);

    // Asegurar directorio de salida
    const dir = path.dirname(rutaSalidaPdf);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle' });

    await page.pdf({
      path: rutaSalidaPdf,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        bottom: '15mm',
        left: '15mm',
        right: '15mm'
      }
    });

    await browser.close();
    return rutaSalidaPdf;
  }

  private static construirHtml(m: MatrizCumplimiento): string {
    // Determinar color de semáforo
    let semaforoBadgeClass = 'badge-verde';
    let semaforoTexto = 'VIABLE (PRESENTAR OFERTA)';
    if (m.semaforo_general === 'AMARILLO_SUBSANABLE') {
      semaforoBadgeClass = 'badge-amarillo';
      semaforoTexto = 'SUBSANABLE / REVISIÓN ESPECIAL';
    } else if (m.semaforo_general === 'ROJO_NO_VIABLE') {
      semaforoBadgeClass = 'badge-rojo';
      semaforoTexto = 'NO VIABLE (RIESGO DE DESCALIFICACIÓN)';
    }

    const rowsRtm = m.requisitos_tecnicos
      .map(
        (r) => `
      <tr>
        <td style="text-align:center; font-weight:bold;">${r.item_num}</td>
        <td>
          <strong>${r.categoria}</strong><br/>
          <span>${r.descripcion}</span>
        </td>
        <td style="text-align:center;"><span class="badge-tag">${r.pagina_bases}</span></td>
        <td>
          <span class="badge-${r.nivel_criticidad === 'CRITICO_EXCLUYENTE' ? 'rojo' : 'amarillo'}">
            ${r.nivel_criticidad.replace('_', ' ')}
          </span>
        </td>
        <td><small>${r.documento_acreditacion_exigido}</small></td>
      </tr>
    `
      )
      .join('');

    const cardsAlertas = m.alertas_y_penalidades
      .map(
        (a) => `
      <div class="alert-box alert-${a.impacto_riesgo.toLowerCase()}">
        <div class="alert-header">
          <span class="badge-alerta">${a.tipo.replace('_', ' ')}</span>
          <strong>${a.titulo}</strong> (Pág. ${a.pagina_bases})
        </div>
        <p class="alert-desc">${a.descripcion}</p>
        <div class="alert-action">
          <strong>Acción Estratégica:</strong> ${a.recomendacion_accion}
        </div>
      </div>
    `
      )
      .join('');

    const rowsFactores = m.factores_evaluacion
      .map(
        (f) => `
      <tr>
        <td><strong>${f.criterio}</strong></td>
        <td style="text-align:center; font-weight:bold; color:#0f766e;">${f.puntaje_maximo} pts</td>
        <td><small>${f.como_maximizar}</small></td>
      </tr>
    `
      )
      .join('');

    const rowsChecklist = m.checklist_documentos
      .map(
        (c) => `
      <tr>
        <td><strong>${c.documento}</strong></td>
        <td style="text-align:center;">
          <span class="${c.obligatorio ? 'badge-rojo' : 'badge-amarillo'}">
            ${c.obligatorio ? 'OBLIGATORIO' : 'OPCIONAL'}
          </span>
        </td>
        <td><small>${c.detalles_subsanacion}</small></td>
      </tr>
    `
      )
      .join('');

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Matriz de Cumplimiento - ${m.nomenclatura}</title>
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { color: #1e293b; background: #ffffff; margin: 0; padding: 0; font-size: 11pt; line-height: 1.4; }
    
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-end; }
    .brand { font-size: 16pt; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    .brand span { color: #0284c7; }
    .doc-type { font-size: 9pt; text-transform: uppercase; color: #64748b; font-weight: 700; }

    .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 18px; }
    .summary-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; align-items: center; }
    .meta-title { font-size: 13pt; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    .meta-sub { font-size: 9pt; color: #475569; }
    
    .score-box { text-align: right; }
    .score-value { font-size: 24pt; font-weight: 900; color: #0f172a; line-height: 1; }
    
    .badge-verde { background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 8.5pt; display: inline-block; }
    .badge-amarillo { background: #fef9c3; color: #854d0e; padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 8.5pt; display: inline-block; }
    .badge-rojo { background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 8.5pt; display: inline-block; }
    .badge-tag { background: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 3px; font-weight: 600; font-size: 8pt; }

    h2 { font-size: 12pt; font-weight: 800; color: #0f172a; border-left: 4px solid #0284c7; padding-left: 8px; margin-top: 18px; margin-bottom: 10px; }
    p.exec-summary { font-size: 9.5pt; color: #334155; background: #f0fdf4; border-left: 3px solid #22c55e; padding: 8px 12px; margin-bottom: 16px; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 8.5pt; }
    th { background: #0f172a; color: #ffffff; text-align: left; padding: 6px 8px; font-weight: 600; font-size: 8pt; text-transform: uppercase; }
    td { border-bottom: 1px solid #e2e8f0; padding: 6px 8px; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }

    .alert-box { border-radius: 6px; padding: 10px; margin-bottom: 10px; font-size: 8.5pt; }
    .alert-alto { background: #fef2f2; border: 1px solid #fecaca; }
    .alert-medio { background: #fffbeb; border: 1px solid #fde68a; }
    .alert-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .badge-alerta { background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px; font-weight: 800; font-size: 7.5pt; }
    .alert-desc { margin: 0 0 6px 0; color: #374151; }
    .alert-action { background: #ffffff; padding: 6px 8px; border-radius: 4px; border-left: 3px solid #0284c7; font-size: 8pt; }

    .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; font-size: 7.5pt; color: #94a3b8; }
    .page-break { page-break-after: always; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div>
      <div class="brand">LICITACIONES <span>QP</span></div>
      <div class="doc-type">Informe Pericial de Auditoría & Matriz de Cumplimiento</div>
    </div>
    <div style="text-align:right;">
      <small style="color:#64748b;">Generado: ${new Date().toLocaleDateString('es-PE')}</small>
    </div>
  </div>

  <!-- SUMMARY CARD -->
  <div class="summary-card">
    <div class="summary-grid">
      <div>
        <div class="meta-title">${m.nomenclatura}</div>
        <div class="meta-sub">
          <strong>Entidad:</strong> ${m.entidad}<br/>
          <strong>Valor Estimado/Referencial:</strong> S/. ${m.valor_referencial_pen.toLocaleString('es-PE')}<br/>
        </div>
      </div>
      <div class="score-box">
        <div class="score-value">${m.score_viabilidad_porcentaje}%</div>
        <div style="margin-top:4px;"><span class="${semaforoBadgeClass}">${semaforoTexto}</span></div>
      </div>
    </div>
  </div>

  <!-- RESUMEN EJECUTIVO -->
  <h2>1. Resumen Ejecutivo (Dictamen Estratégico)</h2>
  <p class="exec-summary">${m.resumen_ejecutivo}</p>

  <!-- ALERTAS Y PENALIDADES -->
  <h2>2. Radar de Cláusulas Tóxicas, Plazos y Penalidades</h2>
  ${cardsAlertas}

  <!-- RTM TABLE -->
  <h2>3. Matriz de Requisitos Técnicos Mínimos (RTM - Cap. III)</h2>
  <table>
    <thead>
      <tr>
        <th style="width:5%;">#</th>
        <th style="width:40%;">Requisito Solicitado</th>
        <th style="width:10%; text-align:center;">Pág.</th>
        <th style="width:15%;">Criticidad</th>
        <th style="width:30%;">Documento Acreditación Exigido</th>
      </tr>
    </thead>
    <tbody>
      ${rowsRtm}
    </tbody>
  </table>

  <!-- FACTORES DE EVALUACIÓN Y CHECKLIST -->
  <h2>4. Factores de Evaluación de Puntaje (Cap. IV)</h2>
  <table>
    <thead>
      <tr>
        <th style="width:30%;">Criterio</th>
        <th style="width:15%; text-align:center;">Puntaje Máx.</th>
        <th style="width:55%;">Estrategia para Obtener el Máximo Puntaje</th>
      </tr>
    </thead>
    <tbody>
      ${rowsFactores}
    </tbody>
  </table>

  <h2>5. Checklist Preventivo de Documentos Obligatorios</h2>
  <table>
    <thead>
      <tr>
        <th style="width:40%;">Documento o Declaración Jurada</th>
        <th style="width:15%; text-align:center;">Condición</th>
        <th style="width:45%;">Verificación Formal y Subsanación</th>
      </tr>
    </thead>
    <tbody>
      ${rowsChecklist}
    </tbody>
  </table>

  <!-- CONCLUSIÓN Y ACCIÓN -->
  <div style="background:#f1f5f9; border-radius:6px; padding:10px; margin-top:14px; font-size:9pt;">
    <strong>Directriz Inmediata:</strong> ${m.conclusiones_y_siguiente_paso}
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span>Documento de uso confidencial para alta dirección comercial.</span>
    <span>Licitaciones QP Engine &bull; Auditoría Determinista</span>
  </div>

</body>
</html>
    `;
  }
}
