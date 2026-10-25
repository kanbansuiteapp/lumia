"use client";

import Link from "next/link";
import Dropdown from "@/components/Dropdown";
import { useEffect, useState } from "react";
import AiModelSelect from "@/components/AiModelSelect";
import { type Img, api, useConfigured, useInfluencers } from "@/lib/client";
import { ASPECTS, LIFESTYLE_THEMES, MODELS } from "@/lib/prompts";

type Collection = { id: string; name: string };

export default function Lifestyle() {
  const { list, loaded } = useInfluencers();
  const configured = useConfigured();
  const [influencerId, setInfluencerId] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionId, setCollectionId] = useState("");
  const [newCol, setNewCol] = useState("");
  const [themeId, setThemeId] = useState(LIFESTYLE_THEMES[0].id);
  const [scenes, setScenes] = useState<string[]>(LIFESTYLE_THEMES[0].scenes);
  const [realism, setRealism] = useState(true);
  const [aspect, setAspect] = useState("3:4");
  const [aiModel, setAiModel] = useState(MODELS[0].id);
  const [images, setImages] = useState<Img[]>([]);
  const [progress, setProgress] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => { if (!influencerId && list[0]) setInfluencerId(list[0].id); }, [list, influencerId]);
  useEffect(() => {
    setCollectionId("");
    if (!influencerId) return setCollections([]);
    api<{ collections: Collection[] }>(`/api/collections?influencerId=${influencerId}`).then((d) => {
      if (d.ok) { setCollections(d.collections); setCollectionId(d.collections[0]?.id ?? ""); }
    });
  }, [influencerId]);
  useEffect(() => {
    if (!collectionId) return setImages([]);
    api<{ images: Img[] }>(`/api/images?collectionId=${collectionId}`).then((d) => d.ok && setImages(d.images));
  }, [collectionId]);

  function pickTheme(id: string) {
    setThemeId(id);
    setScenes(LIFESTYLE_THEMES.find((t) => t.id === id)!.scenes);
  }

  async function createCollection() {
    const d = await api<{ collection: Collection }>("/api/collections", "POST", { influencerId, name: newCol });
    if (!d.ok) return setMsg({ ok: false, text: d.message ?? "Error" });
    setCollections([d.collection, ...collections]);
    setCollectionId(d.collection.id);
    setNewCol("");
  }

  async function generateAll() {
    const todo = scenes.map((s) => s.trim()).filter(Boolean);
    setMsg(null);
    let done = 0;
    for (const [i, scene] of todo.entries()) {
      setProgress(`Generando escena ${i + 1} de ${todo.length}...`);
      const d = await api<{ image: Img }>("/api/generate", "POST", {
        influencerId, kind: "lifestyle", prompt: scene, realism, model: aiModel, aspect, useModel: true, collectionId,
      });
      if (!d.ok) { setMsg({ ok: false, text: `Escena ${i + 1}: ${d.message}` }); break; }
      done++;
      setImages((prev) => [d.image, ...prev]);
    }
    setProgress("");
    if (done === todo.length) setMsg({ ok: true, text: `${done} escenas generadas.` });
  }

  async function remove(id: string) {
    await api("/api/images", "DELETE", { id });
    setImages(images.filter((i) => i.id !== id));
  }

  if (loaded && list.length === 0)
    return (
      <main>
        <h1>Contenido lifestyle</h1>
        <p className="sub">Primero crea un modelo con cara de referencia en <Link href="/modelos" style={{ color: "var(--accent)" }}>Mis modelos</Link>.</p>
      </main>
    );

  const busy = progress !== "";
  const validScenes = scenes.filter((s) => s.trim()).length;
  return (
    <main>
      <h1>Contenido lifestyle</h1>
      <p className="sub">Genera tandas de escenas de tu modelo (café, viajes, gimnasio…) con la misma cara y estilo, y organízalas por colecciones.</p>

      <div className="cols">
        <div>
          <div className="card">
            <div className="name">1. Modelo</div>
            <div style={{ marginTop: 10 }}>
              {list.map((i) => (
                <button key={i.id} className={`pick ${i.id === influencerId ? "sel" : ""}`} onClick={() => setInfluencerId(i.id)}>
                  {i.face_url ? <img className="avatar" src={i.face_url} alt="" /> : <span className="avatar">👤</span>}
                  {i.name}
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="name">2. Colección</div>
            <div className="row">
              <input placeholder="Nueva colección" value={newCol} onChange={(e) => setNewCol(e.target.value)} />
              <button disabled={!newCol.trim() || !influencerId} onClick={createCollection}>+</button>
            </div>
            {collections.length === 0 ? (
              <div className="used" style={{ marginTop: 8 }}>Crea una colección para empezar.</div>
            ) : (
              <div style={{ marginTop: 8 }}>
                <Dropdown block value={collectionId} onChange={setCollectionId} options={collections.map((c) => ({ value: c.id, label: c.name }))} />
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="name">3. Tema y escenas</div>
          <div className="chips">
            {LIFESTYLE_THEMES.map((t) => (
              <button key={t.id} className={`chip ${themeId === t.id ? "sel" : ""}`} onClick={() => pickTheme(t.id)}>{t.label}</button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            {scenes.map((s, i) => (
              <div key={i} className="scene">
                <input value={s} onChange={(e) => setScenes(scenes.map((x, j) => (j === i ? e.target.value : x)))} />
                <button onClick={() => setScenes(scenes.filter((_, j) => j !== i))}>🗑</button>
              </div>
            ))}
            <button className="chip" onClick={() => setScenes([...scenes, ""])}>+ Añadir escena</button>
          </div>
          <div className="row">
            <label className="check" style={{ margin: 0 }}>
              <input type="checkbox" checked={realism} onChange={(e) => setRealism(e.target.checked)} /> Realismo fotográfico
            </label>
            <Dropdown value={aspect} onChange={setAspect} options={ASPECTS.map((a) => ({ value: a.id, label: a.label }))} />
            <AiModelSelect value={aiModel} onChange={setAiModel} configured={configured} />
            <button className="primary" style={{ marginLeft: "auto" }} disabled={busy || !collectionId || validScenes === 0} onClick={generateAll}>
              {busy ? progress : `Generar ${validScenes} escenas`}
            </button>
          </div>
          {!collectionId && <div className="used" style={{ marginTop: 8 }}>Elige o crea una colección para generar.</div>}
          {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
        </div>
      </div>

      <h2>Colección</h2>
      {images.length === 0 && <p className="sub">Esta colección está vacía.</p>}
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
