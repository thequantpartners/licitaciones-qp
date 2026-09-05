import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export class SupabaseUploader {
  private static client: SupabaseClient | null = null;
  private static bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'reportes-periciales';

  private static getClient(): SupabaseClient | null {
    if (this.client) return this.client;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('[SupabaseUploader] Credenciales de Supabase no configuradas.');
      return null;
    }

    this.client = createClient(supabaseUrl, supabaseKey);
    return this.client;
  }

  /**
   * Sube un archivo PDF a Supabase Storage y retorna su URL pública CDN permanente.
   * Si Supabase no está configurado, retorna la URL pública del dominio web.
   */
  static async subirReportePdf(localPdfPath: string, fileName?: string): Promise<string> {
    const client = this.getClient();
    const name = fileName || path.basename(localPdfPath);
    const fallbackUrl = `https://licitaciones.thequantpartners.com/reportes/${name}`;

    if (!client) {
      return fallbackUrl;
    }

    try {
      if (!fs.existsSync(localPdfPath)) {
        console.warn(`[SupabaseUploader] Archivo local no encontrado: ${localPdfPath}`);
        return fallbackUrl;
      }

      const fileBuffer = fs.readFileSync(localPdfPath);

      console.log(`[SupabaseUploader] Subiendo "${name}" a bucket "${this.bucketName}"...`);
      const { error } = await client.storage
        .from(this.bucketName)
        .upload(name, fileBuffer, {
          contentType: 'application/pdf',
          upsert: true,
          cacheControl: '0'
        });

      if (error) {
        console.error('[SupabaseUploader] Error al subir archivo:', error.message);
        return fallbackUrl;
      }

      const { data } = client.storage
        .from(this.bucketName)
        .getPublicUrl(name);

      const cacheBustUrl = `${data.publicUrl}?t=${Date.now()}`;
      console.log(`✅ [SupabaseUploader] PDF alojado con éxito en CDN: ${cacheBustUrl}`);
      return cacheBustUrl;
    } catch (err: any) {
      console.error('[SupabaseUploader] Excepción durante la subida:', err.message);
      return fallbackUrl;
    }
  }
}
