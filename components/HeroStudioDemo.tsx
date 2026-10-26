"use client";

import { useState } from "react";
import Image from "next/image";

type ViewKey = "base" | "three_quarter" | "profile" | "editorial" | "cafe" | "travel";

interface ViewDetail {
  id: ViewKey;
  title: string;
  category: string;
  image: string;
  badge: string;
  similarity: string;
  promptSnippet: string;
  resolution: string;
  lighting: string;
}

const VIEWS: Record<ViewKey, ViewDetail> = {
  base: {
    id: "base",
    title: "1. Frontal Base (Canónica)",
    category: "Modelo de Identidad",
    image: "/images/angle_front.jpg",
    badge: "Identidad Base Fijada",
    similarity: "Rostro de referencia",
    promptSnippet: "Clean studio test shot, front-facing angle, looking directly into camera, natural skin pores, hazel green eyes",
    resolution: "Imagen de ejemplo",
    lighting: "Luz suave de estudio con reflejo natural en iris",
  },
  three_quarter: {
    id: "three_quarter",
    title: "2. Ángulo 3/4 (Escorzo)",
    category: "Consistencia de rostro",
    image: "/images/angle_three_quarter.jpg",
    badge: "Mapeo Fisonómico",
    similarity: "Ángulo 3/4",
    promptSnippet: "Clean studio test, exact same facial features, 3/4 angle, subtle confident gaze, visible skin texture",
    resolution: "Imagen de ejemplo",
    lighting: "Luz de relleno difusa + contorno neutro",
  },
  profile: {
    id: "profile",
    title: "3. Perfil a 90°",
    category: "Consistencia de rostro",
    image: "/images/angle_profile.jpg",
    badge: "Perfil Anatómico",
    similarity: "Ángulo de perfil",
    promptSnippet: "Sharp profile test shot, preserved nose bridge, ear structure and jawline contours, natural skin pores",
    resolution: "Imagen de ejemplo",
    lighting: "Contraluz suave sobre relieve de mandíbula",
  },
  editorial: {
    id: "editorial",
    title: "Retrato Editorial de Estudio",
    category: "Sesión de Campaña",
    image: "/images/hero_influencer.jpg",
    badge: "Lookbook Moda",
    similarity: "Escena lifestyle",
    promptSnippet: "35mm natural light test portrait, cozy knit sweater, real skin pores, warm light reflection, 85mm f/1.4",
    resolution: "Imagen de ejemplo",
    lighting: "Luz de ventana suave al atardecer",
  },
  cafe: {
    id: "cafe",
    title: "Lifestyle: Café en Milán",
    category: "Contenido de Feed",
    image: "/images/lifestyle_cafe.jpg",
    badge: "Sesión Urbana",
    similarity: "Escena lifestyle",
    promptSnippet: "Candid lifestyle photo at outdoor historic Milanese cafe, oversized cardigan, holding espresso, morning golden hour",
    resolution: "Instagram Ready 4:5",
    lighting: "Sol de mañana (Golden Hour) + bokeh urbano",
  },
  travel: {
    id: "travel",
    title: "Lifestyle: Costa Amalfitana",
    category: "Contenido de Lujo",
    image: "/images/lifestyle_travel.jpg",
    badge: "Sesión de Viajes",
    similarity: "Escena lifestyle",
    promptSnippet: "Luxury vacation photo on Amalfi cliff terrace at sunset, white linen top, gentle sea breeze, pastel villas in soft focus",
    resolution: "Instagram Ready 4:5",
    lighting: "Atardecer mediterráneo con halo dorado natural",
  },
};

