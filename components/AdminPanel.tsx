"use client";

import { useCallback, useEffect, useState } from "react";
import { type AdminUser } from "@/lib/admin";
import { api } from "@/lib/client";

const fmt = (d: string | null) => (d ? new Date(d).toLocaleString() : "—");

export default function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orphans, setOrphans] = useState({ models: 0, keys: 0 });
  const [me, setMe] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState("");
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
    <main>
      <h1>Panel de administración</h1>
      <p className="sub">Solo tú ves esto. Gestiona las cuentas de Lumia.</p>

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
            <tr><th>Correo</th><th>Registro</th><th>Último acceso</th><th>Modelos</th><th>Imágenes</th><th>Claves</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {!loaded && <tr><td colSpan={8} className="used">Cargando...</td></tr>}
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}{u.id === me && <span className="tag"> (tú)</span>}{u.admin && <span className="tag"> · super admin</span>}</td>
                <td>{fmt(u.created_at)}</td>
                <td>{fmt(u.last_sign_in_at)}</td>
                <td>{u.models}</td>
                <td>{u.images}</td>
                <td>{u.keys}</td>
                <td>{u.suspended ? <span style={{ color: "var(--err)" }}>Suspendido</span> : u.confirmed ? <span className="tag">Activo</span> : <span className="used">Sin confirmar</span>}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {u.id !== me && !u.admin && (
                    <>
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
    </main>
  );
}
