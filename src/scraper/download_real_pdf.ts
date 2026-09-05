import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function downloadRealBases() {
  console.log('=== DESCARGANDO BASES REALES DE SEACE ===');
  const browser = await chromium.launch({ headless: true });
  const downloadDir = path.resolve('./storage/raw_bases');
  if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    acceptDownloads: true
  });
  const page = await context.newPage();

  // Monitorear descargas del navegador
  page.on('download', async (download) => {
    const filename = download.suggestedFilename();
    console.log(`\n🎉 ¡Evento de descarga recibido!: ${filename}`);
    const targetPath = path.join(downloadDir, filename);
    await download.saveAs(targetPath);
    console.log(`✅ Archivo guardado en: ${targetPath}`);
    console.log(`Tamaño: ${(fs.statSync(targetPath).size / (1024 * 1024)).toFixed(2)} MB`);
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

    // 1. Expandir el acordeón "Ver documentos por Etapa"
    console.log('Expandiendo panel "Ver documentos por Etapa"...');
    const headerDocs = page.locator('.ui-accordion-header:has-text("Ver documentos por Etapa"), :text("Ver documentos por Etapa")').first();
    await headerDocs.scrollIntoViewIfNeeded();
    await headerDocs.click();
    await page.waitForTimeout(3000);

    // Verificar si la tabla de documentos ahora es visible
    const isVisible = await page.locator('table[id*="dtDocumentos"]').isVisible();
    console.log('¿Tabla de documentos visible?:', isVisible);

    // Tomar screenshot para confirmar
    await page.screenshot({ path: './storage/seace_acordeon_abierto.png' });

    // 2. Hacer clic en el icono/botón de descarga de Bases
    // En la tabla, buscar la fila con "Bases Integradas" o "Bases Administrativas"
    console.log('Buscando botón de descarga de Bases...');
    const btnDescarga = page.locator('table[id*="dtDocumentos"] tbody tr:has-text("Bases") a, table[id*="dtDocumentos"] tbody tr:has-text("Bases") img, table[id*="dtDocumentos"] tbody tr a[id*="j_idt397"]').first();
    
    console.log('Haciendo clic en el botón de descarga...');
    await btnDescarga.click({ force: true });

    // Esperar a que la descarga termine
    console.log('Esperando recepción del archivo (15 segundos)...');
    await page.waitForTimeout(15000);

    // Listar archivos descargados en storage/raw_bases/
    const files = fs.readdirSync(downloadDir);
    console.log('\nArchivos en storage/raw_bases/:', files);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

downloadRealBases();
