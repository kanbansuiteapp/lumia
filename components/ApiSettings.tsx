"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";
import { useConfirm } from "./useConfirm";

type Field = { name: string; label: string };
type Provider = { id: string; name: string; usedFor: string; docsUrl: string | null; fields: Field[]; savedAt: string | null };
type Check = { state: "checking" | "ok" | "fail"; message?: string };

function Logo({ id, size = 26 }: { id: string; size?: number }) {
  return (
    <span className="logo-tile" style={{ width: size + 18, height: size + 18 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/logos/${id}.svg`} alt="" width={size} height={size} />
    </span>
  );
}

function ConnectModal({ p, onClose, onSaved }: { p: Provider; onClose: () => void; onSaved: (p: Provider, savedAt: string) => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [busy, onClose]);

  async function save() {
    setBusy(true); setError("");
    const d = await api<{ savedAt: string }>("/api/keys", "POST", { provider: p.id, values });
    setBusy(false);
    if (!d.ok) return setError(d.message ?? "No se pudo guardar.");
    setDone(true);
    onSaved(p, d.savedAt);
    setTimeout(onClose, 1400);
  }

  const ready = p.fields.every((f) => values[f.name]?.trim());
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="head" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Logo id={p.id} />
            <div>
              <div className="name" style={{ fontSize: 18 }}>{p.savedAt ? "Reconfigurar" : "Conectar"} {p.name}</div>
              <div className="used">{p.usedFor}</div>
            </div>
          </div>
          <button disabled={busy} onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        {done ? (
          <div className="msg ok" style={{ marginTop: 16, fontSize: 15 }}>✓ Guardada y funcionando. {p.name} quedó conectado.</div>
        ) : (
          <>
            {p.fields.map((f, i) => (
              <div key={f.name}>
                <label>{f.label}</label>
                <input
                  type="password"
                  autoComplete="off"
                  autoFocus={i === 0}
                  placeholder={p.savedAt ? "•••••••• (escribe para reemplazar)" : ""}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  onKeyDown={(e) => { if (e.key === "Enter" && ready && !busy) save(); }}
                />
              </div>
            ))}
            {p.docsUrl && (
              <p className="used" style={{ marginTop: 10 }}>
                ¿No tienes la clave? <a href={p.docsUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>Consíguela en {p.name}</a>
              </p>
            )}
            <p className="used" style={{ marginTop: 6 }}>Al guardar se verifica contra {p.name}; solo se guarda si funciona. Se almacena cifrada.</p>
            <div className="row">
              <button className="primary" disabled={busy || !ready} onClick={save}>{busy ? "Verificando..." : "Verificar y guardar"}</button>
              <button disabled={busy} onClick={onClose}>Cancelar</button>
            </div>
            {error && <div className="msg err">{error}</div>}
          </>
        )}
      </div>
    </div>
  );
}

export default function ApiSettings() {
  const [list, setList] = useState<Provider[] | null>(null);
  const [checks, setChecks] = useState<Record<string, Check>>({});
  const [modal, setModal] = useState<Provider | null>(null);
  const { ask, dialog } = useConfirm();

  const verify = useCallback(async (id: string) => {
    setChecks((c) => ({ ...c, [id]: { state: "checking" } }));
    const d = await api("/api/keys", "POST", { provider: id, testOnly: true });
    setChecks((c) => ({ ...c, [id]: d.ok ? { state: "ok" } : { state: "fail", message: d.message } }));
  }, []);

  const load = useCallback(async () => {
    const d = await api<{ providers: Provider[] }>("/api/keys");
    const providers = (d as unknown as { providers: Provider[] }).providers ?? [];
    setList(providers);
    providers.filter((p) => p.savedAt).forEach((p) => verify(p.id));
  }, [verify]);
  useEffect(() => { load(); }, [load]);

  function onSaved(p: Provider, savedAt: string) {
    setList((l) => l?.map((x) => (x.id === p.id ? { ...x, savedAt } : x)) ?? l);
    setChecks((c) => ({ ...c, [p.id]: { state: "ok" } }));
  }

  async function remove(p: Provider) {
    if (!(await ask({ title: `¿Desconectar ${p.name}?`, message: "Se borra la clave guardada. Podrás conectarla de nuevo cuando quieras.", confirmLabel: "Desconectar", danger: true }))) return;
    await api("/api/keys", "DELETE", { provider: p.id });
    setChecks((c) => { const { [p.id]: _, ...rest } = c; return rest; });
    setList((l) => l?.map((x) => (x.id === p.id ? { ...x, savedAt: null } : x)) ?? l);
  }

  return (
    <>
      <p className="sub">Conecta las plataformas de IA que vas a usar. Cada clave se verifica al guardarla y se almacena cifrada.</p>
      {!list && <p className="sub">Cargando...</p>}
      <div className="prov-grid">
        {list?.map((p) => {
          const c = checks[p.id];
          const connected = !!p.savedAt;
          return (
            <div key={p.id} className="card prov-card">
              <div className="prov-top">
                <Logo id={p.id} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="name">{p.name}</div>
                  <div className="used">{p.usedFor}</div>
                </div>
              </div>

              <div className="prov-status">
                {!connected && <span className="st st-none">Sin conectar</span>}
                {connected && (!c || c.state === "checking") && <span className="st st-check">Verificando…</span>}
                {connected && c?.state === "ok" && <span className="st st-ok">● Funcionando</span>}
                {connected && c?.state === "fail" && <span className="st st-fail">● No responde</span>}
                {connected && <span className="used">Guardada {new Date(p.savedAt!).toLocaleDateString()}</span>}
              </div>
              {connected && c?.state === "fail" && <div className="msg err" style={{ marginTop: 8 }}>{c.message}</div>}

              <div className="row" style={{ marginTop: 14 }}>
                <button className={connected ? "" : "primary"} onClick={() => setModal(p)}>{connected ? "Reconfigurar" : "Conectar"}</button>
                {connected && <button onClick={() => verify(p.id)}>Probar</button>}
                {connected && <button onClick={() => remove(p)}>Desconectar</button>}
              </div>
            </div>
          );
        })}
      </div>
      {modal && <ConnectModal p={modal} onClose={() => setModal(null)} onSaved={onSaved} />}
      {dialog}
    </>
  );
}
