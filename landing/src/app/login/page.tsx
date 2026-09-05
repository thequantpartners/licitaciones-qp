'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFoundInfo, setNotFoundInfo] = useState<{ identifier: string; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError(null);
    setNotFoundInfo(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al validar credenciales.');
        return;
      }

      if (data.notFound) {
        setNotFoundInfo({
          identifier: data.identifier,
          message: data.message,
        });
        return;
      }

      if (data.success && data.redirectUrl) {
        // Redirigir al portal privado del tenant
        router.push(data.redirectUrl);
      }
    } catch (err: any) {
      setError(`Error de conexión con el servidor: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoRuc = () => {
    setIdentifier('20608945123');
    setError(null);
    setNotFoundInfo(null);
  };

  const whatsappActivationUrl = `https://wa.me/51924464410?text=Hola%20Smith,%20deseo%20activar%20el%20radar%20pericial%20de%20Licitaciones%20QP%20para%20mi%20empresa%20con%20RUC%20${notFoundInfo?.identifier || identifier}.`;

  return (
    <div className="min-h-screen bg-[#030407] text-slate-100 flex flex-col justify-between relative selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="p-6 max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-[#F3E5AB] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la portada</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span className="hidden sm:inline">Entorno Seguro SEACE 3.0</span>
        </div>
      </header>

      {/* Center Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 z-10">
        <div className="card-luxury w-full max-w-md rounded-2xl p-8 sm:p-10 border border-white/[0.08] relative">
          {/* Brand header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#997A15] flex items-center justify-center font-serif font-bold text-black text-xl shadow-lg shadow-[#D4AF37]/20">
                Q
              </div>
              <div className="text-left">
                <span className="font-serif text-xl font-medium text-white tracking-tight block leading-none">
                  LICITACIONES <span className="text-gold-gradient">QP</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 block mt-1">
                  Executive SaaR Portal
                </span>
              </div>
            </Link>

            <h1 className="font-serif text-2xl font-medium text-white tracking-tight">
              Acceso a su Bóveda Pericial
            </h1>
            <p className="mt-2 text-xs text-slate-400 font-light leading-relaxed">
              Consulte las licitaciones auditadas de su rubro, horas ahorradas y configure sus alertas inmediatas de WhatsApp.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                RUC de la Empresa (11 dígitos)
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-mono text-slate-600">|</span>
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Ej. 20608945123"
                  maxLength={11}
                  className="w-full pl-14 pr-4 py-3 bg-[#030407]/80 border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  autoFocus
                />
              </div>

              {/* Demo Helper Button */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">¿Probando el sistema?</span>
                <button
                  type="button"
                  onClick={fillDemoRuc}
                  className="text-[#D4AF37] hover:text-[#F3E5AB] transition-colors underline decoration-dotted underline-offset-2"
                >
                  Usar RUC Demo (Salud)
                </button>
              </div>
            </div>

            {/* Error standard */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Not Found Lead Generator Box */}
            {notFoundInfo && (
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-3">
                <div className="flex items-start gap-2 text-amber-300 font-mono text-[11px]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#D4AF37]" />
                  <span>El RUC "{notFoundInfo.identifier}" no tiene un radar activo actualmente.</span>
                </div>
                <p className="text-slate-400 text-[11px] font-light leading-relaxed">
                  Podemos activar la vigilancia de su sector y auditarle 1 expediente oficial de forma anticipada.
                </p>
                <a
                  href={whatsappActivationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#F3E5AB] font-mono text-[11px] font-medium transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Solicitar Activación por WhatsApp
                </a>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading || !identifier.trim()}
              className="btn-primary w-full py-3 text-xs uppercase tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Validando RUC...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <span>Ingresar a mi Bóveda Pericial</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Footer security note */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-[10px] font-mono text-slate-500">
              🔒 Acceso reservado para contratistas y proveedores habilitados ante SUNAT.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-600 font-mono text-[10px] z-10">
        Licitaciones QP • The Quant Partners • Infraestructura Determinista para Contrataciones Públicas
      </footer>
    </div>
  );
}
