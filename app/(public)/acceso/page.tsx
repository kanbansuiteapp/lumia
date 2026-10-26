import { redirect } from "next/navigation";
import { accessState, accessUntil } from "@/lib/access";
import { getUser } from "@/lib/auth";

export default async function Acceso() {
  const user = await getUser();
  if (!user) redirect("/login");
  const state = accessState(user);
  if (state === "ok") redirect("/modelos");
  const until = accessUntil(user);

  return (
    <main className="authbox">
      <div className="card">
        <h1 style={{ fontSize: 22 }}>{state === "expired" ? "Tu acceso venció" : "Cuenta pendiente de activación"}</h1>
        <p className="sub">
          {state === "expired"
            ? `Tu periodo de acceso terminó el ${new Date(until!).toLocaleDateString()}. Contacta al administrador para renovarlo.`
            : "Tu cuenta está creada, pero el administrador todavía debe activarla y asignarte un periodo de acceso."}
        </p>
        <p className="used">Sesión iniciada como {user.email}</p>
        <form action="/auth/logout" method="post" className="row">
          <button type="submit">Cerrar sesión</button>
        </form>
      </div>
    </main>
  );
}
