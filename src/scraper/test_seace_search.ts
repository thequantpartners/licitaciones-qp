import { chromium } from 'playwright';
import fs from 'fs';

async function testSearchSeace() {
  console.log('Iniciando búsqueda en vivo en SEACE...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    await page.goto('https://prodapp2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/buscadorPublico.xhtml', {
      timeout: 45000,
      waitUntil: 'networkidle'
    });

    console.log('Página cargada. Seleccionando pestaña: Buscador de Procedimientos de Selección...');
    
    // Hacer clic en la pestaña "Buscador de Procedimientos de Selección"
    const tabProcedimientos = page.locator('a:has-text("Buscador de Procedimientos de Selección")');
    await tabProcedimientos.click();

    // Esperar a que la pestaña esté activa y el formulario sea visible
    await page.waitForTimeout(2000);

    console.log('Ingresando objeto de contratación: MEDICO...');
    const inputDesc = page.locator('input[id*="idFormBuscarProceso:descripcionObjeto"]');
    await inputDesc.waitFor({ state: 'visible', timeout: 10000 });
    await inputDesc.fill('MEDICO');

    // Botón Buscar
    console.log('Haciendo clic en Buscar...');
    const btnBuscar = page.locator('button[id="tbBuscador:idFormBuscarProceso:btnBuscarSelToken"]');
    await btnBuscar.click();

    console.log('Esperando resultados de SEACE (AJAX)...');
    await page.waitForTimeout(6000);

    // Capturar screenshot de los resultados
    await page.screenshot({ path: './storage/seace_resultados.png' });
    console.log('Screenshot guardado en storage/seace_resultados.png');

    // Extraer resultados de la tabla
    const rows = await page.locator('tbody[id*="dtProceso"] tr, tbody[id*="tblResultados"] tr, tbody[id*="Proceso"] tr').evaluateAll((trs) =>
      trs.map(tr => {
        const tds = Array.from(tr.querySelectorAll('td')).map((td: any) => td.innerText.trim());
        return tds;
      }).filter(tds => tds.length > 2)
    );

    console.log(`\n🎉 Procedimientos encontrados: ${rows.length}`);
    rows.slice(0, 5).forEach((cols, idx) => {
      console.log(`\n--- [Licitación #${idx + 1}] ---`);
      console.log(`Entidad: ${cols[1] || 'N/A'}`);
      console.log(`Nomenclatura: ${cols[2] || 'N/A'}`);
      console.log(`Objeto/Descripción: ${cols[4] || cols[3] || 'N/A'}`);
      console.log(`Valor / Fecha: ${cols[6] || cols[5] || 'N/A'}`);
      console.log(`Columnas raw:`, cols.join(' | '));
    });

  } catch (err: any) {
    console.error('Error durante la búsqueda:', err.message);
  } finally {
    await browser.close();
  }
}

testSearchSeace();
