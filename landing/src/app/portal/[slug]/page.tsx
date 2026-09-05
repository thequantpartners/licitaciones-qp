import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { getTenantPortalData } from '@/lib/supabase';
import { TenantPortalClient } from '@/components/TenantPortalClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TenantPortalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getTenantPortalData(slug);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#030407] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="card-luxury p-8 max-w-md w-full rounded-2xl border border-white/10">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-medium mb-2">Espacio No Encontrado</h1>
          <p className="text-sm text-slate-400 mb-6 font-light">
            No se encontró ninguna empresa asociada a la clave de acceso <span className="font-mono text-[#D4AF37]">"{slug}"</span>.
          </p>
          <Link href="/" className="btn-primary w-full text-xs">
            Volver a la Página Principal
          </Link>
        </div>
      </div>
    );
  }

  return <TenantPortalClient initialData={data} slug={slug} />;
}
