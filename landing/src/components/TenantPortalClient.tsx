'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Smartphone,
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Building2,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { TenantPortalData, Tenant, LicitacionAuditada, TenantMetrics } from '@/types/portal';

export function TenantPortalClient({ initialData, slug }: { initialData: TenantPortalData; slug: string }) {
  const [data, setData] = useState<TenantPortalData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDictamen, setFilterDictamen] = useState<'TODOS' | 'VIABLE' | 'SUBSANABLE' | 'NO_VIABLE'>('TODOS');

  // WhatsApp Config state
  const [whatsappNumber, setWhatsappNumber] = useState(initialData.tenant.whatsapp_destino || '51924464410');
  const [isSavingWhatsapp, setIsSavingWhatsapp] = useState(false);
  const [whatsappFeedback, setWhatsappFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`/api/portal/${slug}`, { cache: 'no-store' });
      if (res.ok) {
        const freshData = await res.json();
        setData(freshData);
        setWhatsappNumber(freshData.tenant.whatsapp_destino);
      }
    } catch (err) {
      console.error('Error refreshing portal data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWhatsapp(true);
    setWhatsappFeedback(null);

    try {
      const res = await fetch(`/api/portal/${slug}/whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: whatsappNumber }),
      });

      const json = await res.json();
      if (res.ok) {
        setWhatsappFeedback({
          success: true,
          message: `Número actualizado a +${json.whatsapp}. Las próximas auditorías de su sector se enviarán aquí.`,
        });
        setData((prev) => ({
          ...prev,
          tenant: { ...prev.tenant, whatsapp_destino: json.whatsapp },
        }));
      } else {
        setWhatsappFeedback({ success: false, message: json.error || 'Error al guardar número' });
      }
    } catch (err: any) {
      setWhatsappFeedback({ success: false, message: `Error de conexión: ${err.message}` });
    } finally {
      setIsSavingWhatsapp(false);
      setTimeout(() => setWhatsappFeedback(null), 6000);
    }
  };

  const { tenant, metrics, licitaciones } = data;

  const filteredLicitaciones = licitaciones.filter((item) => {
    const matchesSearch =
      item.nomenclatura.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.objeto.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterDictamen === 'TODOS' ? true : item.dictamen === filterDictamen;

    return matchesSearch && matchesFilter;
  });

  const formatPEN = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#030407] text-slate-100 flex flex-col selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB]">
      {/* Top Header / App Bar */}
      <header className="border-b border-white/[0.06] bg-[#030407]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#997A15] flex items-center justify-center font-serif font-bold text-black text-lg shadow-lg shadow-[#D4AF37]/10">
                Q
              </div>
              <div>
                <span className="font-serif text-lg font-medium text-white tracking-tight block leading-none">
                  LICITACIONES <span className="text-gold-gradient">QP</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 block mt-1">
                  SaaR • Executive Looker Engine
                </span>
              </div>
            </Link>

            <div className="hidden md:block h-6 w-px bg-white/10 mx-2" />

            <div className="hidden md:flex items-center gap-2 text-xs">
              <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-medium text-white">{tenant.razon_social}</span>
              <span className="font-mono text-[10px] text-slate-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                RUC {tenant.ruc}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Vigilancia SEACE 3.0 Activa</span>
              <span className="sm:hidden">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title Bar & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 rounded-full mb-3 uppercase bg-[#D4AF37]/5">
              <Sparkles className="w-3 h-3" /> Panel de Control de Oportunidades & Auditoría Pericial
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-medium text-white tracking-tight">
              {tenant.nombre_comercial}
            </h1>
            <p className="mt-1 text-sm text-slate-400 font-light">
              Rubro monitoreado: <span className="text-slate-200 font-medium">{tenant.rubro}</span>
            </p>
          </div>

          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 transition-all hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar Datos
          </button>
        </div>

        {/* 4 Bento Cards (Looker Studio Style KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Pipeline Vigilado */}
          <div className="card-luxury rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Pipeline en Radar
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {formatPEN(metrics.pipeline_total_pen)}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>{metrics.total_licitaciones} convocatorias</span>
              <span className="text-[#D4AF37]">Valor referencial</span>
            </div>
          </div>

          {/* KPI 2: Horas Hombre Ahorradas */}
          <div className="card-luxury rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Tiempo Legal Ahorrado
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#F3E5AB]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {metrics.horas_ahorradas_total} <span className="text-sm font-normal text-slate-400">hrs</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>~18.5h por expediente</span>
              <span className="text-amber-400/90">Auditoría en 30s</span>
            </div>
          </div>

          {/* KPI 3: Penalidades Blindadas */}
          <div className="card-luxury rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Penalidades Neutralizadas
                </span>
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {metrics.penalidades_criticas_total} <span className="text-sm font-normal text-slate-400">cláusulas</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Mora y 5% UIT personal</span>
              <span className="text-rose-400">Cero sanciones</span>
            </div>
          </div>

          {/* KPI 4: Win-Rate Radar / Aptitud */}
          <div className="card-luxury rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Score de Aptitud Pericial
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sky-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {metrics.score_promedio} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono">
              <span className="text-emerald-400">{metrics.viables_count} Viables</span>
              <span className="text-amber-400">{metrics.subsanables_count} Subsanables</span>
              <span className="text-rose-400">{metrics.no_viables_count} No Viables</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Notification Dispatcher Center (Key User Requirement) */}
        <div className="card-luxury rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/25 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[10px] uppercase tracking-wider mb-3">
                <Smartphone className="w-3 h-3" /> Centro de Despacho Inmediato
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight">
                Número de WhatsApp Receptor de Alertas
              </h2>
              <p className="mt-2 text-sm text-slate-400 font-light leading-relaxed">
                Cada vez que una licitación de su rubro es detectada y auditada por nuestro motor de IA, 
                el informe pericial en PDF y el semáforo de requisitos se envían de forma instantánea a este número.
              </p>
            </div>

            <form onSubmit={handleSaveWhatsApp} className="flex-1 max-w-md w-full flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">
                  🇵🇪 +51
                </span>
                <input
                  type="text"
                  value={whatsappNumber.replace(/^51/, '')}
                  onChange={(e) => setWhatsappNumber(`51${e.target.value.replace(/\D/g, '')}`)}
                  placeholder="924464410"
                  className="w-full pl-16 pr-4 py-3 bg-[#030407] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingWhatsapp}
                className="btn-primary w-full sm:w-auto text-xs py-3 px-6 whitespace-nowrap"
              >
                {isSavingWhatsapp ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Guardar
                  </>
                )}
              </button>
            </form>
          </div>

          {whatsappFeedback && (
            <div className={`mt-4 p-3 rounded-xl border text-xs font-mono ${
              whatsappFeedback.success
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}>
              {whatsappFeedback.message}
            </div>
          )}
        </div>

        {/* Looker Table: Audited Tenders */}
        <div className="card-luxury rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-medium text-white tracking-tight">
                Repositorio Pericial de Convocatorias
              </h3>
              <p className="text-xs text-slate-400 font-light mt-1">
                Expedientes del SEACE analizados con semáforo de requisitos técnicos y penalidades detectadas.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(['TODOS', 'VIABLE', 'SUBSANABLE', 'NO_VIABLE'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterDictamen(filter)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                    filterDictamen === filter
                      ? 'bg-[#D4AF37] text-black font-semibold shadow-md shadow-[#D4AF37]/20'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nomenclatura (CP SER-SM-...), entidad o palabras del objeto..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#030407]/60 border border-white/[0.08] rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          {/* Table / List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  <th className="pb-3 pl-2">Procedimiento & Objeto</th>
                  <th className="pb-3 px-4">Valor Referencial</th>
                  <th className="pb-3 px-4">Dictamen Pericial</th>
                  <th className="pb-3 px-4">Penalidades</th>
                  <th className="pb-3 px-4">Tiempo Ahorrado</th>
                  <th className="pb-3 pr-2 text-right">Informe A4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs">
                {filteredLicitaciones.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-mono text-xs">
                      No se encontraron expedientes con los criterios seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredLicitaciones.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Procedimiento */}
                      <td className="py-4 pl-2 pr-4 max-w-sm">
                        <div className="font-mono text-xs font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                          {item.nomenclatura}
                        </div>
                        <div className="text-[11px] text-slate-400 font-light line-clamp-1 mt-0.5">
                          {item.entidad}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.objeto}
                        </div>
                      </td>

                      {/* Monto */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-white font-medium">
                        {formatPEN(item.monto_pen)}
                      </td>

                      {/* Dictamen Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {item.dictamen === 'VIABLE' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> VIABLE ({item.score_viabilidad}/100)
                          </span>
                        )}
                        {item.dictamen === 'SUBSANABLE' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] font-semibold">
                            <AlertTriangle className="w-3 h-3" /> SUBSANABLE ({item.score_viabilidad}/100)
                          </span>
                        )}
                        {item.dictamen === 'NO_VIABLE' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[10px] font-semibold">
                            <XCircle className="w-3 h-3" /> NO VIABLE ({item.score_viabilidad}/100)
                          </span>
                        )}
                      </td>

                      {/* Penalidades */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-300">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          item.penalidades_criticas > 5 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : 'bg-white/[0.04] text-slate-300'
                        }`}>
                          {item.penalidades_criticas} críticas
                        </span>
                      </td>

                      {/* Horas Ahorradas */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-400">
                        +{item.horas_ahorradas}h
                      </td>

                      {/* Botón Ver PDF */}
                      <td className="py-4 pr-2 pl-4 text-right whitespace-nowrap">
                        <a
                          href={item.pdf_cdn_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-[#D4AF37]/10 border border-white/[0.08] hover:border-[#D4AF37]/30 text-slate-200 hover:text-[#F3E5AB] font-mono text-[11px] transition-all"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>PDF Pericial</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/[0.06] py-6 text-center text-slate-500 font-mono text-[10px]">
        Licitaciones QP • The Quant Partners • Infraestructura B2B de Auditoría Determinista SEACE 3.0
      </footer>
    </div>
  );
}
