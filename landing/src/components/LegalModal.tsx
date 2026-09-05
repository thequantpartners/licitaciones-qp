"use client";

import React from "react";
import { X, Scale } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tipo: "terminos" | "privacidad";
}

export const LegalModal: React.FC<Props> = ({ isOpen, onClose, tipo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0A0C14] border border-white/[0.1] rounded-2xl sm:rounded-3xl shadow-2xl my-auto max-h-[90vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-white/[0.08] bg-[#0A0C14]/90 shrink-0">
          <div className="flex items-center gap-3 pr-4">
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                {tipo === "terminos" ? "Términos y Condiciones del Servicio" : "Política de Privacidad & Protección de Datos"}
              </h3>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                Licitaciones QP &bull; The Quant Partners
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] transition-colors shrink-0"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs text-slate-300 font-light leading-relaxed">
          {tipo === "terminos" ? (
            <>
              <p>
                <strong>1. Objeto del Servicio:</strong> Licitaciones QP, operado por The Quant Partners, presta servicios de auditoría documental pericial, extracción determinista de términos de referencia y detección preventiva de contingencias en procedimientos de contratación pública convocados a través del SEACE bajo la Ley N° 30225.
              </p>
              <p>
                <strong>2. Alcance Pericial y Exoneración de Responsabilidad de Adjudicación:</strong> La labor de Licitaciones QP constituye una asistencia técnica preventiva y analítica. La formulación de las propuestas económicas, la idoneidad técnica de los productos ofertados, la vigencia de fianzas bancarias y la postulación formal ante el portal del SEACE son responsabilidad exclusiva del cliente postor. Licitaciones QP no asume responsabilidad si la entidad pública declara desierto el proceso, cancela la convocatoria o descalifica por factores de precio o evaluación subjetiva ajenos a los RTMs formalmente estipulados.
              </p>
              <p>
                <strong>3. Condiciones de la Garantía de Respaldo Pericial:</strong> La garantía aplica exclusivamente cuando el cliente acredite mediante acta oficial de evaluación técnica del SEACE que fue descalificado por el incumplimiento de un requisito técnico o formal explícito en las bases que nuestro informe pericial omitió advertir. La garantía no cubre fallas imputables al postor (omisión voluntaria de documentos, errores de precio, falta de firma o entrega fuera de plazo). El reembolso se tramitará dentro de los 5 días hábiles posteriores a la verificación del acta del OSCE.
              </p>
              <p>
                <strong>4. Facturación y Pagos:</strong> Todo servicio se factura de manera electrónica cumpliendo la normativa de SUNAT mediante RUC habilitado. Las suscripciones mensuales se cancelan por adelantado y no tienen penalidad de salida cumplido el plazo acordado.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Compromiso de Privacidad:</strong> The Quant Partners se compromete a salvaguardar la confidencialidad de los datos corporativos, catálogos comerciales y consultas formuladas por sus clientes, en estricto apego a la Ley N° 29733 (Ley de Protección de Datos Personales en el Perú).
              </p>
              <p>
                <strong>2. Uso de la Información:</strong> Los datos remitidos (especificaciones de productos, registros sanitarios Digemid, certificaciones ISO) se emplean únicamente con el fin de realizar el cotejo y matching determinista contra las bases de licitación contratadas. En ningún caso se transferirán, comercializarán o compartirán con competidores directos ni terceros ajenos al servicio.
              </p>
              <p>
                <strong>3. Canales de Contacto:</strong> Para ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición), el titular de los datos puede dirigirse formalmente al correo institucional <strong>partners@thequantpartners.com</strong>.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-white/[0.08] flex justify-end shrink-0 bg-[#0A0C14]">
          <button
            onClick={onClose}
            className="btn-primary text-xs !py-2.5 !px-6"
          >
            Entendido y Aceptado
          </button>
        </div>
      </div>
    </div>
  );
};
