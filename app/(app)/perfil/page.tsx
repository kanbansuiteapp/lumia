"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Msg = { ok: boolean; text: string } | null;

export default function Perfil() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [created, setCreated] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [busy, setBusy] = useState("");
  const [msgName, setMsgName] = useState<Msg>(null);
  const [msgEmail, setMsgEmail] = useState<Msg>(null);
  const [msgPass, setMsgPass] = useState<Msg>(null);

  useEffect(() => {
    supabaseBrowser().auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      setName((u.user_metadata?.full_name as string) ?? "");
      setCurrentEmail(u.email ?? "");
      setEmail(u.email ?? "");
      setAdmin(u.app_metadata?.role === "superadmin");
      setCreated(u.created_at);
      setLoaded(true);
    });
  }, []);

  async function saveName() {
    setBusy("name"); setMsgName(null);
    const { error } = await supabaseBrowser().auth.updateUser({ data: { full_name: name.trim() } });
    setMsgName(error ? { ok: false, text: error.message } : { ok: true, text: "Nombre guardado." });
    setBusy("");
    router.refresh();
  }

  async function saveEmail() {
    setBusy("email"); setMsgEmail(null);
    const { error } = await supabaseBrowser().auth.updateUser({ email: email.trim() }, { emailRedirectTo: `${location.origin}/auth/callback` });
    setMsgEmail(
      error
        ? { ok: false, text: error.message }
        : { ok: true, text: "Te enviamos un enlace de confirmación. Tu correo cambiará cuando lo abras." },
    );
    setBusy("");
  }

  async function savePassword() {
    setMsgPass(null);
    if (password.length < 6) return setMsgPass({ ok: false, text: "La contraseña debe tener al menos 6 caracteres." });
    if (password !== password2) return setMsgPass({ ok: false, text: "Las contraseñas no coinciden." });
    setBusy("pass");
    const { error } = await supabaseBrowser().auth.updateUser({ password });
    setMsgPass(error ? { ok: false, text: error.message } : { ok: true, text: "Contraseña actualizada." });
    if (!error) { setPassword(""); setPassword2(""); }
    setBusy("");
  }

  if (!loaded) return <main><p className="sub">Cargando...</p></main>;
  return (
    <main style={{ maxWidth: 640 }}>
      <h1>Mi perfil</h1>
      <p className="sub">
        {admin ? "Super admin" : "Usuario"} · cuenta creada el {new Date(created).toLocaleDateString()}
      </p>

      <div className="card">
        <div className="name">Datos personales</div>
        <label>Nombre</label>
        <input value={name} placeholder="Tu nombre" onChange={(e) => setName(e.target.value)} />
        <div className="row">
          <button className="primary" disabled={busy === "name"} onClick={saveName}>{busy === "name" ? "Guardando..." : "Guardar nombre"}</button>
        </div>
        {msgName && <div className={`msg ${msgName.ok ? "ok" : "err"}`}>{msgName.text}</div>}
      </div>

      <div className="card">
        <div className="name">Correo</div>
        <div className="used">Con este correo inicias sesión.</div>
        <label>Correo electrónico</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="row">
          <button disabled={busy === "email" || !email.trim() || email.trim() === currentEmail} onClick={saveEmail}>
            {busy === "email" ? "Enviando..." : "Cambiar correo"}
          </button>
        </div>
        {msgEmail && <div className={`msg ${msgEmail.ok ? "ok" : "err"}`}>{msgEmail.text}</div>}
      </div>

      <div className="card">
        <div className="name">Contraseña</div>
        <label>Nueva contraseña</label>
        <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label>Repite la contraseña</label>
        <input type="password" autoComplete="new-password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
        <div className="row">
          <button disabled={busy === "pass" || !password} onClick={savePassword}>{busy === "pass" ? "Guardando..." : "Cambiar contraseña"}</button>
        </div>
        {msgPass && <div className={`msg ${msgPass.ok ? "ok" : "err"}`}>{msgPass.text}</div>}
      </div>
    </main>
  );
}
