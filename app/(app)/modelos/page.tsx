"use client";

import { useEffect, useRef, useState } from "react";
import AiModelSelect from "@/components/AiModelSelect";
import { useConfirm } from "@/components/useConfirm";
import { type Img, type Influencer, api, readImage, useConfigured, useInfluencers } from "@/lib/client";
import { ANGLES, FROM_IMAGE_PROMPT, MODELS } from "@/lib/prompts";

type Msg = { ok: boolean; text: string } | null;

function ModelCard({ inf, aiModel, onChanged }: { inf: Influencer; aiModel: string; onChanged: () => void }) {
  const { ask, dialog } = useConfirm();
  const [images, setImages] = useState<Img[]>([]);
  const [prompt, setPrompt] = useState(inf.prompt ?? "");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState<Msg>(null);
  const [consent, setConsent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadImages() {
    const d = await api<{ images: Img[] }>(`/api/images?influencerId=${inf.id}`);
    if (d.ok) setImages(d.images);
  }
  useEffect(() => { loadImages(); }, [inf.id]);
  useEffect(() => setPrompt(inf.prompt ?? ""), [inf.prompt]);

  const faces = images.filter((i) => i.kind === "base");
  const angleImg = (id: string) => images.find((i) => i.angle === id);

  async function gen(label: string, body: object) {
    const d = await api<{ image: Img }>("/api/generate", "POST", { influencerId: inf.id, model: aiModel, realism: true, ...body });
    if (!d.ok) { setMsg({ ok: false, text: d.message ?? "Error" }); return false; }
    setImages((prev) => [d.image, ...prev]);
    return true;
  }

  async function genFace() {
    setBusy("face"); setMsg(null);
    const ok = await gen("face", { kind: "base", prompt: inf.description || "Retrato realista de una influencer lifestyle", aspect: "3:4" });
    if (ok) setMsg({ ok: true, text: "Cara generada." });
    setBusy("");
  }

  async function fromPhoto(f: File | undefined) {
    if (!f) return;
    setBusy("face"); setMsg(null);
    try {
      const ref = await readImage(f);
      const ok = await gen("face", { kind: "base", prompt: FROM_IMAGE_PROMPT, references: [ref], aspect: "3:4" });
      if (ok) setMsg({ ok: true, text: "Cara generada desde tu imagen." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Error" });
    }
    setBusy("");
  }

  async function setFace(id: string) {
    await api("/api/influencers", "PATCH", { id: inf.id, face_image_id: id });
    onChanged();
  }

  async function genAngles() {
    const face = faces.find((f) => f.id === inf.face_image_id);
    if (!face) return setMsg({ ok: false, text: "Primero elige una cara de referencia." });
    setBusy("angles"); setMsg(null);
    for (const a of ANGLES) {
      setBusy(`angles:${a.label}`);
      const ok = await gen("angle", { kind: "angle", angle: a.id, prompt: a.prompt, references: [face.url], aspect: "3:4" });
      if (!ok) break;
    }
    setBusy("");
  }

  async function analyze() {
    setBusy("prompt"); setMsg(null);
    const d = await api<{ prompt: string }>("/api/analyze", "POST", { influencerId: inf.id });
    if (d.ok) { setPrompt(d.prompt); setMsg({ ok: true, text: "Prompt creado y guardado." }); onChanged(); }
    else setMsg({ ok: false, text: d.message ?? "Error" });
    setBusy("");
  }

  async function savePrompt() {
    const d = await api("/api/influencers", "PATCH", { id: inf.id, prompt });
    setMsg(d.ok ? { ok: true, text: "Cambios guardados." } : { ok: false, text: d.message ?? "Error" });
    onChanged();
  }

  async function removeModel() {
    if (!(await ask({ title: `¿Eliminar a ${inf.name}?`, message: "Se borran el modelo y todas sus imágenes. No se puede deshacer.", confirmLabel: "Eliminar", danger: true }))) return;
    await api("/api/influencers", "DELETE", { id: inf.id });
    onChanged();
  }

  async function removeImage(id: string) {
    await api("/api/images", "DELETE", { id });
    setImages(images.filter((i) => i.id !== id));
    onChanged();
  }

  const working = busy !== "";
  return (
    <div className="card">
      <div className="mhead">
        {inf.face_url ? <img className="avatar" src={inf.face_url} alt={inf.name} /> : <div className="avatar">👤</div>}
        <div style={{ flex: 1 }}>
          <div className="name" style={{ fontSize: 18 }}>{inf.name}</div>
          <div className="used">{inf.description}</div>
          <div className="used">{inf.face_url ? <span className="tag">Cara de referencia lista</span> : "Sin cara de referencia"}</div>
          <div className="row">
            <button disabled={working} onClick={genFace}>{busy === "face" ? "Generando..." : "Generar cara"}</button>
            <button disabled={working || !consent} onClick={() => fileRef.current?.click()} title={consent ? "" : "Marca la confirmación"}>Empezar desde una foto</button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { fromPhoto(e.target.files?.[0]); e.target.value = ""; }} />
          </div>
          <label className="check">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            La foto es mía, de un personaje ficticio o tengo permiso de la persona retratada.
          </label>
        </div>
        <button onClick={removeModel} title="Eliminar modelo">🗑</button>
      </div>

      {faces.length > 0 && (
        <>
          <label>Caras generadas (elige la de referencia)</label>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))" }}>
            {faces.map((f) => (
              <div key={f.id} className={`thumb ${f.id === inf.face_image_id ? "ref" : ""}`}>
                <img src={f.url} alt="cara" />
                <div className="meta">
                  <button onClick={() => setFace(f.id)} disabled={f.id === inf.face_image_id}>{f.id === inf.face_image_id ? "Referencia ✓" : "Elegir"}</button>
                  <button onClick={() => removeImage(f.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="two">
        <div>
          <div className="name">Paso 1 · 3 ángulos</div>
          <div className="used">Frontal, 3/4 y perfil a partir de la cara de referencia. Garantiza que tu modelo salga igual en cualquier escena.</div>
          <div className="three">
            {ANGLES.map((a) => {
              const img = angleImg(a.id);
              return (
                <div key={a.id}>
                  <div className="slot">{img ? <img src={img.url} alt={a.label} /> : "—"}</div>
                  <div className="cap">{a.label}</div>
                </div>
              );
            })}
          </div>
          <div className="row">
            <button disabled={working || !inf.face_image_id} onClick={genAngles}>
              {busy.startsWith("angles") ? `Generando ${busy.split(":")[1] ?? ""}...` : "Generar ángulos"}
            </button>
          </div>
          {!inf.face_image_id && <div className="used" style={{ marginTop: 6 }}>Primero elige una cara de referencia.</div>}
        </div>

        <div>
          <div className="name">Paso 2 · Crear prompt</div>
          <div className="used">La IA analiza la cara y los ángulos y escribe una descripción detallada del modelo. Se añade automáticamente a tus generaciones.</div>
          <textarea className="prompt-area" style={{ marginTop: 8 }} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Aún no hay prompt. Pulsa «Crear prompt» o escríbelo tú." />
          <div className="row">
            <button className="primary" disabled={working || !inf.face_image_id} onClick={analyze}>{busy === "prompt" ? "Analizando..." : "Crear prompt"}</button>
            <button disabled={working} onClick={savePrompt}>Guardar cambios</button>
          </div>
        </div>
      </div>
      {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
      {dialog}
    </div>
  );
}

type Slot = { id: "frontal" | "tres_cuartos" | "perfil"; label: string; kind: "base" | "angle" };
const SLOTS: Slot[] = [
  { id: "frontal", label: "Frontal", kind: "base" },
  { id: "tres_cuartos", label: "3/4", kind: "angle" },
  { id: "perfil", label: "Perfil", kind: "angle" },
];

function UploadSlot({ label, value, onPick, onClear }: { label: string; value?: string; onPick: (f: File) => void; onClear: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="slot upload" onClick={() => ref.current?.click()}>
        {value ? <img src={value} alt={label} /> : <span>+ Subir</span>}
      </div>
      <div className="cap">
        {label}
        {value && <button className="linkbtn" onClick={onClear}> quitar</button>}
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => { if (e.target.files?.[0]) onPick(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}

function NewModelModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const configured = useConfigured();
  const [mode, setMode] = useState<"ai" | "upload">("ai");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [aiModel, setAiModel] = useState(MODELS[0].id);
  const [genFace, setGenFace] = useState(true);
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [analyze, setAnalyze] = useState(true);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState<Msg>(null);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [busy, onClose]);

  async function pick(slot: string, f: File) {
    try {
      const data = await readImage(f);
      setUploads((u) => ({ ...u, [slot]: data }));
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Error" });
    }
  }

  const canCreate = name.trim() && (mode === "ai" || (uploads.frontal && consent));

  async function create() {
    setMsg(null);
    setBusy("Creando modelo...");
    const d = await api<{ influencer: { id: string } }>("/api/influencers", "POST", { name, description });
    if (!d.ok) { setBusy(""); return setMsg({ ok: false, text: d.message ?? "Error" }); }
    const id = d.influencer.id;

    if (mode === "upload") {
      let faceId = "";
      for (const slot of SLOTS) {
        const image = uploads[slot.id];
        if (!image) continue;
        setBusy(`Guardando ${slot.label}...`);
        const u = await api<{ image: { id: string } }>("/api/images", "POST", { influencerId: id, kind: slot.kind, angle: slot.id, image });
        if (!u.ok) { onCreated(); setBusy(""); return setMsg({ ok: false, text: `Modelo creado, pero falló al guardar ${slot.label}: ${u.message}` }); }
        if (slot.id === "frontal") faceId = u.image.id;
      }
      await api("/api/influencers", "PATCH", { id, face_image_id: faceId });
      if (analyze) {
        setBusy("Creando el prompt del modelo...");
        const a = await api("/api/analyze", "POST", { influencerId: id });
        if (!a.ok) { onCreated(); setBusy(""); return setMsg({ ok: false, text: `Modelo guardado, pero no se pudo crear el prompt: ${a.message}` }); }
      }
    } else if (genFace && description.trim()) {
      setBusy("Generando la primera cara...");
      const g = await api<{ image: { id: string } }>("/api/generate", "POST", {
        influencerId: id, kind: "base", prompt: description, realism: true, model: aiModel, aspect: "3:4",
      });
      if (g.ok) await api("/api/influencers", "PATCH", { id, face_image_id: g.image.id });
      else {
        onCreated();
        setBusy("");
        return setMsg({ ok: false, text: `Modelo creado, pero la cara falló: ${g.message}` });
      }
    }
    onCreated();
    onClose();
  }

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="head">
          <div className="name" style={{ fontSize: 18 }}>Crear nuevo modelo</div>
          <button disabled={!!busy} onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <div className="chips">
          <button className={`chip ${mode === "ai" ? "sel" : ""}`} onClick={() => setMode("ai")}>Generar con IA</button>
          <button className={`chip ${mode === "upload" ? "sel" : ""}`} onClick={() => setMode("upload")}>Subir mis 3 referencias</button>
        </div>

        <label>Nombre</label>
        <input autoFocus placeholder="Nombre del modelo" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Descripción{mode === "upload" ? " (opcional)" : ""}</label>
        <textarea placeholder="Mujer adulta de 28 años, pelo castaño largo, ojos verdes, pecas, rasgos suaves…" value={description} onChange={(e) => setDescription(e.target.value)} />

        {mode === "ai" ? (
          <>
            <label>Modelo de IA para caras y ángulos</label>
            <div className="row" style={{ marginTop: 0 }}>
              <AiModelSelect value={aiModel} onChange={setAiModel} configured={configured} />
            </div>
            <label className="check">
              <input type="checkbox" checked={genFace} onChange={(e) => setGenFace(e.target.checked)} />
              Generar la primera cara al crear (usa la descripción)
            </label>
          </>
        ) : (
          <>
            <label>Tus fotos de referencia (desde tu computadora o celular)</label>
            <div className="three">
              {SLOTS.map((s) => (
                <UploadSlot
                  key={s.id}
                  label={s.id === "frontal" ? "Frontal *" : s.label}
                  value={uploads[s.id]}
                  onPick={(f) => pick(s.id, f)}
                  onClear={() => setUploads(({ [s.id]: _, ...rest }) => rest)}
                />
              ))}
            </div>
            <div className="used" style={{ marginTop: 6 }}>La frontal será la cara de referencia del modelo. 3/4 y perfil son opcionales.</div>
            <label className="check">
              <input type="checkbox" checked={analyze} onChange={(e) => setAnalyze(e.target.checked)} />
              Crear el prompt del modelo a partir de las fotos (análisis con IA)
            </label>
            <label className="check">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              Las fotos son mías, de un personaje ficticio o tengo permiso de la persona retratada.
            </label>
          </>
        )}

        <div className="row">
          <button className="primary" disabled={!canCreate || !!busy} onClick={create}>{busy || (mode === "upload" ? "Guardar modelo" : "Crear modelo")}</button>
          <button disabled={!!busy} onClick={onClose}>Cancelar</button>
        </div>
        {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
      </div>
    </div>
  );
}

export default function Modelos() {
  const { list, loaded, reload } = useInfluencers();
  const configured = useConfigured();
  const [aiModel, setAiModel] = useState(MODELS[0].id);
  const [creating, setCreating] = useState(false);

  return (
    <main>
      <div className="head">
        <div>
          <h1>Mis modelos IA</h1>
          <p className="sub" style={{ marginBottom: 0 }}>
            Crea tu modelo, genera varias caras, elige la de referencia y créale 3 ángulos y un prompt. Después cada generación mantiene la misma cara.
          </p>
        </div>
        <button className="primary" onClick={() => setCreating(true)}>+ Nuevo modelo</button>
      </div>

      {list.length > 0 && (
        <div className="row">
          <span className="used" style={{ alignSelf: "center" }}>IA para caras y ángulos de los modelos:</span>
          <AiModelSelect value={aiModel} onChange={setAiModel} configured={configured} />
        </div>
      )}

      {loaded && list.length === 0 && <p className="sub" style={{ marginTop: 24 }}>Aún no tienes modelos. Pulsa «Nuevo modelo» para empezar.</p>}
      <div style={{ marginTop: 16 }}>
        {list.map((inf) => (
          <ModelCard key={inf.id} inf={inf} aiModel={aiModel} onChanged={reload} />
        ))}
      </div>

      {creating && <NewModelModal onClose={() => setCreating(false)} onCreated={reload} />}
    </main>
  );
}
