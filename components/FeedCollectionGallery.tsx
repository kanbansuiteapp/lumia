"use client";

import { useState } from "react";

type CategoryFilter = "all" | "cafe" | "travel" | "fashion";

interface PostItem {
  id: string;
  img: string;
  category: "cafe" | "travel" | "fashion";
  title: string;
  location: string;
  likes: string;
  comments: string;
  promptSample: string;
}

const POSTS: PostItem[] = [
  {
    id: "post-1",
    img: "/images/lifestyle_cafe.jpg",
    category: "cafe",
    title: "Primer café en Galleria Vittorio Emanuele",
    location: "Milán, Italia",
    likes: "4,829",
    comments: "142",
    promptSample: "Candid morning cafe photo, oversized knit cardigan, holding porcelain espresso cup, soft bokeh",
  },
  {
    id: "post-2",
    img: "/images/lifestyle_travel.jpg",
    category: "travel",
    title: "Atardeceres dorados que recargan energía",
    location: "Positano, Costa Amalfitana",
    likes: "6,410",
    comments: "284",
    promptSample: "Sunset balcony overlooking Amalfi cliff villas, linen summer blouse, wind tousled brunette hair",
  },
  {
    id: "post-3",
    img: "/images/hero_influencer.jpg",
    category: "fashion",
    title: "Golden Hour en el nuevo estudio creativo",
    location: "Madrid, España",
    likes: "5,190",
    comments: "198",
    promptSample: "35mm natural light test portrait, cozy knit, real skin pores, warm light reflection",
  },
  {
    id: "post-4",
    img: "/images/angle_three_quarter.jpg",
    category: "fashion",
    title: "Pruebas de cámara para la nueva campaña",
    location: "Estudio Lumia",
    likes: "3,940",
    comments: "115",
    promptSample: "Clean studio test portrait, black crewneck tee, subtle caramel highlights, 85mm portrait",
  },
];

export default function FeedCollectionGallery() {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [activeModalPost, setActiveModalPost] = useState<PostItem | null>(null);

  const filtered = filter === "all" ? POSTS : POSTS.filter((p) => p.category === filter);

  return (
    <div className="feed-gallery-section" id="galeria-lifestyle">
      <div className="section-header-center">
        <div className="pill-badge">Feed Listo para Instagram</div>
        <h2 className="headline-h2">
          Llena su Perfil de <span className="gradient-text">Contenido Lifestyle Infinito</span>
        </h2>
        <p className="section-subtext">
          Genera tandas de 10 a 50 publicaciones por temática en minutos. Tu modelo virtual puede estar
          tomando un espresso en Milán hoy y cenando en la Costa Amalfitana mañana, siempre con su misma cara.
        </p>
      </div>

      {/* Simulated Instagram Profile Header */}
      <div className="ig-mock-profile">
        <div className="ig-profile-top">
          <div className="ig-avatar-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero_influencer.jpg" alt="Elena Vance" className="ig-avatar-img" />
          </div>
          <div className="ig-profile-info">
            <div className="ig-name-row">
              <span className="ig-handle">elena.vance_ai</span>
              <span className="ig-verified">✓</span>
              <span className="ig-badge-ai">Virtual Creator</span>
            </div>
            <div className="ig-stats-row">
              <div className="ig-stat"><strong>184</strong> <span>publicaciones</span></div>
              <div className="ig-stat"><strong>62.4K</strong> <span>seguidores</span></div>
              <div className="ig-stat"><strong>218</strong> <span>siguiendo</span></div>
            </div>
            <div className="ig-bio">
              <strong>Elena Vance</strong> · Creadora de Moda & Lifestyle con IA ✨<br />
              Explorando arquitectura, alta costura y rincones del mundo.<br />
              <span className="ig-link">lumia.ai/model/elena-vance</span>
            </div>
          </div>
        </div>

        {/* Stories Highlights Carousel */}
        <div className="ig-stories-row">
          <div className="ig-story-item">
            <div className="ig-story-circle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/lifestyle_cafe.jpg" alt="Milano" />
            </div>
            <span>Milano ☕</span>
          </div>
          <div className="ig-story-item">
            <div className="ig-story-circle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/lifestyle_travel.jpg" alt="Amalfi" />
            </div>
            <span>Amalfi 🌊</span>
          </div>
          <div className="ig-story-item">
            <div className="ig-story-circle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero_influencer.jpg" alt="Studio" />
            </div>
            <span>Estudio 📸</span>
          </div>
          <div className="ig-story-item">
            <div className="ig-story-circle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/angle_three_quarter.jpg" alt="Lookbook" />
            </div>
            <span>Lookbook ✨</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="ig-filter-bar">
          <button
            type="button"
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todas las Colecciones
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === "cafe" ? "active" : ""}`}
            onClick={() => setFilter("cafe")}
          >
            ☕ Rutina & Café
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === "travel" ? "active" : ""}`}
            onClick={() => setFilter("travel")}
          >
            ✈️ Destinos de Viaje
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === "fashion" ? "active" : ""}`}
            onClick={() => setFilter("fashion")}
          >
            👗 Moda & Sesiones
          </button>
        </div>

        {/* Post Grid */}
        <div className="ig-posts-grid">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="ig-post-card"
              onClick={() => setActiveModalPost(post)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.img} alt={post.title} className="ig-post-img" />
              <div className="ig-post-overlay">
                <div className="ig-post-overlay-stats">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
                <div className="ig-post-overlay-title">{post.title}</div>
                <div className="ig-post-overlay-location">📍 {post.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal if a post is clicked */}
      {activeModalPost && (
        <div className="post-modal-backdrop" onClick={() => setActiveModalPost(null)}>
          <div className="post-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="post-modal-close"
              onClick={() => setActiveModalPost(null)}
            >
              ✕
            </button>
            <div className="post-modal-grid">
              <div className="post-modal-img-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeModalPost.img} alt={activeModalPost.title} />
              </div>
              <div className="post-modal-details">
                <div className="modal-header-user">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/hero_influencer.jpg" alt="Elena Vance" className="modal-avatar" />
                  <div>
                    <strong>elena.vance_ai</strong>
                    <div className="modal-loc">{activeModalPost.location}</div>
                  </div>
                </div>
                <div className="modal-post-caption">
                  <p>{activeModalPost.title}</p>
                  <div className="modal-tags">#virtualinfluencer #aiinfluencer #digitalmodel #lumia</div>
                </div>
                <div className="modal-prompt-box">
                  <div className="modal-prompt-lbl">Prompt de Generación:</div>
                  <code>{activeModalPost.promptSample}</code>
                </div>
                <div className="modal-footer-stats">
                  <span>❤️ {activeModalPost.likes} Me gusta</span>
                  <span>💬 {activeModalPost.comments} comentarios</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
