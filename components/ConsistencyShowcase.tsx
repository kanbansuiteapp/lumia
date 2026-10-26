"use client";

import { useState } from "react";

const ANGLES = [
  {
    id: "front",
    title: "1. Ángulo Frontal",
    subtitle: "Rostro Maestro",
    img: "/images/angle_front.jpg",
    desc: "Define la cara base de tu modelo: forma del rostro, ojos, labios y textura de piel.",
    stat: "Rostro de referencia",
    tag: "Referencia A",
  },
  {
    id: "three_quarter",
    title: "2. Ángulo 3/4 (Escorzo)",
    subtitle: "Proyección Tridimensional",
    img: "/images/angle_three_quarter.jpg",
    desc: "El ángulo más difícil para una IA. Usar la cara de referencia ayuda a mantener a la misma persona cuando el rostro gira.",
    stat: "Ángulo 3/4",
    tag: "Referencia B",
  },
  {
    id: "profile",
    title: "3. Perfil a 90°",
    subtitle: "Consistencia de Contorno",
    img: "/images/angle_profile.jpg",
    desc: "Aporta la nariz, la mandíbula y la oreja de lado, para tomas laterales más coherentes.",
    stat: "Ángulo de perfil",
    tag: "Referencia C",
  },
];

const FEATURES_HIGHLIGHT = [
  {
    icon: "👁️",
    title: "Iris y Mirada Idénticos",
    desc: "Ejemplo de rasgo que se describe en el prompt del modelo: el color y la mirada.",
  },
  {
    icon: "✨",
    title: "Micro-Textura y Poros Orgánicos",
    desc: "El estilo de realismo pide poros visibles, pecas sutiles y pequeñas imperfecciones.",
  },
  {
    icon: "📐",
    title: "Estructura descrita en el prompt",
    desc: "Las proporciones se describen en el prompt del modelo para que el influencer sea reconocible.",
  },
  {
    icon: "🎨",
    title: "Adaptabilidad Lumínica",
    desc: "Puedes pedir la misma persona con luz de estudio, sol directo o atardecer.",
  },
];

export default function ConsistencyShowcase() {
  const [selectedAngle, setSelectedAngle] = useState<string>("three_quarter");

  return (
    <div className="consistency-section">
      <div className="section-header-center">
        <div className="pill-badge">El Secreto de la Consistencia</div>
        <h2 className="headline-h2">
          El Método de los <span className="gradient-text">3 Ángulos de Referencia</span>
        </h2>
        <p className="section-subtext">
          Muchas herramientas de IA generan un rostro distinto en cada clic. En Lumia fijas a tu influencer con
          3 ángulos de referencia y un prompt del modelo, para que se parezca más de una imagen a otra.
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
