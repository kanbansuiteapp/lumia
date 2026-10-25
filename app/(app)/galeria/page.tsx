"use client";

import Dropdown from "@/components/Dropdown";
import { useEffect, useState } from "react";
import { type Img, api, useInfluencers } from "@/lib/client";

const KINDS = [
  { id: "", label: "Todo" },
  { id: "base", label: "Caras" },
  { id: "angle", label: "Ángulos" },
  { id: "lifestyle", label: "Lifestyle" },
];

export default function Galeria() {
  const { list } = useInfluencers();
  const [kind, setKind] = useState("");
  const [influencerId, setInfluencerId] = useState("");
  const [images, setImages] = useState<Img[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams();
    if (kind) q.set("kind", kind);
    if (influencerId) q.set("influencerId", influencerId);
    api<{ images: Img[] }>(`/api/images?${q}`).then((d) => { if (d.ok) setImages(d.images); setLoaded(true); });
  }, [kind, influencerId]);

  async function remove(id: string) {
    await api("/api/images", "DELETE", { id });
    setImages(images.filter((i) => i.id !== id));
  }

  return (
    <main>
      <h1>Galería</h1>
      <p className="sub">Todas las imágenes que has generado.</p>
      <div className="row" style={{ marginTop: 0 }}>
        <div className="chips" style={{ marginTop: 0 }}>
          {KINDS.map((k) => (
            <button key={k.id} className={`chip ${kind === k.id ? "sel" : ""}`} onClick={() => setKind(k.id)}>{k.label}</button>
          ))}
        </div>
        <Dropdown value={influencerId} onChange={setInfluencerId} options={[{ value: "", label: "Todos los modelos" }, ...list.map((i) => ({ value: i.id, label: i.name }))]} />
      </div>
      {loaded && images.length === 0 && <p className="sub">No hay imágenes todavía.</p>}
      <div className="grid">
        {images.map((i) => (
          <div key={i.id} className="thumb">
            <img src={i.url} alt="" title={i.prompt ?? ""} />
            <div className="meta">
              <a href={i.url} target="_blank" rel="noreferrer" style={{ color: "var(--muted)" }}>Abrir</a>
              <button onClick={() => remove(i.id)}>×</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
