"use client";

import { useState } from "react";

const STEPS = [
  {
    num: "01",
    badge: "Paso 1: Fundamento",
    title: "Modelo Base & Realismo Facial",
    desc: "El éxito de un influencer no reside en prompts complejos, sino en partir de una imagen base hiperrealista. Lumia calibra parámetros de porosidad, refracción de luz e imperfecciones cutáneas que eliminan por completo el aspecto artificial o de cera.",
    features: [
      "Generación vía Gemini Nano Banana o Replicate Flux",
      "Calibración de micro-poros y textura epidérmica",
      "Iluminación fotorrealista de lente 85mm f/1.4",
      "Compatible con referencias externas transformadas",
    ],
    codeSnippet: `// Parámetros de Realismo Facial Lumia
const basePrompt = {
  texture: "organic skin micro-pores, subtle freckles, no airbrushing",
  optics: "85mm prime lens, shallow depth of field, real catchlights",
  engine: "gemini-nano-banana-pro",
};`,
  },
  {
    num: "02",
    badge: "Paso 2: Biometría",
    title: "Técnica de los 3 Ángulos",
    desc: "Fijamos la identidad anatómica de tu personaje en tres perspectivas obligatorias: frontal de estudio, escorzo a 3/4 y perfil a 90°. Esta tríada biométrica actúa como la huella dactilar de tu influencer para evitar que su cara mute.",
    features: [
      "Bloqueo fisonómico permanente",
      "Consistencia de iris, puente nasal y mandíbula",
      "Tolerancia cero a deformaciones angulares",
      "Exportable a cualquier entorno de render",
    ],
    codeSnippet: `// Tríada Biométrica Maestra
const biometricAngles = [
  { angle: "frontal_studio", target: "facial_symmetry" },
  { angle: "three_quarter_profile", target: "cheekbone_depth" },
  { angle: "lateral_90", target: "jawline_and_nasal_bridge" },
];`,
  },
  {
    num: "03",
    badge: "Paso 3: Asistente IA",
    title: "System Prompt & Archivo de Conocimiento",
    desc: "Lumia procesa los 3 ángulos con modelos de visión y redacta un documento fisonómico exhaustivo en Markdown. Este archivo de conocimiento alimenta a tu Asistente personalizado para que cualquier escena que pidas conserve la misma persona.",
    features: [
      "Extracción automática de rasgos fisonómicos",
      "Generación de System Prompt personalizado",
      "Eliminación de cuellos de botella en la delegación",
      "Cualquier colaborador puede generar contenido consistente",
    ],
    codeSnippet: `// System Prompt del Asistente del Influencer
system: "Actúas como el director visual de Elena Vance.
Cada prompt debe integrar de forma inmutable su descripción fisonómica:
ojos verdes avellana, tez con micro-poros, pelo castaño con destellos miel."`,
  },
  {
    num: "04",
    badge: "Paso 4: Escalado",
    title: "Contenido Lifestyle & Animación en Vídeo",
    desc: "Crea tandas temáticas masivas para su feed (café, viajes de lujo, eventos de gala, fitness) y dale vida con animación cinemática usando Veo 3.1 y Kling 2.6 mediante la técnica de frame inicial y final.",
    features: [
      "Generación por colecciones temáticas en 1 clic",
      "Intercambio de cara con referencias virales de Pinterest",
      "Animación cinemática sin cortes con Veo 3.1 & Kling",
      "Descarga en alta definición lista para programar en redes",
    ],
    codeSnippet: `// Pipeline de Animación Cinemática
const animationConfig = {
  startFrame: "/models/elena/lifestyle_cafe.jpg",
  endFrame: "/models/elena/lifestyle_cafe_look_up.jpg",
  engine: "veo-3.1",
  motion: "natural breathing, cinematic head turn",
};`,
  },
];

export default function StepByStepMethod() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="method-section" id="como-funciona">
      <div className="section-header-center">
        <div className="pill-badge">Flujo Profesional de 4 Pasos</div>
        <h2 className="headline-h2">
          Cómo se Construye un <span className="gradient-text">Influencer Virtual Rentable</span>
        </h2>
        <p className="section-subtext">
          Diseñado para creadores y agencias que necesitan un proceso predecible, escalable y sin cuellos de
          botella creativos.
        </p>
      </div>

      {/* Tabs on Mobile / Desktop */}
      <div className="method-tabs-nav">
        {STEPS.map((s, idx) => (
          <button
            key={s.num}
            type="button"
            className={`method-tab-btn ${activeTab === idx ? "active" : ""}`}
            onClick={() => setActiveTab(idx)}
          >
            <span className="step-tab-num">{s.num}</span>
            <span className="step-tab-title">{s.title.split("&")[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Step Showcase Card */}
      <div className="method-card-display">
        <div className="method-display-left">
          <div className="method-step-pill">{STEPS[activeTab].badge}</div>
          <h3 className="method-step-title">{STEPS[activeTab].title}</h3>
          <p className="method-step-desc">{STEPS[activeTab].desc}</p>

          <div className="method-features-list">
            {STEPS[activeTab].features.map((f) => (
              <div key={f} className="method-feat-item">
                <span className="feat-check">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="method-display-right">
          <div className="code-window">
            <div className="code-window-bar">
              <span className="code-dot red" />
              <span className="code-dot yellow" />
              <span className="code-dot green" />
              <span className="code-filename">metodologia_paso_{STEPS[activeTab].num}.ts</span>
            </div>
            <pre className="code-content">
              <code>{STEPS[activeTab].codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
