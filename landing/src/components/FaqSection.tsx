import React from "react";

export const FaqSection = () => {
  const faqs = [
    {
      q: "¿Cómo recibimos la información si no hay dashboard ni plataforma web?",
      a: "Esa es precisamente nuestra mayor ventaja. A las 07:30 AM recibes la alerta en el WhatsApp corporativo de tu equipo con el PDF ejecutivo de 3 páginas listo para abrir. No tienes que recordar contraseñas, ni navegar por interfaces complejas, ni capacitar a tu personal. Tu Director Comercial y tus analistas toman decisiones en 3 minutos desde su celular o laptop."
    },
    {
      q: "¿Por qué contratar Licitaciones QP si existen plataformas de búsqueda que cobran menos?",
      a: "Las plataformas convencionales de búsqueda te venden un panel con gráficos para que tu analista siga perdiendo 6 horas leyendo PDFs a medianoche. Nosotros somos una firma pericial llave en mano: te entregamos el dictamen técnico listo, con número de página exacto y alerta de multas abusivas directo a tu WhatsApp. No te cobramos por darte más trabajo frente a una pantalla; te cobramos por salvarte de multas y descalificaciones."
    },
    {
      q: "¿Qué pasa si las bases integradas del SEACE están escaneadas o son de mala calidad?",
      a: "Nuestro motor incorpora procesamiento multimodal avanzado calibrado para expedientes del Estado peruano. Es capaz de leer resoluciones torcidas, sellos notariales borrosos y tablas complejas de especificaciones técnicas que los OCR convencionales no logran interpretar."
    },
    {
      q: "¿Cómo se activa la Garantía de Precisión Pericial?",
      a: "Si postulas a una licitación auditada por nuestro sistema siguiendo rigurosamente las observaciones de nuestra Matriz, y el comité de selección te descalifica en la admisión o evaluación técnica por un requisito documental expreso en las bases que nuestro reporte omitió advertir, nos envías el acta oficial de descalificación del SEACE y te reembolsamos el 100% de la mensualidad pagada ese mes. La garantía cubre omisiones técnicas del sistema y no aplica por factores de precio, cartas fianza bancarias o negligencia del postor."
    },
    {
      q: "¿Tienen algún vínculo oficial con el OSCE, SEACE o entidades del Estado?",
      a: "No. Licitaciones QP es una firma tecnológica y pericial privada e independiente. No mantenemos vínculo institucional ni representación de ningún organismo público. Toda la información analizada proviene exclusivamente de fuentes oficiales públicas al amparo de la Ley N° 27806 (Ley de Transparencia y Acceso a la Información Pública)."
    }
  ];

  return (
    <section id="faq" className="py-24 max-w-4xl mx-auto px-6 border-t border-white/[0.06]">
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-3 py-1 text-[10px] font-mono tracking-widest text-gold border border-gold/30 rounded-full mb-4 uppercase bg-gold/5">
          Claridad Absoluta
        </div>
        <h2 className="font-serif text-3xl md:text-5xl font-medium text-white tracking-tight">
          Preguntas Frecuentes de <span className="text-gold-gradient italic">Directores y Gerentes.</span>
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="card-luxury rounded-2xl p-6 sm:p-8">
            <h3 className="font-serif text-lg font-medium text-white mb-3">
              {f.q}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
