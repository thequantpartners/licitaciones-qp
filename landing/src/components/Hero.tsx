import React from "react";
import { MessageCircle, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export const Hero = () => {
  const whatsappUrl = "https://wa.me/51999999999?text=Hola%20Kenneth,%20vi%20la%20plataforma%20Licitaciones%20QP%20y%20deseo%20solicitar%20la%20auditoría%20gratuita%20de%201%20convocatoria%20activa%20de%20mi%20rubro.";

  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden hero-glow">
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        {/* Top Tag Mono */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-[11px] font-mono tracking-widest uppercase mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          Auditoría Determinista • SEACE 3.0 • Ley N° 30225
        </div>

        {/* Headline Editorial */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-[1.12] max-w-5xl mx-auto">
          El 70% de empresas pierden licitaciones millonarias por un folio mal llenado.{" "}
          <span className="text-gold-gradient italic block mt-2">
            Nosotros eliminamos el error humano.
          </span>
        </h1>

        {/* Subtitle Inter */}
        <p className="mt-8 text-base md:text-lg text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
          Deja de obligar a tu equipo comercial a leer expedientes de 180 páginas a medianoche.
          Procesamos los TDRs de EsSalud y Ministerios en 10 segundos y te entregamos la{" "}
          <strong className="text-slate-200 font-medium">Matriz de Cumplimiento Técnico</strong> con alertas de penalidades
          directo a tu WhatsApp.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm !py-4 !px-8 w-full sm:w-auto text-base group"
          >
            <MessageCircle className="w-5 h-5 text-obsidian" />
            <span>Auditar 1 Convocatoria Gratis Hoy</span>
            <ArrowRight className="w-4 h-4 text-obsidian group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#dictamen"
            className="btn-secondary text-sm !py-4 !px-8 w-full sm:w-auto text-base"
          >
            <FileText className="w-4 h-4 text-gold" />
            <span>Ver Muestra de Matriz PDF</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            <span>Sin tarjetas ni compromisos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            <span>Cero dashboards que aprender</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            <span>Entrega pericial en 15 minutos</span>
          </div>
        </div>
      </div>
    </section>
  );
};
