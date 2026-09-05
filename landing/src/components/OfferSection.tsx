import React from "react";
import { Check, ShieldCheck, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

export const OfferSection = () => {
  const whatsappUrl = "https://wa.me/51999999999?text=Hola%20Kenneth,%20quiero%20postular%20al%20Plan%20Piloto%20Fundador%20de%20S/.%201,500/mes%20para%20Licitaciones%20QP.";

  return (
    <section id="oferta" className="py-24 max-w-5xl mx-auto px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-3 py-1 text-[10px] font-mono tracking-widest text-gold border border-gold/30 rounded-full mb-4 uppercase bg-gold/5">
          Oferta de Acceso Exclusivo
        </div>
        <h2 className="font-serif text-3xl md:text-5xl font-medium text-white tracking-tight">
          La Escudería Licitaciones QP: <span className="text-gold-gradient italic">Plan Piloto Fundador.</span>
        </h2>
        <p className="mt-4 text-sm text-slate-400 font-light max-w-2xl mx-auto">
          Una sola adjudicación que salves o una sola penalidad que evites paga más de 3 años completos de nuestro servicio.
        </p>
      </div>

      {/* Main Pricing Box */}
      <div className="card-luxury rounded-3xl p-8 sm:p-12 border-gold/40 bg-gradient-to-b from-surface via-[#0A0D18] to-obsidian relative shadow-2xl">
        {/* Scarcity Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono uppercase tracking-wider mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Solo 3 cupos disponibles para empresas del sector salud</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Offer Details */}
          <div className="lg:col-span-7">
            <h3 className="font-serif text-2xl font-medium text-white mb-4">
              Membresía Integral de Copiloto Pericial
            </h3>
            <p className="text-xs text-slate-400 font-light mb-8 leading-relaxed">
              Diseñado exclusivamente para directores y equipos de licitaciones que compiten en Adjudicaciones Simplificadas y Licitaciones Públicas de bienes y servicios.
            </p>

            {/* Core Deliverables */}
            <div className="space-y-3 mb-8">
              <div className="text-[11px] font-mono uppercase tracking-widest text-gold mb-2">Servicio Núcleo (Core):</div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span><strong>Radar Matutino WhatsApp (07:30 AM):</strong> Detección diaria y personalizada de convocatorias de tu rubro en SEACE 3.0.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span><strong>Matrices de Cumplimiento Técnico Ilimitadas:</strong> Análisis pericial de cada convocatoria con número de página y semáforo RTM.</span>
              </div>
            </div>

            {/* Bonuses */}
            <div className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="text-[11px] font-mono uppercase tracking-widest text-gold mb-2">Bonus Incluidos sin Costo Adicional:</div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span><strong>Bonus 1 (Valor S/. 1,500): Bóveda de Observaciones Legales:</strong> Redacción de consultas formales para tachar cláusulas tóxicas ante el OSCE.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span><strong>Bonus 2 (Valor S/. 1,200): Onboarding de Catálogo Digemid:</strong> Indexación de tus productos para cotejo automático 1:1.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span><strong>Bonus 3 (Valor S/. 800): Checklist Preventivo de Mesa de Partes:</strong> Control riguroso de folios, firmas y anexos jurados.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Action */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-surface/80 border border-white/[0.08] lg:min-h-[420px]">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
                Valor Real Acumulado:
              </div>
              <div className="text-sm font-mono text-slate-500 line-through mb-4">
                S/. 5,000 / mes
              </div>

              <div className="text-xs font-mono text-gold uppercase tracking-widest mb-1">
                Precio Piloto Fundador:
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  S/. 1,500
                </span>
                <span className="text-xs font-mono text-slate-400">/ mes (PEN)</span>
              </div>
              <div className="text-[11px] text-slate-400 font-light mb-6">
                + IGV si aplica factura. Compromiso trimestral piloto de 3 meses.
              </div>
            </div>

            <div className="space-y-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm !py-4 w-full text-center group"
              >
                <span>Postular al Plan Fundador</span>
                <ArrowRight className="w-4 h-4 text-obsidian group-hover:translate-x-1 transition-transform" />
              </a>

              <p className="text-[10px] font-mono text-center text-slate-400">
                Facturación electrónica formal con RUC para tu empresa.
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee Box inside */}
        <div id="garantia" className="mt-12 p-6 rounded-2xl bg-emerald-950/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-medium text-white mb-1">
              Garantía de Precisión Pericial & Respaldo Técnico
            </h4>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Garantizamos la rigurosidad técnica de cada dictamen. Si tu empresa presenta su propuesta cumpliendo cabalmente las observaciones de nuestra Matriz, y el comité de selección te descalifica en la evaluación técnica por un requisito documental expresamente exigido en las bases que nuestro reporte omitió advertir, <strong>te reembolsamos el 100% de la mensualidad pagada ese mes</strong>, previa validación del acta oficial del SEACE.
            </p>
            <span className="text-[11px] text-slate-400 font-mono block mt-2">
              Condición objetiva: Aplica a omisiones documentales atribuibles al sistema. No aplica por factores económicos (precio ofertado), solvencia de cartas fianza o negligencia en la entrega de documentos por parte del postor.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
