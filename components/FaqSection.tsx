"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Cómo garantiza Lumia que la cara del influencer sea siempre la misma?",
    a: "A diferencia de herramientas genéricas que dependen solo de un prompt de texto, Lumia implementa una Tríada Biométrica Maestra: generamos y fijamos 3 ángulos obligatorios (frontal, 3/4 y perfil a 90°). Nuestro motor de visión analiza la fisonomía exacta y redacta un archivo de conocimiento que guía cada nueva toma lifestyle o intercambio de pose.",
  },
  {
    q: "¿Qué significa el modelo BYOK (Bring Your Own Key) y por qué es una ventaja?",
    a: "BYOK significa 'Trae tus propias API keys'. En lugar de pagar una suscripción inflada de $50 o $100 al mes con límites artificiales de créditos, conectas directamente tus cuentas de Google Gemini, Replicate o OpenAI. Solo pagas a precio de coste oficial directo al proveedor (fracciones de céntimo por imagen), sin recargo alguno.",
  },
  {
    q: "¿Tengo derechos comerciales completos sobre las imágenes y los influencers que cree?",
    a: "Sí, al 100%. Los modelos que diseñas, su identidad visual y las imágenes generadas son de tu propiedad absoluta para acuerdos publicitarios, marcas de moda, patrocinadores o venta de productos digitales.",
  },
  {
    q: "¿Qué proveedores de Inteligencia Artificial puedo utilizar dentro de Lumia?",
    a: "Lumia cuenta con conectores nativos para Google Gemini (con soporte para modelos Nano Banana Pro), OpenAI (GPT Image) y Replicate (Flux 1.1 Pro y variantes de realismo extremo). Puedes alternar entre ellos con un solo clic.",
  },
  {
    q: "¿Cómo funciona la función de Intercambiar Cara con referencias de Pinterest?",
    a: "Si encuentras una pose, estilismo o composición viral en Pinterest o Instagram, puedes subirla a Lumia. Nuestro sistema recrea la escena con la misma ropa, luz y ángulo, pero sustituyendo el rostro por la biometría exacta de tu modelo virtual.",
  },
  {
    q: "¿Cómo se genera vídeo y animación de los modelos?",
    a: "Utilizamos la técnica de interpolación por Frame Inicial y Frame Final a través de los motores Veo 3.1 de Google y Kling 2.6. Esto permite transiciones cinemáticas fluidas (como mirar a cámara, guiñar un ojo o sonreír) sin deformaciones grotescas.",
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
