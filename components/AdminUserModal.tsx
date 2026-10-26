"use client";

import { useEffect, useState } from "react";
import { type AdminUser } from "@/lib/admin";
import { api } from "@/lib/client";
import Dropdown from "./Dropdown";

const PERIODS = [
  { value: "7", label: "7 días" },
  { value: "15", label: "15 días" },
  { value: "30", label: "30 días" },
  { value: "90", label: "90 días" },
  { value: "180", label: "6 meses" },
  { value: "365", label: "1 año" },
  { value: "never", label: "Sin vencimiento" },
  { value: "date", label: "Hasta una fecha…" },
];

type Msg = { ok: boolean; text: string } | null;

export default function AdminUserModal({ user, onClose, onSaved }: { user: AdminUser | null; onClose: () => void; onSaved: () => void }) {
  const editing = !!user;
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [period, setPeriod] = useState(user && user.access !== "pending" ? "keep" : "30");
  const [date, setDate] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [created, setCreated] = useState<{ email: string; password: string; until: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [busy, onClose]);

  const options = user && user.access !== "pending" ? [{ value: "keep", label: user.access_until === "never" ? "Mantener (sin vencimiento)" : `Mantener (hasta ${new Date(user.access_until!).toLocaleDateString()})` }, ...PERIODS] : PERIODS;

  function accessSpec() {
    if (period === "keep") return undefined;
    if (period === "never") return { mode: "never" };
    if (period === "date") return { mode: "date", date };
    return { mode: "days", days: Number(period) };
  }

  async function save() {
    setBusy(true); setMsg(null);
    if (editing) {
      const d = await api("/api/admin/users", "PATCH", { id: user!.id, name, phone, access: accessSpec(), password: password || undefined });
      setBusy(false);
      if (!d.ok) return setMsg({ ok: false, text: d.message ?? "Error" });
      onSaved(); onClose();
    } else {
      const d = await api<{ email: string; password: string; access_until: string }>("/api/admin/users", "POST", { name, email, phone, access: accessSpec(), password: password || undefined });
      setBusy(false);
      if (!d.ok) return setMsg({ ok: false, text: d.message ?? "Error" });
      onSaved();
      setCreated({ email: d.email, password: d.password, until: d.access_until });
    }
  }

  async function copy() {
    const text = `Lumia: ${location.origin}/login\nCorreo: ${created!.email}\nContraseña: ${created!.password}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setMsg({ ok: false, text: "No se pudo copiar. Cópialo a mano." }); }
  }

  const needsDate = period === "date" && !date;
  const valid = name.trim().length >= 2 && (editing || email.trim()) && !needsDate;

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        {created ? (
          <>
            <div className="head"><div className="name" style={{ fontSize: 18 }}>Cuenta creada</div></div>
            <p className="sub">Comparte estos datos con la persona. La contraseña solo se muestra ahora; podrá cambiarla en Mi perfil.</p>
            <div className="cred">
              <div><span className="used">Correo</span><strong>{created.email}</strong></div>
              <div><span className="used">Contraseña</span><strong>{created.password}</strong></div>
              <div><span className="used">Acceso hasta</span><strong>{created.until === "never" ? "Sin vencimiento" : new Date(created.until).toLocaleDateString()}</strong></div>
            </div>
            <div className="row">
              <button className="primary" onClick={copy}>{copied ? "Copiado ✓" : "Copiar datos de acceso"}</button>
              <button onClick={onClose}>Cerrar</button>
            </div>
            {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
          </>
        ) : (
          <>
            <div className="head">
              <div className="name" style={{ fontSize: 18 }}>{editing ? (user!.access === "pending" ? "Activar cuenta" : "Editar cuenta") : "Crear cuenta"}</div>
              <button disabled={busy} onClick={onClose} aria-label="Cerrar">×</button>
            </div>

            <label>Nombre</label>
            <input autoFocus value={name} placeholder="Nombre de la persona" onChange={(e) => setName(e.target.value)} />
            <label>Correo (con el que iniciará sesión)</label>
            <input type="email" value={email} disabled={editing} placeholder="correo@ejemplo.com" onChange={(e) => setEmail(e.target.value)} />
            <label>Teléfono (opcional)</label>
            <input type="tel" value={phone} placeholder="+57 300 000 0000" onChange={(e) => setPhone(e.target.value)} />

            <label>Periodo de acceso</label>
            <div className="row" style={{ marginTop: 0 }}>
              <Dropdown value={period} onChange={setPeriod} options={options} />
              {period === "date" && <input type="date" style={{ width: "auto" }} value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />}
            </div>

            <label>{editing ? "Nueva contraseña (opcional)" : "Contraseña (opcional)"}</label>
            <input type="text" autoComplete="off" value={password} placeholder={editing ? "Déjalo vacío para no cambiarla" : "Vacío = se genera una segura"} onChange={(e) => setPassword(e.target.value)} />

            <div className="row">
              <button className="primary" disabled={busy || !valid} onClick={save}>{busy ? "Guardando..." : editing ? "Guardar" : "Crear cuenta"}</button>
              <button disabled={busy} onClick={onClose}>Cancelar</button>
            </div>
            {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
          </>
        )}
      </div>
    </div>
  );
}