export default function HeroStudioDemo() {
  const [activeKey, setActiveKey] = useState<ViewKey>("base");
  const [showPoreInspect, setShowPoreInspect] = useState(false);
  const [showBiometrics, setShowBiometrics] = useState(true);
  const [activeEngine, setActiveEngine] = useState<"gemini" | "replicate" | "openai">("gemini");

  const active = VIEWS[activeKey];

  return (
    <div className="studio-demo-wrap" id="estudio-demo">
      <div className="studio-demo-card">
        {/* Top Window Bar */}
        <div className="studio-topbar">
          <div className="studio-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="studio-app-title">Lumia AI Influencer Studio — Previsualización en Tiempo Real</span>
          </div>
          <div className="studio-engine-pill">
            <span className="engine-label">Motor Activo:</span>
            <button
              type="button"
              className={`engine-chip ${activeEngine === "gemini" ? "active" : ""}`}
              onClick={() => setActiveEngine("gemini")}
            >
              Gemini Nano Banana
            </button>
            <button
              type="button"
              className={`engine-chip ${activeEngine === "replicate" ? "active" : ""}`}
              onClick={() => setActiveEngine("replicate")}
            >
              Flux 1.1 Pro
            </button>
            <button
              type="button"
              className={`engine-chip ${activeEngine === "openai" ? "active" : ""}`}
              onClick={() => setActiveEngine("openai")}
            >
              GPT Image
            </button>
          </div>
        </div>

        {/* Main Studio Body */}
        <div className="studio-grid">
          {/* Left Column: Influencer Card & Persona Data */}
          <div className="studio-sidebar">
            <div className="model-profile-box">
              <div className="model-avatar-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/hero_influencer.jpg" alt="Elena Vance" className="model-avatar-img" />
                <span className="online-beacon" title="Modelo entrenado y listo" />
              </div>
              <div className="model-meta">
                <div className="model-name">
                  Elena Vance <span className="verified-badge" title="Modelo de ejemplo">✓</span>
                </div>
                <div className="model-handle">@elena.vance_ai</div>
                <div className="model-niche">Digital Muse • Milan & Madrid</div>
              </div>
            </div>

            <div className="studio-divider" />

            <div className="studio-controls-section">
              <div className="section-label">Técnica de los 3 Ángulos</div>
              <div className="angle-buttons-list">
                <button
                  type="button"
                  className={`angle-btn ${activeKey === "base" ? "selected" : ""}`}
                  onClick={() => setActiveKey("base")}
                >
                  <span className="angle-icon">🔘</span>
                  <div className="angle-btn-text">
                    <strong>1. Frontal Base</strong>
                    <small>Rostro de referencia maestra</small>
                  </div>
                  {activeKey === "base" && <span className="active-dot" />}
                </button>

                <button
                  type="button"
                  className={`angle-btn ${activeKey === "three_quarter" ? "selected" : ""}`}
                  onClick={() => setActiveKey("three_quarter")}
                >
                  <span className="angle-icon">📐</span>
                  <div className="angle-btn-text">
                    <strong>2. Ángulo 3/4</strong>
                    <small>Verificación de escorzo</small>
                  </div>
                  {activeKey === "three_quarter" && <span className="active-dot" />}
                </button>

                <button
                  type="button"
                  className={`angle-btn ${activeKey === "profile" ? "selected" : ""}`}
                  onClick={() => setActiveKey("profile")}
                >
                  <span className="angle-icon">👤</span>
                  <div className="angle-btn-text">
                    <strong>3. Perfil 90°</strong>
                    <small>Línea nasal y contorno</small>
                  </div>
                  {activeKey === "profile" && <span className="active-dot" />}
                </button>
              </div>

              <div className="section-label" style={{ marginTop: 14 }}>
                Escenas Lifestyle & Editorial
              </div>
              <div className="angle-buttons-list">
                <button
                  type="button"
                  className={`angle-btn ${activeKey === "editorial" ? "selected" : ""}`}
                  onClick={() => setActiveKey("editorial")}
                >
                  <span className="angle-icon">📸</span>
                  <div className="angle-btn-text">
                    <strong>Retrato Editorial</strong>
                    <small>Luz suave de estudio</small>
                  </div>
                  {activeKey === "editorial" && <span className="active-dot" />}
                </button>

                <button
                  type="button"
                  className={`angle-btn ${activeKey === "cafe" ? "selected" : ""}`}
                  onClick={() => setActiveKey("cafe")}
                >
                  <span className="angle-icon">☕</span>
                  <div className="angle-btn-text">
                    <strong>Café en Milán</strong>
                    <small>Luz matutina & calle</small>
                  </div>
                  {activeKey === "cafe" && <span className="active-dot" />}
                </button>

                <button
                  type="button"
                  className={`angle-btn ${activeKey === "travel" ? "selected" : ""}`}
                  onClick={() => setActiveKey("travel")}
                >
                  <span className="angle-icon">🌅</span>
                  <div className="angle-btn-text">
                    <strong>Costa Amalfitana</strong>
                    <small>Atardecer en terraza</small>
                  </div>
                  {activeKey === "travel" && <span className="active-dot" />}
                </button>
              </div>
            </div>

            <div className="studio-tools-row">
              <button
                type="button"
                className={`tool-toggle-btn ${showPoreInspect ? "on" : ""}`}
                onClick={() => setShowPoreInspect(!showPoreInspect)}
              >
                🔬 {showPoreInspect ? "Ocultar Lupa de Poros" : "Lupa de Poros Reales"}
              </button>
              <button
                type="button"
                className={`tool-toggle-btn ${showBiometrics ? "on" : ""}`}
                onClick={() => setShowBiometrics(!showBiometrics)}
              >
                🎯 {showBiometrics ? "Biometría ON" : "Biometría OFF"}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Viewport with Real Photo */}
          <div className="studio-viewport-col">
            <div className={`studio-canvas ${showPoreInspect ? "zoomed" : ""}`}>
              {/* Frame with 3:4 aspect-ratio to ensure the entire face is always 100% framed */}
              <div className="canvas-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.image}
                  alt={active.title}
                  key={active.image}
                  className={`canvas-main-img ${showPoreInspect ? "zoom-scale" : ""}`}
                />

                {/* Biometric Scan Overlay */}
                {showBiometrics && !showPoreInspect && (
                  <div className="biometric-hud" aria-hidden="true">
                    <div className="hud-corner tl" />
                    <div className="hud-corner tr" />
                    <div className="hud-corner bl" />
                    <div className="hud-corner br" />

                    {activeKey === "base" && (
                      <>
                        <div className="hud-marker marker-eye-l">
                          <span className="hud-ping" />
                          <span className="hud-label">Iris avellana</span>
                        </div>
                        <div className="hud-marker marker-eye-r">
                          <span className="hud-ping" />
                        </div>
                        <div className="hud-marker marker-nose">
                          <span className="hud-ping" />
                          <span className="hud-label">Fisonomía fijada</span>
                        </div>
                        <div className="hud-marker marker-skin">
                          <span className="hud-ping" />
                          <span className="hud-label">Micro-poros naturales</span>
                        </div>
                      </>
                    )}

                    <div className="hud-scanline" />
                  </div>
                )}
              </div>

              {/* Magnifier / Macro Inspection Banner */}
              {showPoreInspect && (
                <div className="pore-inspect-callout">
                  <div className="callout-badge">🔍 Inspección Micro-Textura (200% Zoom)</div>
                  <div className="callout-desc">
                    Poros reales, vello facial sutil y textura de queratina natural sin filtro de cera o plástico.
                  </div>
                </div>
              )}

              {/* Floating Canvas Badges */}
              <div className="canvas-badge-top">
                <span className="live-pill">● EN VIVO</span>
                <span className="category-pill">{active.category}</span>
                <span className="similarity-pill">{active.similarity}</span>
              </div>

              <div className="canvas-badge-bottom">
                <div className="canvas-meta-text">
                  <strong>{active.title}</strong>
                  <span>{active.lighting}</span>
                </div>
                <div className="canvas-res-pill">{active.resolution}</div>
              </div>
            </div>

            {/* Prompt & System Parameters Bar */}
            <div className="studio-prompt-bar">
              <div className="prompt-meta-header">
                <span className="prompt-badge">System Prompt Activo</span>
                <span className="prompt-time">Generado en 2.4s • API Directa</span>
              </div>
              <div className="prompt-code-display">
                <code>{active.promptSnippet}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
