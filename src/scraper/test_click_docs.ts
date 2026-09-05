import { chromium } from 'playwright';
import fs from 'fs';

async function testClickDocsLink() {
  console.log('Probando clic en "Ver documentos del procedimiento" (j_idt661)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    acceptDownloads: true
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

    console.log('Haciendo clic en "Ver documentos del procedimiento" (j_idt661)...');
    const linkDocs = page.locator('a[id*="j_idt661"], a:has-text("Ver documentos del procedimiento")').first();
    await linkDocs.click();
    await page.waitForTimeout(6000);

    console.log('URL tras clic en j_idt661:', page.url());
    console.log('Título tras clic en j_idt661:', await page.title());

    await page.screenshot({ path: './storage/seace_tras_click_docs.png', fullPage: true });
    console.log('Screenshot guardado en storage/seace_tras_click_docs.png');

    // Listar todos los enlaces/botones en esta nueva vista
    const docLinks = await page.locator('a, button, input[type="image"]').evaluateAll(els =>
      els.map(el => ({
        tag: el.tagName,
        id: el.id,
        text: el.innerText?.trim() || '',
        title: el.getAttribute('title') || '',
        onclick: el.getAttribute('onclick') || ''
      })).filter(e => e.text || e.title || e.onclick.includes('PrimeFaces'))
    );

    console.log('Elementos interactivos detectados en la vista de documentos:', JSON.stringify(docLinks.slice(0, 20), null, 2));

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

testClickDocsLink();
