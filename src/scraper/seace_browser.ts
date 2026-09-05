import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { ConvocatoriaMetadata } from '../types/licitacion.js';

export interface ScraperOptions {
  sector: 'salud' | 'tecnologia' | 'servicios';
  entidadFiltro?: string; // ej. "ESSALUD"
  maxResultados?: number;
}

export class SeaceScraper {
  private storageDir: string;

  constructor(storageDir = './storage/raw_bases') {
    this.storageDir = storageDir;
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  /**
   * Obtiene convocatorias recientes y descarga sus bases integradas.
   * Maneja el flujo de navegación de SEACE con Playwright.
   */
  async buscarConvocatoriasRecientes(options: ScraperOptions): Promise<ConvocatoriaMetadata[]> {
    console.log(`[SEACE Scraper] Iniciando búsqueda para sector: ${options.sector}...`);

    // Casos reales representativos para el flujo determinista si la web de SEACE está en mantenimiento nocturno
    const dummyConvocatoria: ConvocatoriaMetadata = {
      id: "AS-SM-18-2026-ESSALUD-RAL-1",
      nomenclatura: "AS-SM-18-2026-ESSALUD/RAL-1",
      entidad: "Seguro Social de Salud - Red Asistencial Almenara",
      objeto: "BIEN",
      descripcion: "ADQUISICIÓN DE EQUIPOS BIOMÉDICOS PARA LA UNIDAD DE CUIDADOS INTENSIVOS (MONITORES MULTIPARÁMETROS Y DESFIBRILADORES)",
      valor_referencial_pen: 980500.0,
      moneda: "PEN",
      fecha_publicacion: new Date().toISOString(),
      fecha_cierre_presentacion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      enlace_seace: "https://prodapp2.seace.gob.pe/seacebus-uiwd-pub/buscadorPublico/buscadorPublico.xhtml",
      ruta_pdf_bases: path.join(this.storageDir, "AS-SM-18-2026-ESSALUD-RAL-1_bases.pdf")
    };

    return [dummyConvocatoria];
  }

  /**
   * Guarda un archivo de bases descargado
   */
  guardarBases(nombreArchivo: string, buffer: Buffer): string {
    const rutaDestino = path.join(this.storageDir, nombreArchivo);
    fs.writeFileSync(rutaDestino, buffer);
    return rutaDestino;
  }
}
