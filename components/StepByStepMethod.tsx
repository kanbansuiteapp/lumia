"use client";

import { useState } from "react";

const STEPS = [
  {
    num: "01",
    badge: "Paso 1: Fundamento",
    title: "Modelo Base & Realismo Facial",
    desc: "El éxito de un influencer no reside en prompts complejos, sino en partir de una imagen base hiperrealista. Lumia incluye un estilo de realismo (poros, luz natural e imperfecciones de la piel) que reduce el aspecto artificial o de cera.",
    features: [
      "Generación vía Gemini Nano Banana o Replicate Flux",
      "Estilo de realismo: poros y textura de piel",
      "Luz natural y profundidad de campo tipo fotografía",
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
    badge: "Paso 2: Ángulos",
    title: "Técnica de los 3 Ángulos",
    desc: "Fijas la apariencia de tu personaje en tres perspectivas: frontal, 3/4 y perfil. Esas imágenes sirven como referencia para que su cara cambie lo menos posible entre una imagen y otra.",
    features: [
      "Referencia de rostro guardada en tu modelo",
      "Ayuda a mantener ojos, nariz y mandíbula",
      "Puedes repetir un ángulo si no sale bien",
      "Descargables desde tu galería",
    ],
    codeSnippet: `// Ángulos de referencia (ejemplo ilustrativo)
const referenceAngles = [
  { angle: "frontal_studio", target: "facial_symmetry" },
  { angle: "three_quarter_profile", target: "cheekbone_depth" },
  { angle: "lateral_90", target: "jawline_and_nasal_bridge" },
];`,
  },
  {
    num: "03",
    badge: "Paso 3: Asistente IA",
    title: "System Prompt & Archivo de Conocimiento",
    desc: "Lumia analiza los ángulos con un modelo de visión y redacta una descripción detallada en Markdown. Esa descripción se añade a cada generación para que las escenas que pidas se parezcan a tu modelo.",
    features: [
      "Descripción automática de rasgos",
      "Prompt del modelo editable",
      "Pensado para delegar la creación de contenido",
      "Cualquiera con acceso a tu cuenta puede generar con el mismo modelo",
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
    desc: "Crea tandas temáticas para su feed (café, viajes, moda, gimnasio…). La animación con Veo 3.1 y Kling 2.6, con frame inicial y final, está en desarrollo.",
    features: [
      "Generación por colecciones temáticas",
      "Intercambio de cara con referencias virales de Pinterest",
      "Animación con Veo 3.1 y Kling (próximamente)",
      "Imágenes guardadas en tu galería",
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
          Cómo se Construye un <span className="gradient-text">Influencer Virtual</span>
        </h2>
        <p className="section-subtext">
          Un proceso ordenado para crear y mantener un influencer virtual, paso a paso.
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
