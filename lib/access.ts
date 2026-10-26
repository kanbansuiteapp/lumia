// Control de acceso por periodo: el super admin asigna app_metadata.access_until a cada cuenta.
// Valores: fecha ISO (vence ese día), "never" (sin vencimiento) o ausente (pendiente de activación).
export type Access = "ok" | "pending" | "expired";

type U = { app_metadata?: Record<string, unknown> | null } | null | undefined;

export function accessUntil(user: U): string | null {
  const v = user?.app_metadata?.access_until;
  return typeof v === "string" ? v : null;
}

export function accessState(user: U): Access {
  if (user?.app_metadata?.role === "superadmin") return "ok";
  const until = accessUntil(user);
  if (!until) return "pending";
  if (until === "never") return "ok";
  return new Date(until).getTime() > Date.now() ? "ok" : "expired";
}

export type AccessSpec =
  | { mode: "days"; days: number }
  | { mode: "date"; date: string } // YYYY-MM-DD
  | { mode: "never" };

// Convierte lo que elige el admin en el valor que se guarda. Devuelve null si no es válido.
export function resolveAccess(spec: AccessSpec | undefined): string | null {
  if (!spec) return null;
  if (spec.mode === "never") return "never";
  if (spec.mode === "days") {
    const d = Number(spec.days);
    if (!Number.isInteger(d) || d < 1 || d > 3650) return null;
    return new Date(Date.now() + d * 86_400_000).toISOString();
  }
  if (spec.mode === "date") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(spec.date)) return null;
    const t = new Date(`${spec.date}T23:59:59Z`);
    return Number.isNaN(t.getTime()) || t.getTime() <= Date.now() ? null : t.toISOString();
  }
  return null;
}
