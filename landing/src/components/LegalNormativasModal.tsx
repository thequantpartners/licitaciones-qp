"use client";

import React from "react";
import { X, Scale, ExternalLink, ShieldCheck, FileText } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tipo: "ley30225" | "ley27806";
}

export const LegalNormativasModal: React.FC<Props> = ({ isOpen, onClose, tipo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0A0C14] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full bg-white/[0.05] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
              {tipo === "ley30225"
                ? "Marco Legal: Ley N° 30225 de Contrataciones del Estado"
                : "Marco Legal: Ley N° 27806 de Transparencia y Acceso Público"}
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              {tipo === "ley30225"
                ? "Texto Único Ordenado (D.S. N° 082-2019-EF) y su Reglamento"
                : "Acceso Irrestricto a la Información Pública del Estado Peruano"}
            </p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-2 space-y-4 text-xs text-slate-300 font-light leading-relaxed">
          {tipo === "ley30225" ? (
            <>
              <div className="p-3 rounded-xl bg-gold/5 border border-gold/20 text-gold-light text-[11px] font-mono">
                Compendio legal bajo el cual nuestro motor audita bases administrativas y Términos de Referencia (TDR).
              </div>

              <p>
                <strong>1. Principio de Libertad de Concurrencia y Competencia (Art. 2):</strong> Las entidades públicas convocantes están obligadas a establecer requisitos razonables y proporcionales. Licitaciones QP audita si las bases imponen exigencias que restringen indebidamente la libre concurrencia.
              </p>

              <p>
                <strong>2. Requerimientos Técnicos Mínimos - RTM (Art. 16):</strong> Establece que los bienes y servicios deben formularse de manera objetiva y precisa. Nuestro sistema extrae cada especificación del Capítulo III para validar que no existan contradicciones que motiven descalificación.
              </p>

              <p>
                <strong>3. Factores de Evaluación (Art. 29):</strong> Regula los criterios objetivos mediante los cuales el comité de selección asigna puntaje técnico y económico (Capítulo IV).
              </p>

              <p>
                <strong>4. Régimen de Penalidades (Art. 161 y 162 del Reglamento):</strong> La normativa fija la penalidad por mora (máximo 10% del monto contractual) y autoriza "Otras Penalidades" siempre que sean objetivas y razonables. Nuestro radar detecta penalidades desproporcionadas para formular consultas y observaciones oportunas.
              </p>

              <div className="pt-2">
                <a
                  href="https://www.gob.pe/osce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold hover:underline font-mono text-[11px]"
                >
                  <span>Consultar portal oficial del OSCE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-gold/5 border border-gold/20 text-gold-light text-[11px] font-mono">
                Garantía constitucional del carácter público de las contrataciones del Estado peruano.
              </div>

              <p>
                <strong>1. Principio de Publicidad (Art. 3):</strong> Todas las actividades y disposiciones de las entidades comprendidas en la presente Ley están sometidas al principio de publicidad. Las convocatorias, bases integradas, pliegos de absolución y actas de adjudicación en el SEACE tienen carácter estrictamente público.
              </p>

              <p>
                <strong>2. Legitimidad del Análisis de Datos:</strong> Licitaciones QP procesa exclusivamente información de dominio público puesta a disposición de la ciudadanía por el SEACE y el OSCE, garantizando un servicio de auditoría transparente y 100% apegado al marco legal.
              </p>

              <div className="pt-2">
                <a
                  href="https://datosabiertos.gob.pe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold hover:underline font-mono text-[11px]"
                >
                  <span>Portal Nacional de Datos Abiertos del Perú</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
          <button onClick={onClose} className="btn-primary text-xs !py-2.5 !px-6">
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
