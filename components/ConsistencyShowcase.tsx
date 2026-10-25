"use client";

import { useState } from "react";

const ANGLES = [
  {
    id: "front",
    title: "1. Ángulo Frontal",
    subtitle: "Rostro Maestro",
    img: "/images/angle_front.jpg",
    desc: "Define la fisonomía canónica: distancia interpupilar, forma de pómulos, grosor labial y textura base de la dermis.",
    stat: "100% Identidad",
    tag: "Referencia A",
  },
  {
    id: "three_quarter",
    title: "2. Ángulo 3/4 (Escorzo)",
    subtitle: "Proyección Tridimensional",
    img: "/images/angle_three_quarter.jpg",
    desc: "La prueba de fuego donde fallan las IAs genéricas. Lumia mantiene la misma persona incluso cuando el rostro rota en el espacio.",
    stat: "99.8% Coincidencia",
    tag: "Referencia B",
  },
  {
    id: "profile",
    title: "3. Perfil a 90°",
    subtitle: "Consistencia de Contorno",
    img: "/images/angle_profile.jpg",
    desc: "Fija el caballete nasal, el ángulo goniaco de la mandíbula y la posición de la oreja para tomas laterales sin deformaciones.",
    stat: "99.6% Coincidencia",
    tag: "Referencia C",
  },
];

const FEATURES_HIGHLIGHT = [
  {
    icon: "👁️",
    title: "Iris y Mirada Idénticos",
    desc: "Tono verde avellana profundo con reflejos especulares naturales. Sin pupilas borrosas ni miradas artificiales.",
  },
  {
    icon: "✨",
    title: "Micro-Textura y Poros Orgánicos",
    desc: "Cada imagen conserva poros visibles, pecas sutiles y micro-imperfecciones que transmiten autenticidad humana real.",
  },
  {
    icon: "📐",
    title: "Estructura Ósea Bloqueada",
    desc: "Las proporciones de nariz, barbilla y pómulos no mutan entre diferentes tomas, asegurando un influencer reconocible.",
  },
  {
    icon: "🎨",
    title: "Adaptabilidad Lumínica",
    desc: "La misma fisonomía reacciona con coherencia fotográfica bajo luz de estudio neutra, sol directo o atardeceres dorados.",
  },
];

export default function ConsistencyShowcase() {
  const [selectedAngle, setSelectedAngle] = useState<string>("three_quarter");

  return (
    <div className="consistency-section">
      <div className="section-header-center">
        <div className="pill-badge">El Secreto de la Consistencia</div>
        <h2 className="headline-h2">
          El Método de los <span className="gradient-text">3 Ángulos Biométricos</span>
        </h2>
        <p className="section-subtext">
          La mayoría de las herramientas de IA generan un rostro diferente en cada clic. En Lumia, calibramos
          tu influencer a partir de 3 ángulos maestros interconectados, garantizando que sea la misma persona
          en miles de publicaciones.
        </p>
      </div>

      {/* 3 Angles Cards */}
      <div className="consistency-grid">
        {ANGLES.map((angle) => {
          const isSelected = selectedAngle === angle.id;
          return (
            <div
              key={angle.id}
              className={`consistency-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedAngle(angle.id)}
            >
              <div className="consistency-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={angle.img} alt={angle.title} className="consistency-img" />
                <div className="angle-floating-tag">{angle.tag}</div>
                <div className="angle-floating-stat">{angle.stat}</div>
              </div>
              <div className="consistency-card-content">
                <div className="consistency-card-title">{angle.title}</div>
                <div className="consistency-card-sub">{angle.subtitle}</div>
                <p className="consistency-card-desc">{angle.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Badges Grid */}
      <div className="consistency-features-grid">
        {FEATURES_HIGHLIGHT.map((feat) => (
          <div key={feat.title} className="consistency-feat-card">
            <span className="feat-icon">{feat.icon}</span>
            <div className="feat-info">
              <h4>{feat.title}</h4>
              <p>{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
