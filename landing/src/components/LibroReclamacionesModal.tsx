"use client";

import React, { useState } from "react";
import { X, BookOpen, CheckCircle, Send } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LibroReclamacionesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    email: "",
    telefono: "",
    tipo: "RECLAMO",
    monto: "",
    descripcion: "",
    pedido: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomTicket = `LR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketNumber(randomTicket);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0A0C14] border border-white/[0.1] rounded-2xl sm:rounded-3xl shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Fixed */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-white/[0.08] bg-[#0A0C14]/90 shrink-0">
          <div className="flex items-center gap-3 pr-4">
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                Libro de Reclamaciones Virtual
              </h3>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                Ley N° 29571 &bull; D.S. N° 011-2011-PCM (INDECOPI)
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

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-white">
                Hoja de Reclamación Registrada
              </h4>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] inline-block font-mono text-xs text-gold">
                Código de Constancia: <strong>{ticketNumber}</strong>
              </div>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Hemos remitido una constancia formal a <strong>{formData.email}</strong>. Conforme al marco legal de INDECOPI, daremos respuesta a su requerimiento en un plazo no mayor a 15 días hábiles.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="btn-primary text-xs !py-2.5 !px-6"
                >
                  Cerrar Ventana
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[10px] sm:text-[11px] text-slate-400 font-mono leading-relaxed">
                <strong>Proveedor:</strong> Licitaciones QP &bull; The Quant Partners<br />
                <strong>Atención:</strong> partners@thequantpartners.com &bull; Lima, Perú
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nombres / Razón Social *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/[0.1] text-white focus:border-gold outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">DNI / RUC *</label>
                  <input
                    type="text"
                    required
                    value={formData.documento}
                    onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                    placeholder="Ej. 20601234567"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/[0.1] text-white focus:border-gold outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nombre@empresa.com"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/[0.1] text-white focus:border-gold outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Teléfono Móvil *</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+51 999 999 999"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/[0.1] text-white focus:border-gold outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo de Presentación *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/[0.1] text-white focus:border-gold outline-none text-xs"
                  >
                    <option value="RECLAMO">Reclamo (Disconformidad con el servicio)</option>
                    <option value="QUEJA">Queja (Disconformidad con la atención)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Monto Reclamado (PEN - Opcional)</label>
                  <input
                    type="text"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    placeholder="S/. 0.00"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/[0.1] text-white focus:border-gold outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Detalle del Reclamo o Queja *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describa claramente los hechos ocurridos..."
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/[0.1] text-white focus:border-gold outline-none text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Pedido Concreto *</label>
                <input
                  type="text"
                  required
                  value={formData.pedido}
                  onChange={(e) => setFormData({ ...formData, pedido: e.target.value })}
                  placeholder="Indique qué solución solicita a la empresa..."
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/[0.1] text-white focus:border-gold outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-full border border-white/[0.1] text-slate-400 hover:text-white text-xs transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto btn-primary text-xs !py-2.5 !px-5"
                >
                  <Send className="w-3.5 h-3.5 text-obsidian" />
                  <span>Registrar Hoja de Reclamación</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
