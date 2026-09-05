import { chromium } from 'playwright';

async function testSearchSeace() {
  console.log('Iniciando búsqueda en vivo en SEACE...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://prodapp2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/buscadorPublico.xhtml', {
      timeout: 40000,
      waitUntil: 'networkidle'
    });

    console.log('Ingresando criterios de búsqueda para Salud / EsSalud...');

    // 1. Filtrar por descripción del objeto: "MEDICO"
    const inputDesc = page.locator('input[id="tbBuscador:idFormBuscarProceso:descripcionObjeto"]');
    await inputDesc.fill('MEDICO');

    // 2. Click en botón Buscar
    console.log('Haciendo clic en Buscar...');
    const btnBuscar = page.locator('button[id="tbBuscador:idFormBuscarProceso:btnBuscarSel"]');
    await btnBuscar.click();

    // Esperar respuesta de tabla PrimeFaces AJAX
    await page.waitForTimeout(6000);

    // Buscar filas en la tabla de resultados
    const filas = await page.locator('tbody[id*="dtProcesos_data"] tr, tbody[id*="tblResultados_data"] tr, div[id*="dtProceso"] tr').evaluateAll((rows) =>
      rows.map((r) => r.innerText.trim())
    );

    console.log(`\n🎉 Resultados encontrados: ${filas.length} procedimientos en SEACE`);
    filas.slice(0, 5).forEach((f, idx) => {
      console.log(`\n[Procedimiento #${idx + 1}]`);
      console.log(f.replace(/\n+/g, ' | '));
    });

  } catch (err: any) {
    console.error('Error durante la búsqueda:', err.message);
  } finally {
    await browser.close();
  }
}

testSearchSeace();
