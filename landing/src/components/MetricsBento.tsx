import React from "react";
import { Zap, ShieldAlert, Clock, Smartphone } from "lucide-react";

export const MetricsBento = () => {
  return (
    <section className="py-20 border-t border-b border-white/[0.06] bg-surface/40 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 text-[10px] font-mono tracking-widest text-gold border border-gold/30 rounded-full mb-4 uppercase bg-gold/5">
            Eficacia Cuantificable
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-white tracking-tight">
            La velocidad de un algoritmo. La severidad de un <span className="text-gold-gradient italic">perito del OSCE.</span>
          </h2>
          <p className="mt-4 text-sm text-slate-400 font-light max-w-2xl mx-auto">
            El mercado de compras públicas mueve más de S/. 50,000 millones al año. Quien analiza más rápido y sin errores, domina las adjudicaciones.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="card-luxury rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-6">
                <Clock className="w-5 h-5" />
              </div>
              <div className="font-mono text-3xl font-bold text-white mb-2">10 Segundos</div>
              <h3 className="font-serif text-lg font-medium text-slate-200 mb-2">De 180 páginas a 1 dictamen</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Tu analista tarda entre 4 y 6 horas leyendo un PDF escaneado. Nuestro motor aísla el Capítulo III y IV en segundos.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.05] text-[10px] font-mono text-gold uppercase tracking-wider">
              Ahorro de 85% de tiempo operativo
            </div>
          </div>

          {/* Card 2 */}
          <div className="card-luxury rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="font-mono text-3xl font-bold text-white mb-2">Pág. Exacta</div>
              <h3 className="font-serif text-lg font-medium text-slate-200 mb-2">Radar de Cláusulas Tóxicas</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Detecta penalidades del 2% diario, plazos irreales o direccionamientos ocultos con cita literal de página del pliego.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.05] text-[10px] font-mono text-gold uppercase tracking-wider">
              Cero multas de ejecución contractual
            </div>
          </div>

          {/* Card 3 */}
          <div className="card-luxury rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-6">
                <Zap className="w-5 h-5" />
              </div>
              <div className="font-mono text-3xl font-bold text-white mb-2">100%</div>
              <h3 className="font-serif text-lg font-medium text-slate-200 mb-2">Determinismo Jurídico</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Cero alucinaciones de IA genérica. Validación estricta con esquemas Zod calibrados bajo la Ley N° 30225 y sus directivas.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.05] text-[10px] font-mono text-gold uppercase tracking-wider">
              Respaldado por jurisprudencia OSCE
            </div>
          </div>

          {/* Card 4 */}
          <div className="card-luxury rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="font-mono text-3xl font-bold text-white mb-2">0 Logins</div>
              <h3 className="font-serif text-lg font-medium text-slate-200 mb-2">Servicio Llave en Mano</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                No queremos que tu equipo aprenda a usar otro software más. El dictamen llega listo a las 07:30 AM a tu WhatsApp.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.05] text-[10px] font-mono text-gold uppercase tracking-wider">
              Adopción instantánea sin fricción
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
