import { chromium } from 'playwright';

async function inspectFichaSections() {
  console.log('Inspeccionando secciones y acordeones de fichaSeleccion.xhtml...');
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

    const tabProcedimientos = page.locator('a:has-text("Buscador de Procedimientos de Selección")');
    await tabProcedimientos.click();
    await page.waitForTimeout(2000);

    const inputDesc = page.locator('input[id*="idFormBuscarProceso:descripcionObjeto"]');
    await inputDesc.fill('MEDICO');

    const btnBuscar = page.locator('button[id="tbBuscador:idFormBuscarProceso:btnBuscarSelToken"]');
    await btnBuscar.click();
    await page.waitForTimeout(6000);

    console.log('Abriendo Ficha de Selección...');
    const btnFicha = page.locator('img[id*="grafichaSel"]').first();
    await btnFicha.click();
    await page.waitForTimeout(6000);

    // Listar todos los encabezados y acordeones
    const headers = await page.locator('.ui-accordion-header, .ui-tabs-nav li, h3, fieldset legend, .ui-panel-title').allInnerTexts();
    console.log('Secciones/Paneles en la Ficha:', headers.map(h => h.trim()).filter(Boolean));

    // Revisar qué elementos contienen el texto "Documento" o "Bases"
    const docClickables = await page.locator(':has-text("Documento"), :has-text("Bases")').evaluateAll(els =>
      els.filter(e => e.tagName === 'A' || e.tagName === 'H3' || e.tagName === 'SPAN' || e.tagName === 'DIV' && e.className.includes('header'))
         .map(e => ({ tag: e.tagName, text: e.innerText?.trim().slice(0, 50), id: e.id, class: e.className }))
    );
    console.log('Elementos relacionados con Documentos/Bases:', docClickables.slice(0, 15));

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

inspectFichaSections();
