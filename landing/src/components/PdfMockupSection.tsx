import React from "react";
import { Shield, AlertTriangle, CheckCircle, FileText, ArrowUpRight } from "lucide-react";

export const PdfMockupSection = () => {
  const whatsappUrl = "https://wa.me/51999999999?text=Hola%20Kenneth,%20vi%20la%20muestra%20del%20PDF%20de%20Licitaciones%20QP%20y%20quiero%20auditar%20una%20licitación%20activa%20de%20mi%20empresa.";

  return (
    <section id="dictamen" className="py-24 border-t border-white/[0.06] bg-gradient-to-b from-surface/50 to-obsidian relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 text-[10px] font-mono tracking-widest text-gold border border-gold/30 rounded-full mb-4 uppercase bg-gold/5">
            El Entregable Real
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-white tracking-tight">
            Así es como tu equipo <span className="text-gold-gradient italic">tomará decisiones en 3 minutos.</span>
          </h2>
          <p className="mt-4 text-sm text-slate-400 font-light max-w-2xl mx-auto">
            Este es un extracto real de la Matriz de Cumplimiento Técnico generada por nuestro motor para un concurso de equipamiento médico en EsSalud por S/. 980,500.
          </p>
        </div>

        {/* Mockup Container */}
        <div className="card-luxury rounded-3xl p-6 sm:p-10 border-white/[0.1] bg-[#0A0D18] max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          {/* Top Bar of Document */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-mono font-bold text-xs">
                QP
              </div>
              <div>
                <div className="font-serif text-sm font-bold text-white tracking-tight">
                  LICITACIONES QP | UNIDAD DE AUDITORÍA PERICIAL
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                  Informe Pericial de Cumplimiento Técnico & Jurídico
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                88% VIABILIDAD
              </span>
              <span className="text-slate-400">Págs: 3</span>
            </div>
          </div>

          {/* Procedure Metadata Block */}
          <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Convocatoria:</span>
              <strong className="text-white">AS-SM-18-2026-ESSALUD/RAL-1</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Entidad Convocante:</span>
              <span className="text-slate-300">EsSalud - Red Asistencial Almenara</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Valor Referencial:</span>
              <span className="text-gold font-bold">S/. 980,500.00 PEN</span>
            </div>
          </div>

          {/* Critical Alert Callout */}
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Alerta Crítica de Cláusula Tóxica detectada (Pág. 68 de Bases)</span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              El numeral 8.4 estipula que ante una falla en UCI, el reemplazo del equipo debe ser en 12 horas o se aplicará multa del <strong>2% del monto contractual por cada día de mora</strong>.
            </p>
            <div className="mt-3 text-[11px] font-mono text-gold-light bg-black/40 p-2.5 rounded border border-gold/20">
              <strong>Dictamen Smith:</strong> Formular Consulta y Observación formal antes del jueves solicitando ampliación a 48 horas bajo la Directiva OSCE N° 001-2024 para blindar el margen.
            </div>
          </div>

          {/* RTM Table Snippet */}
          <div className="mt-6">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Muestra de Requisitos Técnicos Mínimos (RTM - Cap. III)</span>
              <span className="text-gold text-[10px]">4 Requisitos Auditados</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Requisito Solicitado</th>
                    <th className="pb-2 text-center">Pág.</th>
                    <th className="pb-2">Criticidad</th>
                    <th className="pb-2">Acreditación Exigida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-300 font-light">
                  <tr>
                    <td className="py-2.5 font-mono text-slate-400">1</td>
                    <td className="py-2.5">
                      <strong className="text-white font-medium">Registro Sanitario Digemid</strong><br/>
                      <span className="text-[11px] text-slate-400">Monitores modulares y capnografía</span>
                    </td>
                    <td className="py-2.5 text-center font-mono text-gold">Pág. 42</td>
                    <td className="py-2.5 font-mono text-[10px] text-red-400">EXCLUYENTE</td>
                    <td className="py-2.5 text-[11px] text-slate-400">Copia simple de Registro Sanitario</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-mono text-slate-400">2</td>
                    <td className="py-2.5">
                      <strong className="text-white font-medium">Certificado ISO 13485:2016</strong><br/>
                      <span className="text-[11px] text-slate-400">Fabricante extranjero con traducción jurada</span>
                    </td>
                    <td className="py-2.5 text-center font-mono text-gold">Pág. 45</td>
                    <td className="py-2.5 font-mono text-[10px] text-red-400">EXCLUYENTE</td>
                    <td className="py-2.5 text-[11px] text-slate-400">Traducción Jurada Oficial (no simple)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-mono text-slate-400">3</td>
                    <td className="py-2.5">
                      <strong className="text-white font-medium">Garantía Comercial de 36 Meses</strong><br/>
                      <span className="text-[11px] text-slate-400">Stock de repuestos garantizado por 5 años</span>
                    </td>
                    <td className="py-2.5 text-center font-mono text-gold">Pág. 51</td>
                    <td className="py-2.5 font-mono text-[10px] text-amber-400">SUBSANABLE</td>
                    <td className="py-2.5 text-[11px] text-slate-400">Carta de representación autorizada</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Action inside Card */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <CheckCircle className="w-4 h-4 text-gold" />
              <span>Generado de forma determinista en 10 segundos.</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs !py-3 !px-6 w-full sm:w-auto"
            >
              <span>Pedir Matriz de tu Convocatoria</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
