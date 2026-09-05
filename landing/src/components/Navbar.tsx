import React from "react";
import { ShieldCheck, MessageCircle } from "lucide-react";

export const Navbar = () => {
  const whatsappUrl = "https://wa.me/51924464410?text=Hola%20Kenneth,%20vi%20la%20plataforma%20Licitaciones%20QP%20y%20deseo%20solicitar%20la%20auditoría%20gratuita%20de%201%20convocatoria%20activa%20de%20mi%20rubro.";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#030407]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-surface border border-gold/30 flex items-center justify-center text-gold font-mono font-bold text-sm shadow-inner group-hover:border-gold transition-colors">
            QP
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-gold-light transition-colors">
              LICITACIONES <span className="text-gold">QP</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
              Unidad de Auditoría Pericial SEACE
            </span>
          </div>
        </a>

        {/* Action */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-[10px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Ley N° 30225 Compliant</span>
          </div>

          <a
            href="/login"
            className="text-[#F3E5AB] hover:text-white transition-all flex items-center gap-2 border border-[#D4AF37]/40 px-3.5 py-2 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-xs font-mono shadow-sm shadow-[#D4AF37]/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Acceso Clientes</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs !py-2.5 !px-5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Pedir Auditoría Gratis</span>
          </a>
        </div>
      </div>
    </header>
  );
};
