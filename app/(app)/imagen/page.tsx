"use client";

import Link from "next/link";
import Dropdown from "@/components/Dropdown";
import { useEffect, useRef, useState } from "react";
import AiModelSelect from "@/components/AiModelSelect";
import { type Img, api, readImage, useConfigured, useInfluencers } from "@/lib/client";
import { ASPECTS, FROM_IMAGE_PROMPT, MODELS } from "@/lib/prompts";

export default function Imagen() {
  const { list, loaded } = useInfluencers();
  const configured = useConfigured();
  const [influencerId, setInfluencerId] = useState("");
  const [useModel, setUseModel] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [realism, setRealism] = useState(true);
  const [aspect, setAspect] = useState("3:4");
  const [aiModel, setAiModel] = useState(MODELS[0].id);
  const [reference, setReference] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [images, setImages] = useState<Img[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!influencerId && list[0]) setInfluencerId(list[0].id); }, [list, influencerId]);
  useEffect(() => {
    if (!influencerId) return setImages([]);
    api<{ images: Img[] }>(`/api/images?influencerId=${influencerId}&kind=lifestyle`).then((d) => d.ok && setImages(d.images));
  }, [influencerId]);

  const inf = list.find((i) => i.id === influencerId);

  async function onFile(f: File | undefined) {
    if (!f) return;
    try {
      setReference(await readImage(f));
      if (!prompt.trim()) setPrompt(FROM_IMAGE_PROMPT);
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Error" });
    }
  }

  async function generate() {
    setBusy(true); setMsg(null);
    const d = await api<{ image: Img }>("/api/generate", "POST", {
      influencerId, kind: "lifestyle", prompt, realism, model: aiModel, aspect, useModel, references: reference ? [reference] : [],
    });
    if (d.ok) { setMsg({ ok: true, text: "Imagen generada y guardada." }); setImages([d.image, ...images]); }
    else setMsg({ ok: false, text: d.message ?? "Error" });
    setBusy(false);
  }

  async function remove(id: string) {
    await api("/api/images", "DELETE", { id });
    setImages(images.filter((i) => i.id !== id));
  }

  if (loaded && list.length === 0)
    return (
      <main>
        <h1>Generar imagen</h1>
        <p className="sub">Primero crea un modelo en <Link href="/modelos" style={{ color: "var(--accent)" }}>Mis modelos</Link>.</p>
      </main>
    );

  return (
    <main>
      <h1>Generar imagen</h1>
      <p className="sub">Describe la escena. Con tu modelo activo se usa su cara de referencia y su prompt para mantener la identidad.</p>

      <div className="card">
        <div className="row" style={{ marginTop: 0 }}>
          <Dropdown value={influencerId} onChange={setInfluencerId} options={list.map((i) => ({ value: i.id, label: i.name }))} />
          <label className="check" style={{ margin: 0 }}>
            <input type="checkbox" checked={useModel} onChange={(e) => setUseModel(e.target.checked)} />
            Usar mi modelo {inf && !inf.face_url ? "(aún sin cara de referencia)" : "(cara + prompt)"}
          </label>
        </div>

        <label>Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ej: sentada en una cafetería soleada con un latte, outfit casual" />

        <label>Imagen de referencia de estilo o escena (opcional)</label>
        <div className="refbox">
          {reference && <img src={reference} alt="referencia" />}
          <button disabled={!consent} onClick={() => fileRef.current?.click()}>{reference ? "Cambiar" : "Subir imagen"}</button>
          {reference && <button onClick={() => setReference(null)}>Quitar</button>}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
        </div>
        <label className="check">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          La imagen es mía, de un personaje ficticio o tengo permiso de la persona retratada.
        </label>

        <label className="check">
          <input type="checkbox" checked={realism} onChange={(e) => setRealism(e.target.checked)} />
          Realismo fotográfico (poros, imperfecciones, luz natural)
        </label>

        <div className="row">
          <AiModelSelect value={aiModel} onChange={setAiModel} configured={configured} />
          <Dropdown value={aspect} onChange={setAspect} options={ASPECTS.map((a) => ({ value: a.id, label: a.label }))} />
          <button className="primary" disabled={busy || !influencerId || !prompt.trim()} onClick={generate}>{busy ? "Generando..." : "Generar"}</button>
        </div>
        {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
      </div>

      <h2>Resultados</h2>
      {images.length === 0 && <p className="sub">Aún no hay imágenes para este modelo.</p>}
      <div className="grid">
        {images.map((i) => (
          <div key={i.id} className="thumb">
            <img src={i.url} alt="" />
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
