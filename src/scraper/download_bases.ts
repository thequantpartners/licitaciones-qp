import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function extractBasesFromFicha() {
  console.log('Ingresando a la Ficha de Selección para descargar las Bases...');
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

    // Clic en la Ficha de Selección de la Licitación 1
    console.log('Abriendo Ficha de Selección...');
    const btnFicha = page.locator('img[id*="grafichaSel"]').first();
    await btnFicha.click();
    await page.waitForTimeout(6000);

    console.log('Página actual:', page.url());

    // Extraer todos los enlaces, botones y texto de documentos en la Ficha
    const docElements = await page.locator('a, button, input[type="image"]').evaluateAll(els =>
      els.map(el => ({
        tagName: el.tagName,
        id: el.id,
        text: el.innerText?.trim() || '',
        title: el.getAttribute('title') || '',
        onclick: el.getAttribute('onclick') || '',
        href: el.getAttribute('href') || ''
      })).filter(e => e.text.toLowerCase().includes('base') || e.text.toLowerCase().includes('tdr') || e.text.toLowerCase().includes('documento') || e.title.toLowerCase().includes('descarga') || e.title.toLowerCase().includes('base') || e.onclick.toLowerCase().includes('descarga'))
    );

    console.log('Documentos/Bases detectados:', JSON.stringify(docElements, null, 2));

    // Tomar screenshot de la Ficha
    await page.screenshot({ path: './storage/seace_ficha_documentos.png', fullPage: true });
    console.log('Screenshot de la ficha completa guardado en storage/seace_ficha_documentos.png');

    // Listar tablas y encabezados presentes
    const tablesInfo = await page.locator('table').evaluateAll(tbls =>
      tbls.map(t => ({
        id: t.id,
        headers: Array.from(t.querySelectorAll('th')).map((th: any) => th.innerText.trim()),
        rowCount: t.querySelectorAll('tr').length
      })).filter(t => t.headers.length > 0)
    );
    console.log('Tablas en la Ficha:', JSON.stringify(tablesInfo, null, 2));

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

extractBasesFromFicha();
