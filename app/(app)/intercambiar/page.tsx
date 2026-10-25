"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AiModelSelect from "@/components/AiModelSelect";
import Dropdown from "@/components/Dropdown";
import { api, readImage, useConfigured, useInfluencers } from "@/lib/client";
import { ASPECTS, MODELS } from "@/lib/prompts";

type Collection = { id: string; name: string };
type Result = { ref: string; url?: string; error?: string; pending?: boolean };

const MAX = 10;
const SWAP_ASPECTS = [{ id: "auto", label: "Igual que la referencia" }, ...ASPECTS];
const SWAP_MODELS_DEFAULT = MODELS.find((m) => !m.singleRef)!.id;

export default function Intercambiar() {
  const { list, loaded } = useInfluencers();
  const configured = useConfigured();
  const [influencerId, setInfluencerId] = useState("");
  const [refs, setRefs] = useState<string[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionId, setCollectionId] = useState("");
  const [consent, setConsent] = useState(false);
  const [realism, setRealism] = useState(true);
  const [aspect, setAspect] = useState("auto");
  const [aiModel, setAiModel] = useState(SWAP_MODELS_DEFAULT);
  const [notes, setNotes] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [progress, setProgress] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!influencerId && list[0]) setInfluencerId(list[0].id); }, [list, influencerId]);
  useEffect(() => {
    setCollectionId("");
    if (!influencerId) return setCollections([]);
    api<{ collections: Collection[] }>(`/api/collections?influencerId=${influencerId}`).then((d) => d.ok && setCollections(d.collections));
  }, [influencerId]);

  const inf = list.find((i) => i.id === influencerId);

  async function addFiles(files: FileList | File[] | null) {
    if (!files) return;
    try {
      const imgs = await Promise.all(Array.from(files).filter((f) => f.type.startsWith("image/")).map(readImage));
      setRefs((prev) => [...prev, ...imgs].slice(0, MAX));
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Error al leer las imágenes." });
    }
  }

  async function run() {
    setMsg(null);
    const batch = [...refs];
    setResults(batch.map((ref) => ({ ref, pending: true })));
    let ok = 0;
    for (const [i, ref] of batch.entries()) {
      setProgress(`Intercambiando cara ${i + 1} de ${batch.length}...`);
      const d = await api<{ image: { url: string } }>("/api/generate", "POST", {
        influencerId, kind: "lifestyle", mode: "swap", prompt: notes.trim() || "Keep everything else identical.",
        realism, model: aiModel, aspect, references: [ref], collectionId: collectionId || undefined,
      });
      setResults((prev) => prev.map((r, j) => (j === i ? { ref, url: d.ok ? d.image.url : undefined, error: d.ok ? undefined : d.message } : r)));
      if (d.ok) ok++;
    }
    setProgress("");
    setMsg({ ok: ok === batch.length, text: `${ok} de ${batch.length} imágenes generadas y guardadas${collectionId ? " en la colección" : ""}.` });
  }

  if (loaded && list.length === 0)
    return (
      <main>
        <h1>Intercambiar cara</h1>
        <p className="sub">Primero crea un modelo con cara de referencia en <Link href="/modelos" style={{ color: "var(--accent)" }}>Mis modelos</Link>.</p>
      </main>
    );

  const busy = progress !== "";
  return (
    <main>
      <h1>Intercambiar cara</h1>
      <p className="sub">Sube imágenes de referencia (por ejemplo de Pinterest) y tu modelo las recrea con su cara: misma pose, ropa, fondo y luz.</p>

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
            {inf && !inf.face_url && <div className="used">Este modelo aún no tiene cara de referencia.</div>}
          </div>
          <div className="card">
            <div className="name">2. Guardar en colección</div>
            <div className="used" style={{ margin: "4px 0 8px" }}>Opcional</div>
            <Dropdown block value={collectionId} onChange={setCollectionId} options={[{ value: "", label: "Sin colección" }, ...collections.map((c) => ({ value: c.id, label: c.name }))]} />
          </div>
        </div>

        <div className="card">
          <div className="name">3. Imágenes de referencia ({refs.length}/{MAX})</div>
          <div
            className={`drop ${drag ? "over" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          >
            <strong>Toca para elegir imágenes</strong>
            <span>o arrástralas aquí. Desde el celular puedes usar la galería o la cámara.</span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />

          {refs.length > 0 && (
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))" }}>
              {refs.map((r, i) => (
                <div key={i} className="thumb">
                  <img src={r} alt="" />
                  <div className="meta"><span>Ref {i + 1}</span><button onClick={() => setRefs(refs.filter((_, j) => j !== i))}>×</button></div>
                </div>
              ))}
            </div>
          )}

          <label>Indicaciones extra (opcional)</label>
          <input placeholder="Ej: mantener el pelo suelto, sonrisa suave" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <label className="check">
            <input type="checkbox" checked={realism} onChange={(e) => setRealism(e.target.checked)} /> Realismo fotográfico
          </label>
          <label className="check">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            Tengo derecho a usar estas imágenes de referencia y no incluyen contenido sexual explícito ni menores.
          </label>

          <div className="row">
            <AiModelSelect value={aiModel} onChange={setAiModel} configured={configured} />
            <Dropdown value={aspect} onChange={setAspect} options={SWAP_ASPECTS.map((a) => ({ value: a.id, label: a.label }))} />
            <button className="primary" style={{ marginLeft: "auto" }} disabled={busy || !consent || !refs.length || !inf?.face_url} onClick={run}>
              {busy ? progress : `Intercambiar ${refs.length || ""} ${refs.length === 1 ? "imagen" : "imágenes"}`}
            </button>
          </div>
          {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
        </div>
      </div>

      {results.length > 0 && <h2>Resultados</h2>}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
        {results.map((r, i) => (
          <div key={i} className="thumb" style={{ padding: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <img src={r.ref} alt="referencia" style={{ width: "40%", aspectRatio: "3/4", objectFit: "cover", borderRadius: 6 }} />
              <div style={{ flex: 1 }}>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noreferrer"><img src={r.url} alt="resultado" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: 6 }} /></a>
                ) : (
                  <div className="slot" style={{ padding: 6, textAlign: "center" }}>{r.pending ? "Generando..." : r.error}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
