import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function downloadDirectBases() {
  console.log('--- DESCARGA DETERMINISTA DE BASES Y ANEXOS DESDE SEACE ---');
  const browser = await chromium.launch({ headless: true });
  const downloadDir = path.resolve('./storage/raw_bases');
  if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    acceptDownloads: true
  });
  const page = await context.newPage();

  page.on('download', async (download) => {
    const filename = download.suggestedFilename();
    console.log(`\n🎉 ¡DESCARGA INICIADA!: ${filename}`);
    const targetPath = path.join(downloadDir, filename);
    await download.saveAs(targetPath);
    console.log(`✅ ¡ARCHIVO DESCARGADO EXITOSAMENTE!: ${targetPath}`);
    console.log(`Tamaño final: ${(fs.statSync(targetPath).size / (1024 * 1024)).toFixed(2)} MB`);
  });

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

    console.log('Accediendo a la tabla de documentos...');
    const linkDocs = page.locator('a[id*="j_idt661"], a:has-text("Ver documentos del procedimiento")').first();
    await linkDocs.click();
    await page.waitForTimeout(5000);

    // Inspeccionar la función JS descargaDocGeneral
    const fnDef = await page.evaluate(() => {
      // @ts-ignore
      return window.descargaDocGeneral ? window.descargaDocGeneral.toString() : 'No definida en window';
    });
    console.log('Definición de descargaDocGeneral:', fnDef);

    // Ejecutar la descarga haciendo click en el botón de Bases
    console.log('Haciendo clic en el enlace de descarga de BASES Y ANEXOS (dtDocumentos:0:j_idt128)...');
    const btnBases = page.locator('[id="frmDocumentos:dtDocumentos:0:j_idt128"]');
    
    // Escuchar tanto descarga como popup
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 30000 }).catch(() => null),
      btnBases.click()
    ]);

    if (download) {
      const filename = download.suggestedFilename();
      const targetPath = path.join(downloadDir, filename);
      await download.saveAs(targetPath);
      console.log(`✅ Archivo capturado por evento: ${targetPath}`);
    } else {
      console.log('Esperando descarga pasiva de 15 segundos...');
      await page.waitForTimeout(15000);
    }

    const filesInDir = fs.readdirSync(downloadDir);
    console.log('\nArchivos en storage/raw_bases/:', filesInDir);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

downloadDirectBases();
