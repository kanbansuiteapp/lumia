"use client";

import { useCallback, useEffect, useState } from "react";
import { type AdminUser } from "@/lib/admin";
import { api } from "@/lib/client";
import AdminUserModal from "./AdminUserModal";

const fmt = (d: string | null) => (d ? new Date(d).toLocaleString() : "—");

function accessLabel(u: AdminUser) {
  if (u.admin) return <span className="tag">Siempre</span>;
  if (u.access === "pending") return <span style={{ color: "var(--err)" }}>Pendiente</span>;
  if (u.access_until === "never") return <span className="tag">Sin vencimiento</span>;
  const d = new Date(u.access_until!);
  const days = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  if (u.access === "expired") return <span style={{ color: "var(--err)" }}>Vencido el {d.toLocaleDateString()}</span>;
  return <span>{d.toLocaleDateString()} <span className="used">({days} d)</span></span>;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orphans, setOrphans] = useState({ models: 0, keys: 0 });
  const [me, setMe] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState("");
  const [modal, setModal] = useState<{ user: AdminUser | null } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const d = await api<{ users: AdminUser[]; orphans: { models: number; keys: number }; me: string }>("/api/admin/users");
    if (d.ok) { setUsers(d.users); setOrphans(d.orphans); setMe(d.me); }
    else setMsg({ ok: false, text: d.message ?? "Error" });
    setLoaded(true);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function suspend(u: AdminUser) {
    setBusy(u.id); setMsg(null);
    const d = await api("/api/admin/users", "PATCH", { id: u.id, suspended: !u.suspended });
    setMsg(d.ok ? { ok: true, text: `${u.email}: ${u.suspended ? "reactivado" : "suspendido"}.` } : { ok: false, text: d.message ?? "Error" });
    setBusy(""); load();
  }
  async function remove(u: AdminUser) {
    if (!confirm(`¿Eliminar a ${u.email}? Se borran su cuenta, sus ${u.models} modelos y sus ${u.images} imágenes. No se puede deshacer.`)) return;
    setBusy(u.id); setMsg(null);
    const d = await api("/api/admin/users", "DELETE", { id: u.id });
    setMsg(d.ok ? { ok: true, text: `${u.email} eliminado.` } : { ok: false, text: d.message ?? "Error" });
    setBusy(""); load();
  }
  async function claim() {
    setBusy("claim");
    const d = await api<{ models: number; keys: number }>("/api/admin/claim", "POST");
    setMsg(d.ok ? { ok: true, text: `Asignados a tu cuenta: ${d.models} modelos y ${d.keys} claves.` } : { ok: false, text: d.message ?? "Error" });
    setBusy(""); load();
  }

  const total = (k: "models" | "images" | "keys") => users.reduce((s, u) => s + u[k], 0);
  return (
    <div>
      <div className="head">
        <div>
          <h2 style={{ margin: 0, fontSize: 20 }}>Usuarios y accesos</h2>
          <p className="sub" style={{ marginBottom: 0 }}>Solo tú ves esto. Crea y gestiona las cuentas de Lumia.</p>
        </div>
        <button className="primary" onClick={() => setModal({ user: null })}>+ Crear cuenta</button>
      </div>
      <div style={{ height: 16 }} />

      <div className="cards4" style={{ marginBottom: 16 }}>
        <div className="card"><div className="used">Usuarios</div><div className="stat">{users.length}</div></div>
        <div className="card"><div className="used">Modelos</div><div className="stat">{total("models")}</div></div>
        <div className="card"><div className="used">Imágenes</div><div className="stat">{total("images")}</div></div>
        <div className="card"><div className="used">Suspendidos</div><div className="stat">{users.filter((u) => u.suspended).length}</div></div>
      </div>

      {(orphans.models > 0 || orphans.keys > 0) && (
        <div className="card">
          <div className="name">Datos sin dueño</div>
          <div className="used">Hay {orphans.models} modelos y {orphans.keys} claves creados antes del login que no pertenecen a nadie.</div>
          <div className="row"><button className="primary" disabled={busy === "claim"} onClick={claim}>Asignar a mi cuenta</button></div>
        </div>
      )}

      {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`} style={{ marginBottom: 12 }}>{msg.text}</div>}

      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <table className="tbl">
          <thead>
            <tr><th>Correo</th><th>Acceso</th><th>Último acceso</th><th>Modelos</th><th>Imágenes</th><th>Claves</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {!loaded && <tr><td colSpan={8} className="used">Cargando...</td></tr>}
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name && <div>{u.name}</div>}<span className={u.name ? "used" : ""}>{u.email}</span>{u.phone && <div className="used">{u.phone}</div>}{u.id === me && <span className="tag"> (tú)</span>}{u.admin && <span className="tag"> · super admin</span>}</td>
                <td>{accessLabel(u)}</td>
                <td>{fmt(u.last_sign_in_at)}</td>
                <td>{u.models}</td>
                <td>{u.images}</td>
                <td>{u.keys}</td>
                <td>{u.suspended ? <span style={{ color: "var(--err)" }}>Suspendido</span> : u.confirmed ? <span className="tag">Activo</span> : <span className="used">Sin confirmar</span>}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {u.id !== me && !u.admin && (
                    <>
                      <button disabled={busy === u.id} onClick={() => setModal({ user: u })}>{u.access === "pending" ? "Activar" : "Editar"}</button>{" "}
                      <button disabled={busy === u.id} onClick={() => suspend(u)}>{u.suspended ? "Reactivar" : "Suspender"}</button>{" "}
                      <button disabled={busy === u.id} onClick={() => remove(u)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && <AdminUserModal user={modal.user} onClose={() => setModal(null)} onSaved={load} />}
    </div>
  );
}
