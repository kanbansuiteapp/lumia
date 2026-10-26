"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Cómo ayuda Lumia a mantener la misma cara en todas las imágenes?",
    a: "En lugar de depender solo de un prompt de texto, Lumia guarda una cara de referencia y 3 ángulos (frontal, 3/4 y perfil). Una IA con visión analiza esas imágenes y escribe una descripción del modelo, que se añade junto con la cara de referencia a cada generación. Ayuda mucho a mantener el parecido, pero ningún modelo de IA lo garantiza al 100%: a veces hay que repetir una imagen.",
  },
  {
    q: "¿Qué significa el modelo BYOK (Bring Your Own Key) y por qué es una ventaja?",
    a: "BYOK significa 'Trae tus propias API keys'. En lugar de pagar una suscripción con créditos, conectas tus propias cuentas de Google Gemini, Replicate u OpenAI. Lumia no cobra por imagen: pagas directamente al proveedor según su tarifa vigente.",
  },
  {
    q: "¿Tengo derechos comerciales completos sobre las imágenes y los influencers que cree?",
    a: "Los derechos de uso comercial dependen de los términos del proveedor de IA que uses (Google, OpenAI, Replicate) y de que tengas derecho a las imágenes que subas. Lumia no reclama propiedad sobre lo que generas. Revisa los términos de cada proveedor antes de usar el contenido en campañas.",
  },
  {
    q: "¿Qué proveedores de Inteligencia Artificial puedo utilizar dentro de Lumia?",
    a: "Lumia se conecta con Google Gemini (Nano Banana Pro y Nano Banana), OpenAI (GPT Image) y Replicate (Flux 1.1 Pro y Flux Kontext Pro). Puedes cambiar de uno a otro al generar.",
  },
  {
    q: "¿Cómo funciona la función de Intercambiar Cara con referencias de Pinterest?",
    a: "Si encuentras una pose, estilismo o composición viral en Pinterest o Instagram, puedes subirla a Lumia. Lumia le pide a la IA que recree la escena con la misma ropa, luz y ángulo, pero con el rostro de tu modelo. El resultado depende del modelo de IA y no siempre es exacto. Solo sube imágenes sobre las que tengas derecho.",
  },
  {
    q: "¿Se puede generar vídeo y animación?",
    a: "Está en desarrollo: la idea es animar con frame inicial y frame final usando Veo 3.1 de Google y Kling 2.6. Todavía no está disponible dentro de Lumia.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="faq-section" id="faq">
      <div className="section-header-center">
        <div className="pill-badge">Resolvemos tus Dudas</div>
        <h2 className="headline-h2">
          Preguntas <span className="gradient-text">Frecuentes</span>
        </h2>
        <p className="section-subtext">
          Todo lo que necesitas saber sobre consistencia, costes de generación y derechos comerciales.
        </p>
      </div>

      <div className="faq-list">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.q} className={`faq-item ${isOpen ? "open" : ""}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
              >
                <span className="faq-q-text">{faq.q}</span>
                <span className="faq-icon">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="faq-answer-pane">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
