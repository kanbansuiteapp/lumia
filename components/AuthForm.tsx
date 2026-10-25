"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

const translate = (m: string) => {
  if (/invalid login credentials/i.test(m)) return "Correo o contraseña incorrectos.";
  if (/email not confirmed/i.test(m)) return "Confirma tu correo antes de entrar (revisa tu bandeja).";
  if (/already registered/i.test(m)) return "Ese correo ya tiene una cuenta. Inicia sesión.";
  if (/password should be at least/i.test(m)) return "La contraseña debe tener al menos 6 caracteres.";
  if (/rate limit/i.test(m)) return "Demasiados intentos. Espera unos minutos.";
  return m;
};

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(
    params.get("error") === "confirmacion" ? { ok: false, text: "El enlace de confirmación no es válido o venció." } : null,
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const sb = supabaseBrowser();
    if (mode === "login") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) { setBusy(false); return setMsg({ ok: false, text: translate(error.message) }); }
    } else {
      const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
      if (error) { setBusy(false); return setMsg({ ok: false, text: translate(error.message) }); }
      if (!data.session) {
        setBusy(false);
        return setMsg({ ok: true, text: "Cuenta creada. Revisa tu correo y confirma tu cuenta para entrar." });
      }
    }
    router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/modelos");
    router.refresh();
  }

  return (
    <main className="authbox">
      <div className="card">
        <h1 style={{ fontSize: 22 }}>{mode === "login" ? "Entrar a Lumia" : "Crear tu cuenta"}</h1>
        <p className="sub">{mode === "login" ? "Accede a tus modelos y contenido." : "Empieza a crear tu influencer con IA."}</p>
        <form onSubmit={submit}>
          <label>Correo</label>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Contraseña</label>
          <input type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="row">
            <button className="primary" style={{ width: "100%" }} disabled={busy}>
              {busy ? "Un momento..." : mode === "login" ? "Entrar" : "Crear cuenta"}
            </button>
          </div>
        </form>
        {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
        <p className="used" style={{ marginTop: 16, textAlign: "center" }}>
          {mode === "login" ? (
            <>¿No tienes cuenta? <Link href="/registro" style={{ color: "var(--accent)" }}>Crear cuenta</Link></>
          ) : (
            <>¿Ya tienes cuenta? <Link href="/login" style={{ color: "var(--accent)" }}>Entrar</Link></>
          )}
        </p>
      </div>
    </main>
  );
}
