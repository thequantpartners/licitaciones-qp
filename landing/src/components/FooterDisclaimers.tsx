"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, BookOpen, ShieldAlert, Mail } from "lucide-react";
import { LibroReclamacionesModal } from "./LibroReclamacionesModal";
import { LegalModal } from "./LegalModal";
import { LegalNormativasModal } from "./LegalNormativasModal";

export const FooterDisclaimers = () => {
  const [reclamacionesOpen, setReclamacionesOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTipo, setLegalModalTipo] = useState<"terminos" | "privacidad">("terminos");

  const [normativaOpen, setNormativaOpen] = useState(false);
  const [normativaTipo, setNormativaTipo] = useState<"ley30225" | "ley27806">("ley30225");

  const openLegal = (tipo: "terminos" | "privacidad") => {
    setLegalModalTipo(tipo);
    setLegalModalOpen(true);
  };

  const openNormativa = (tipo: "ley30225" | "ley27806") => {
    setNormativaTipo(tipo);
    setNormativaOpen(true);
  };

  return (
    <>
      <footer className="pt-20 pb-12 border-t border-white/[0.08] bg-[#020305] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6">
          {/* Brand & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-white/[0.06]">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-surface border border-gold/40 flex items-center justify-center text-gold font-mono font-bold text-xs">
                  QP
                </div>
                <span className="font-serif text-lg font-bold text-white tracking-tight">
                  LICITACIONES <span className="text-gold">QP</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light max-w-md leading-relaxed mb-6">
                Infraestructura pericial de inteligencia y auditoría determinista para proveedores y contratistas del Estado peruano. Optimización de procesos de contratación pública bajo la Ley N° 30225.
              </p>
              <div className="flex items-center gap-2 font-mono text-[11px] text-gold-light">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <a
                  href="mailto:partners@thequantpartners.com"
                  className="hover:text-white transition-colors underline decoration-gold/40 underline-offset-4"
                >
                  partners@thequantpartners.com
                </a>
                <span className="text-slate-600">&bull;</span>
                <span className="text-slate-400">Lima, Perú</span>
              </div>
            </div>

            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-white font-semibold mb-4">
                Navegación
              </div>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#comparativa" className="hover:text-gold transition-colors">Comparativa de Modelos</a></li>
                <li><a href="#dictamen" className="hover:text-gold transition-colors">Muestra de Matriz PDF</a></li>
                <li><a href="#oferta" className="hover:text-gold transition-colors">Plan Piloto Fundador</a></li>
                <li><a href="#garantia" className="hover:text-gold transition-colors">Garantía de Precisión</a></li>
                <li><a href="#faq" className="hover:text-gold transition-colors">Preguntas Frecuentes</a></li>
                <li><Link href="/login" className="text-gold-light hover:text-white transition-colors">Portal de Clientes</Link></li>
                <li><Link href="/admin" className="text-slate-600 hover:text-[#D4AF37] transition-colors text-[10px] font-mono block pt-1">Consola Superadmin</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-white font-semibold mb-4">
                Marco Legal & Tributario
              </div>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={() => openNormativa("ley30225")}
                    className="flex items-center gap-2 text-slate-400 hover:text-gold transition-colors group text-left"
                  >
                    <Scale className="w-3.5 h-3.5 text-gold shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="underline decoration-slate-700 underline-offset-4">Ley N° 30225 y Reglamentos</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openNormativa("ley27806")}
                    className="flex items-center gap-2 text-slate-400 hover:text-gold transition-colors group text-left"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-gold shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="underline decoration-slate-700 underline-offset-4">Ley N° 27806 (Transparencia)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setReclamacionesOpen(true)}
                    className="flex items-center gap-2 text-gold-light hover:text-white transition-colors group text-left"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-gold shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="underline decoration-gold/40 underline-offset-4">Libro de Reclamaciones Virtual</span>
                  </button>
                </li>
                <li className="text-[11px] text-slate-500 pt-1 font-mono">
                  Comprobante Electrónico (RUC Habilitado SUNAT)
                </li>
              </ul>
            </div>
          </div>

          {/* Regulatory Disclaimers (INDECOPI / SUNAT / OSCE Protection) */}
          <div id="disclaimers" className="py-10 border-b border-white/[0.06] text-[11px] text-slate-400 leading-relaxed space-y-3 font-light">
            <p>
              <strong className="text-slate-300">1. Descargo de Independencia Institucional:</strong> Licitaciones QP es una plataforma y servicio privado de análisis tecnológico, auditoría documental e inteligencia de negocios operado por The Quant Partners. <strong>No mantiene relación de dependencia, asociación, patrocinio, aval ni vínculo institucional alguno con el Organismo Supervisor de las Contrataciones del Estado (OSCE), el Sistema Electrónico de Contrataciones del Estado (SEACE), la Central de Compras Públicas (Perú Compras)</strong>, ni con ningún ministerio, gobierno regional o entidad pública del Estado peruano. Los nombres, acrónimos y marcas gubernamentales se mencionan estrictamente con fines descriptivos y de referencia informativa.
            </p>
            <p>
              <strong className="text-slate-300">2. Procedencia de Datos y Transparencia:</strong> Todos los datos, expedientes de contratación, bases administrativas integradas y resoluciones analizadas provienen exclusivamente de fuentes oficiales de acceso público irrestricto, en estricto cumplimiento del Texto Único Ordenado de la Ley N° 27806 (Ley de Transparencia y Acceso a la Información Pública).
            </p>
            <p>
              <strong className="text-slate-300">3. Alcance Pericial y Responsabilidad del Postor:</strong> Los informes, matrices de cumplimiento, resúmenes ejecutivos y alertas de penalidades emitidos por Licitaciones QP constituyen herramientas analíticas de apoyo preventivo y peritaje técnico. <strong>La formulación final de propuestas técnicas y económicas, la validez de las declaraciones juradas, la fijación de precios y la presentación formal de ofertas en el portal del SEACE recaen bajo la exclusiva responsabilidad de la empresa postora</strong>. Licitaciones QP no garantiza la obtención de la Buena Pro, toda vez que la adjudicación depende de factores ajenos como la evaluación económica y decisiones soberanas de los comités de selección.
            </p>
            <p>
              <strong className="text-slate-300">4. Cumplimiento INDECOPI y SUNAT:</strong> Conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571), los usuarios tienen a su disposición el canal de atención directa y Libro de Reclamaciones Virtual para cualquier queja o reclamo formal. Todas las transacciones se respaldan mediante el comprobante de pago electrónico respectivo emitido según la normativa tributaria vigente de la SUNAT.
            </p>
          </div>

          {/* Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Licitaciones QP &bull; The Quant Partners. Todos los derechos reservados.
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => openLegal("terminos")}
                className="hover:text-gold transition-colors underline decoration-slate-700 underline-offset-4"
              >
                Términos del Servicio
              </button>
              <button
                onClick={() => openLegal("privacidad")}
                className="hover:text-gold transition-colors underline decoration-slate-700 underline-offset-4"
              >
                Política de Privacidad
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <LibroReclamacionesModal
        isOpen={reclamacionesOpen}
        onClose={() => setReclamacionesOpen(false)}
      />

      <LegalModal
        isOpen={legalModalOpen}
        tipo={legalModalTipo}
        onClose={() => setLegalModalOpen(false)}
      />

      <LegalNormativasModal
        isOpen={normativaOpen}
        tipo={normativaTipo}
        onClose={() => setNormativaOpen(false)}
      />
    </>
  );
};
