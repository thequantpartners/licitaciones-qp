import React from "react";
import { X, Check } from "lucide-react";

export const ComparisonSection = () => {
  return (
    <section id="comparativa" className="py-24 max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-3 py-1 text-[10px] font-mono tracking-widest text-gold border border-gold/30 rounded-full mb-4 uppercase bg-gold/5">
          El Contraste de Modelos
        </div>
        <h2 className="font-serif text-3xl md:text-5xl font-medium text-white tracking-tight">
          ¿Por qué comprar otra herramienta cuando puedes comprar <span className="text-gold-gradient italic">el resultado listo?</span>
        </h2>
        <p className="mt-4 text-sm text-slate-400 font-light max-w-2xl mx-auto">
          Las plataformas tradicionales te cobran por darte más trabajo frente a una pantalla. Nosotros te entregamos el dictamen para que tu Director Comercial decida en 3 minutos.
        </p>
      </div>

      {/* Grid Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* El Camino Tradicional / LicitaLAB */}
        <div className="card-luxury rounded-2xl p-8 border-red-500/10 bg-gradient-to-b from-red-950/5 to-transparent flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-red-400 mb-4">
              El Método Tradicional de Mercado
            </div>
            <h3 className="font-serif text-2xl font-medium text-white mb-6">
              Te venden una herramienta para que sigas trabajando horas extras
            </h3>

            <ul className="space-y-4 text-xs text-slate-400">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
                <span><strong>Obliga a aprender un software:</strong> Dashboards con decenas de filtros y gráficos que tus analistas terminan abandonando por falta de tiempo.</span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
                <span><strong>El analista sigue leyendo a ciegas:</strong> Te muestran la lista de convocatorias, pero nadie te lee las 180 páginas de bases técnicas por ti.</span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
                <span><strong>Alto riesgo de descalificación formal:</strong> Si tu analista no vio que en la página 74 pedían traducción jurada oficial, perdiste una licitación de S/. 800k.</span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
                <span><strong>Cero garantías de riesgo:</strong> Si te descalifican por un error de bases, a la plataforma de software no le importa en lo absoluto.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.05] text-[11px] font-mono text-slate-500">
            Resultado: 4 a 6 horas perdidas por concurso y estrés constante de descalificación.
          </div>
        </div>

        {/* La Escudería Licitaciones QP */}
        <div className="card-luxury rounded-2xl p-8 border-gold/30 bg-gradient-to-b from-gold/5 via-surface to-surface flex flex-col justify-between relative shadow-2xl">
          <div className="absolute top-4 right-6 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-[10px] font-mono uppercase text-gold">
            Servicio Pericial Llave en Mano
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-gold mb-4">
              La Escudería Licitaciones QP
            </div>
            <h3 className="font-serif text-2xl font-medium text-white mb-6">
              El dictamen pericial completo directo a tu WhatsApp
            </h3>

            <ul className="space-y-4 text-xs text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Cero logins ni contraseñas:</strong> A las 07:30 AM recibes la alerta de las licitaciones activas con el PDF pericial listo para abrir.</span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Semáforo de Requisitos Técnicos (RTM):</strong> Tabla comparativa de qué piden, si calificas y qué documento exacto debes adjuntar.</span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Radar de Cláusulas Tóxicas con número de página:</strong> Te alertamos multas abusivas para redactar la observación formal ante el comité a tiempo.</span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Garantía Cero Descalificación:</strong> Si te descalifican por un vicio formal en bases no advertido en el informe, devolución del 100% de tu dinero.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-gold/20 text-[11px] font-mono text-gold-light">
            Resultado: Decisión de postulación tomada en 3 minutos y blindaje pericial garantizado.
          </div>
        </div>
      </div>
    </section>
  );
};
