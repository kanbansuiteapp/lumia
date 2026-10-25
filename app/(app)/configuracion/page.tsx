"use client";

import { useEffect, useState } from "react";

type Field = { name: string; label: string };
type ProviderInfo = { id: string; name: string; usedFor: string; fields: Field[]; savedAt: string | null };
type Msg = { ok: boolean; text: string };

function ProviderCard({ p, onChange }: { p: ProviderInfo; onChange: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg | null>(null);

  async function call(method: string, body: object) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/keys", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: p.id, ...body }),
      });
      const data = await res.json();
      setMsg({ ok: data.ok, text: data.message });
      if (data.ok) setValues({});
      onChange();
    } catch {
      setMsg({ ok: false, text: "Error de red al contactar la app." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="head">
        <div>
          <div className="name">{p.name}</div>
          <div className="used">{p.usedFor}</div>
        </div>
        <span className={`badge ${p.savedAt ? "on" : ""}`}>
          {p.savedAt ? `Guardada · ${new Date(p.savedAt).toLocaleString()}` : "Sin configurar"}
        </span>
      </div>

      {p.fields.map((f) => (
        <div key={f.name}>
          <label>{f.label}</label>
          <input
            type="password"
            autoComplete="off"
            placeholder={p.savedAt ? "•••••••• (escribe para reemplazar)" : ""}
            value={values[f.name] ?? ""}
            onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
          />
        </div>
      ))}

      <div className="row">
        <button className="primary" disabled={busy} onClick={() => call("POST", { values })}>
          {busy ? "Verificando..." : "Guardar"}
        </button>
        {p.savedAt && (
          <>
            <button disabled={busy} onClick={() => call("POST", { testOnly: true })}>Probar guardada</button>
            <button disabled={busy} onClick={() => call("DELETE", {})}>Eliminar</button>
          </>
        )}
      </div>

      {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
    </div>
  );
}

export default function Configuracion() {
  const [list, setList] = useState<ProviderInfo[]>([]);

  async function load() {
    const res = await fetch("/api/keys");
    setList((await res.json()).providers);
  }
  useEffect(() => { load(); }, []);

  return (
    <main>
      <h1>Configuración</h1>
      <p className="sub">
        Conecta las API de tus proveedores. Al guardar, la clave se verifica contra el proveedor y solo se guarda si funciona.
      </p>
      {list.map((p) => (
        <ProviderCard key={p.id} p={p} onChange={load} />
      ))}
    </main>
  );
}
